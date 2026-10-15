import { DEFAULT_SORT, normalize, sortTitles } from '../utils/catalog.js'

// Camada única de acesso à TMDB. Nenhum componente faz fetch por conta própria.
const API_BASE = 'https://api.themoviedb.org/3'
const LANGUAGE = 'pt-BR'
const REGION = 'BR'
const CACHE_TTL_MS = 10 * 60 * 1000
const MAX_PAGES = 500 // limite da TMDB
const MIN_VOTES = 5 // abaixo disso a nota não é confiável e não é exibida

const DEFAULT_IMAGES = {
  baseUrl: 'https://image.tmdb.org/t/p/',
  logoSizes: ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
  posterSizes: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
  backdropSizes: ['w300', 'w780', 'w1280', 'original'],
}
let imageConfig = DEFAULT_IMAGES

// code: 'missing-key' | 'invalid-key' | 'rate-limit' | 'network' | 'not-found' | 'http'
export class TmdbError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'TmdbError'
    this.code = code
  }
}

function readKey() {
  const raw = import.meta.env.VITE_TMDB_API_KEY
  return typeof raw === 'string' ? raw.trim() : ''
}

export const isTmdbConfigured = () => readKey() !== ''

// ---------- Requisições (com cache e deduplicação) ----------
const cache = new Map()

function request(path, params = {}) {
  const key = readKey()
  if (!key) {
    return Promise.reject(new TmdbError('missing-key', 'A chave da TMDB não está configurada.'))
  }

  // Token de leitura (v4) é um JWT e vai no cabeçalho. A chave v3 vai na URL.
  const isToken = key.split('.').length === 3
  const url = new URL(`${API_BASE}${path}`)
  Object.entries({ language: LANGUAGE, ...params }).forEach(([name, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(name, String(value))
    }
  })

  const cacheKey = url.toString() // sem a chave
  if (!isToken) url.searchParams.set('api_key', key)

  const hit = cache.get(cacheKey)
  if (hit && Date.now() - hit.time < CACHE_TTL_MS) return hit.promise

  const options = isToken ? { headers: { Authorization: `Bearer ${key}` } } : undefined

  const promise = fetch(url, options)
    .catch(() => {
      throw new TmdbError('network', 'Sem conexão com a TMDB.')
    })
    .then(async (response) => {
      if (response.status === 401) throw new TmdbError('invalid-key', 'A TMDB recusou a chave.')
      if (response.status === 404) throw new TmdbError('not-found', 'Título não encontrado.')
      if (response.status === 429) throw new TmdbError('rate-limit', 'Limite de requisições da TMDB.')
      if (!response.ok) throw new TmdbError('http', `Erro ${response.status} da TMDB.`)
      try {
        return await response.json()
      } catch {
        throw new TmdbError('http', 'Resposta inválida da TMDB.')
      }
    })

  cache.set(cacheKey, { promise, time: Date.now() })
  // Falhas não ficam em cache: "tentar novamente" faz uma nova requisição de verdade
  promise.catch(() => {
    if (cache.get(cacheKey)?.promise === promise) cache.delete(cacheKey)
  })

  return promise
}

// ---------- Imagens (configuração oficial da TMDB) ----------
let imageConfigPromise = null

export function loadImageConfig() {
  if (!imageConfigPromise) {
    imageConfigPromise = request('/configuration')
      .then((data) => {
        const images = data?.images
        if (images?.secure_base_url) {
          imageConfig = {
            baseUrl: images.secure_base_url,
            logoSizes: images.logo_sizes ?? DEFAULT_IMAGES.logoSizes,
            posterSizes: images.poster_sizes ?? DEFAULT_IMAGES.posterSizes,
            backdropSizes: images.backdrop_sizes ?? DEFAULT_IMAGES.backdropSizes,
          }
        }
        return imageConfig
      })
      .catch(() => {
        imageConfigPromise = null
        return imageConfig
      })
  }
  return imageConfigPromise
}

function pickSize(available, preferred) {
  if (available.includes(preferred)) return preferred
  const sized = available.filter((size) => size !== 'original')
  return sized.length ? sized[sized.length - 1] : 'original'
}

// Retorna { src, srcSet } ou null quando o título não tem pôster
export function posterSources(path) {
  if (!path) return null
  const { baseUrl, posterSizes } = imageConfig
  const url = (width) => `${baseUrl}${pickSize(posterSizes, width)}${path}`
  return {
    src: url('w342'),
    srcSet: `${url('w185')} 185w, ${url('w342')} 342w, ${url('w500')} 500w`,
  }
}

export function providerLogoUrl(path) {
  if (!path) return null
  const { baseUrl, logoSizes } = imageConfig
  return `${baseUrl}${pickSize(logoSizes, 'w92')}${path}`
}

export function backdropUrl(path) {
  if (!path) return null
  return `${imageConfig.baseUrl}${pickSize(imageConfig.backdropSizes, 'w780')}${path}`
}

// ---------- Gêneros ----------
const genreNames = new Map() // id -> nome (filmes e séries compartilham o mesmo espaço de ids)

export async function getGenres() {
  const [movie, tv] = await Promise.all([request('/genre/movie/list'), request('/genre/tv/list')])
  const result = { movie: movie.genres ?? [], tv: tv.genres ?? [] }
  ;[...result.movie, ...result.tv].forEach((genre) => genreNames.set(genre.id, genre.name))
  return result
}

// ---------- Normalização ----------
function yearOf(date) {
  const year = Number.parseInt(String(date ?? '').slice(0, 4), 10)
  return Number.isFinite(year) ? year : null
}

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text
}

function languageName(code) {
  if (!code) return null
  try {
    return capitalize(new Intl.DisplayNames(['pt-BR'], { type: 'language' }).of(code) ?? '') || null
  } catch {
    return null
  }
}

// Formato único de título usado pela interface (o catálogo de demonstração segue o mesmo formato)
export function normalizeTitle(raw, mediaType) {
  const isMovie = mediaType === 'movie'
  const date = (isMovie ? raw.release_date : raw.first_air_date) || ''
  const genreIds = raw.genre_ids ?? (raw.genres ?? []).map((genre) => genre.id)
  const votes = raw.vote_count ?? 0

  return {
    id: `${mediaType}-${raw.id}`,
    source: 'tmdb',
    tmdbId: raw.id,
    mediaType,
    type: isMovie ? 'Filme' : 'Série',
    title: (isMovie ? raw.title : raw.name) || 'Sem título',
    year: yearOf(date),
    releaseDate: date,
    genreIds,
    genres: genreIds.map((id) => genreNames.get(id)).filter(Boolean),
    rating: votes >= MIN_VOTES && raw.vote_average ? Math.round(raw.vote_average * 10) / 10 : null,
    voteCount: votes,
    popularity: raw.popularity ?? 0,
    synopsis: raw.overview?.trim() || null,
    keywords: [],
    posterPath: raw.poster_path || null,
    backdropPath: raw.backdrop_path || null,
    // Preenchidos só pelos detalhes
    duration: null,
    seasons: null,
    episodes: null,
    episodeRuntime: null,
    language: null,
    certification: null,
  }
}

// ---------- Listas, busca e filtros ----------
// "Animações" não é um formato: é o gênero de id 16, que existe para filmes e séries.
const ANIMATION_GENRE_ID = 16

const SORT_BY = {
  relevance: { movie: 'popularity.desc', tv: 'popularity.desc' },
  rating: { movie: 'vote_average.desc', tv: 'vote_average.desc' },
  recent: { movie: 'primary_release_date.desc', tv: 'first_air_date.desc' },
}

const today = () => new Date().toISOString().slice(0, 10)

function discoverParams(mediaType, sort, genreIds, page, providerIds = []) {
  const isMovie = mediaType === 'movie'
  const params = {
    page,
    include_adult: false,
    // Vírgula = "e": o título precisa ter todos os gêneros (ex.: Animação e Comédia)
    with_genres: genreIds.length ? genreIds.join(',') : undefined,
    sort_by: (SORT_BY[sort] ?? SORT_BY.relevance)[mediaType],
  }
  if (providerIds.length > 0) {
    params.with_watch_providers = providerIds.join('|')
    params.watch_region = REGION
    params.with_watch_monetization_types = 'flatrate'
  }
  // Evita notas "10,0" de títulos com poucos votos e lançamentos que ainda não saíram
  if (sort === 'rating') params['vote_count.gte'] = isMovie ? 300 : 200
  if (sort === 'recent') {
    params['vote_count.gte'] = 10
    params[isMovie ? 'primary_release_date.lte' : 'first_air_date.lte'] = today()
  }
  return params
}

async function fetchPage({ mediaType, query, genreIds, providerIds, sort, page }) {
  let path
  let params

  if (query && providerIds.length === 0) {
    path = `/search/${mediaType}`
    params = { query, page, include_adult: false }
  } else if (genreIds.length > 0 || providerIds.length > 0 || sort !== DEFAULT_SORT) {
    path = `/discover/${mediaType}`
    params = discoverParams(mediaType, sort, genreIds, page, providerIds)
  } else {
    path = `/${mediaType}/popular`
    params = { page }
  }

  const data = await request(path, params)
  let items = (data.results ?? []).map((raw) => normalizeTitle(raw, mediaType))
  // Busca e gênero são aplicados localmente quando a API de busca não aceita esses filtros.
  if (query && providerIds.length > 0) {
    const term = normalize(query)
    items = items.filter((item) => normalize(item.title).includes(term))
  } else if (query && genreIds.length > 0) {
    items = items.filter((item) => genreIds.every((id) => item.genreIds.includes(id)))
  }

  return { items, totalPages: Math.min(data.total_pages ?? 1, MAX_PAGES) }
}

function interleave(lists) {
  const merged = []
  const longest = Math.max(0, ...lists.map((list) => list.length))
  for (let i = 0; i < longest; i += 1) {
    lists.forEach((list) => {
      if (list[i]) merged.push(list[i])
    })
  }
  return merged
}

function uniqueById(items) {
  const seen = new Set()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

// type: 'all' | 'movie' | 'series' | 'animation' · genre: { name, ids: { movie, tv } } | null
// 'animation' = filmes e séries com o gênero Animação (o gênero escolhido, se houver, se soma a ele).
// Retorna { items, hasMore }. Lança TmdbError.
export async function fetchTitles({
  query = '',
  type = 'all',
  genre = null,
  providers = [],
  sort = DEFAULT_SORT,
  page = 1,
}) {
  void loadImageConfig()
  await getGenres().catch(() => null) // sem nomes de gênero a lista ainda funciona

  const selectedGenres = genre ? (Array.isArray(genre) ? genre : [genre]) : []
  const providerIds = [...new Set(providers.filter((id) => Number.isInteger(id) && id > 0))]
  let mediaTypes = type === 'movie' ? ['movie'] : type === 'series' ? ['tv'] : ['movie', 'tv']
  if (selectedGenres.length > 0) {
    mediaTypes = mediaTypes.filter((mediaType) =>
      selectedGenres.every((selected) => selected.ids?.[mediaType]),
    )
  }
  if (mediaTypes.length === 0) return { items: [], hasMore: false }

  const genreIdsFor = (mediaType) => {
    const ids = type === 'animation' ? [ANIMATION_GENRE_ID] : []
    selectedGenres.forEach((selected) => {
      const chosen = selected.ids?.[mediaType]
      if (chosen && !ids.includes(chosen)) ids.push(chosen)
    })
    return ids
  }

  const pages = await Promise.all(
    mediaTypes.map((mediaType) =>
      fetchPage({
        mediaType,
        query,
        genreIds: genreIdsFor(mediaType),
        providerIds,
        sort,
        page,
      }),
    ),
  )

  const lists = pages.map((result) => result.items)
  let items
  if (lists.length === 1) items = lists[0]
  else if (query && sort === DEFAULT_SORT) items = interleave(lists) // mantém a relevância da busca
  else items = sortTitles(lists.flat(), sort)

  return {
    items: uniqueById(items),
    hasMore: pages.some((result) => page < result.totalPages),
  }
}

// Filmes em cartaz no Brasil. Disponível para uso futuro (ainda não ligado à interface).
export async function getNowPlaying(page = 1) {
  void loadImageConfig()
  await getGenres().catch(() => null)
  const data = await request('/movie/now_playing', { page, region: REGION })
  return (data.results ?? []).map((raw) => normalizeTitle(raw, 'movie'))
}

// ---------- Detalhes (só quando o usuário abre o título) ----------
export async function getDetails(mediaType, tmdbId) {
  void loadImageConfig()
  const path = `/${mediaType}/${tmdbId}`
  const data = await request(path)
  const isMovie = mediaType === 'movie'

  let synopsis = data.overview?.trim() || ''
  let synopsisLanguage = 'pt'
  if (!synopsis) {
    // Sem tradução em português: tenta a sinopse original em inglês
    const fallback = await request(path, { language: 'en-US' }).catch(() => null)
    synopsis = fallback?.overview?.trim() || ''
    if (synopsis) synopsisLanguage = 'en'
  }

  return {
    duration: isMovie ? data.runtime || null : null,
    seasons: isMovie ? null : data.number_of_seasons || null,
    episodes: isMovie ? null : data.number_of_episodes || null,
    episodeRuntime: isMovie ? null : data.episode_run_time?.[0] || null,
    language: languageName(data.original_language),
    genres: (data.genres ?? []).map((genre) => genre.name),
    synopsis: synopsis || null,
    synopsisLanguage,
    backdropPath: data.backdrop_path || null,
  }
}

// Watch Providers usa os ids e os tipos reais do catálogo (filme ou série).
const watchProviderCache = new Map()
const watchProviderQueue = []
let activeWatchProviderRequests = 0
const MAX_WATCH_PROVIDER_REQUESTS = 2

function runNextWatchProviderRequest() {
  if (activeWatchProviderRequests >= MAX_WATCH_PROVIDER_REQUESTS) return
  const next = watchProviderQueue.shift()
  if (!next) return

  activeWatchProviderRequests += 1
  next.task()
    .then(next.resolve, next.reject)
    .finally(() => {
      activeWatchProviderRequests -= 1
      runNextWatchProviderRequest()
    })
}

function enqueueWatchProviderRequest(task) {
  const promise = new Promise((resolve, reject) => {
    watchProviderQueue.push({ task, resolve, reject })
  })
  runNextWatchProviderRequest()
  return promise
}

function normalizeProviders(data) {
  const region = data.results?.[REGION]
  const categories = ['flatrate', 'free', 'ads', 'rent', 'buy']
  const providers = Object.fromEntries(
    categories.map((category) => [
      category,
      (region?.[category] ?? [])
        .map((provider) => ({
          id: provider.provider_id,
          name: provider.provider_name,
          logoPath: provider.logo_path || null,
          displayPriority: provider.display_priority ?? Number.MAX_SAFE_INTEGER,
        }))
        .sort((first, second) => first.displayPriority - second.displayPriority),
    ]),
  )

  return {
    link: safeTmdbWatchLink(region?.link),
    ...providers,
  }
}

function safeTmdbWatchLink(value) {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    if (
      url.protocol === 'https:' &&
      (url.hostname === 'www.themoviedb.org' || url.hostname === 'themoviedb.org')
    ) {
      return url.href
    }
  } catch {
    return null
  }
  return null
}

export function getWatchProviders(mediaType, tmdbId) {
  if (!['movie', 'tv'].includes(mediaType) || !Number.isInteger(tmdbId) || tmdbId <= 0) {
    return Promise.reject(new TmdbError('http', 'Tipo ou identificador inválido para provedores.'))
  }

  void loadImageConfig()
  const key = `${mediaType}:${tmdbId}:${REGION}`
  const hit = watchProviderCache.get(key)
  if (hit && Date.now() - hit.time < CACHE_TTL_MS) return hit.promise

  const path = `/${mediaType === 'movie' ? 'movie' : 'tv'}/${tmdbId}/watch/providers`
  const promise = enqueueWatchProviderRequest(() => request(path, { region: REGION }))
    .then(normalizeProviders)
  watchProviderCache.set(key, { promise, time: Date.now() })
  promise.catch(() => {
    if (watchProviderCache.get(key)?.promise === promise) watchProviderCache.delete(key)
  })
  return promise
}

// Lista agregada da TMDB para o Brasil; não consulta disponibilidade por título.
export async function getWatchProviderOptions() {
  void loadImageConfig()
  const [movies, series] = await Promise.all([
    request('/watch/providers/movie', { watch_region: REGION }),
    request('/watch/providers/tv', { watch_region: REGION }),
  ])
  const providers = new Map()

  ;[...(movies.results ?? []), ...(series.results ?? [])].forEach((provider) => {
    const current = providers.get(provider.provider_id)
    const priority = provider.display_priority ?? Number.MAX_SAFE_INTEGER
    if (!current) {
      providers.set(provider.provider_id, {
        id: provider.provider_id,
        name: provider.provider_name,
        logoPath: provider.logo_path || null,
        displayPriority: priority,
      })
      return
    }
    if (!current.logoPath && provider.logo_path) current.logoPath = provider.logo_path
    current.displayPriority = Math.min(current.displayPriority, priority)
  })

  return [...providers.values()].sort(
    (first, second) =>
      first.displayPriority - second.displayPriority || first.name.localeCompare(second.name, 'pt-BR'),
  )
}

// ---------- Compatibilidade ----------
// Nome do gênero pelo id (precisa de getGenres() já carregado)
export const genreNameOf = (id) => genreNames.get(id) ?? null

// Títulos "parecidos" segundo a TMDB, a partir de um título
export async function getRecommendationsFor(mediaType, tmdbId) {
  const data = await request(`/${mediaType}/${tmdbId}/recommendations`, { page: 1 })
  return (data.results ?? []).map((raw) => normalizeTitle(raw, mediaType))
}

// Títulos que têm TODOS os gêneros informados (ids da TMDB para o tipo), do mais popular ao menos
export async function discoverByGenres(mediaType, genreIds, page = 1) {
  const data = await request(`/discover/${mediaType}`, {
    page,
    include_adult: false,
    sort_by: 'popularity.desc',
    with_genres: genreIds.join(','),
    'vote_count.gte': mediaType === 'movie' ? 200 : 100,
  })
  return (data.results ?? []).map((raw) => normalizeTitle(raw, mediaType))
}