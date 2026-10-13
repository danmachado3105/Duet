import { isAnimated } from './showcase.js'

// ---------------------------------------------------------------------------
// Motor de compatibilidade (funções puras, sem rede). Roda inteiro no navegador.
//
// Para cada sugestão a nota é: 70% gêneros + 15% tipo + 15% avaliação (ver CompatRule).
// ---------------------------------------------------------------------------
export const WEIGHTS = { genre: 0.7, type: 0.15, quality: 0.15 }
export const MAX_RECOMMENDATIONS = 9

const SEEDS_PER_PERSON = 3 // quantas escolhas de cada pessoa viram "ponto de partida"
const MAX_COMBOS = 3 // combinações de gêneros consultadas na TMDB
const BALANCED_GAP = 0.15

export const KIND_LABEL = { movie: 'Filme', tv: 'Série', animation: 'Animação' }
export const KIND_PLURAL = { movie: 'filmes', tv: 'séries', animation: 'animações' }

// ---------- Gêneros ----------
// Filmes e séries usam ids diferentes para alguns gêneros. Tudo é comparado no espaço de ids
// dos filmes ("canônico"): Action & Adventure -> Ação + Aventura, Sci-Fi & Fantasy -> Ficção
// científica + Fantasia, War & Politics -> Guerra, Kids -> Família.
const TV_TO_CANONICAL = { 10759: [28, 12], 10765: [878, 14], 10768: [10752], 10762: [10751] }
const CANONICAL_TO_TV = { 28: 10759, 12: 10759, 878: 10765, 14: 10765, 10752: 10768 }
const NO_TV_EQUIVALENT = new Set([27, 10749, 53, 10402, 36, 10770]) // Terror, Romance, Thriller...
const NO_MOVIE_EQUIVALENT = new Set([10763, 10764, 10766, 10767]) // News, Reality, Soap, Talk

export function canonicalGenres(genreIds) {
  const keys = new Set()
  genreIds.forEach((id) => (TV_TO_CANONICAL[id] ?? [id]).forEach((key) => keys.add(key)))
  return [...keys]
}

export const tvGenreId = (id) => (NO_TV_EQUIVALENT.has(id) ? null : (CANONICAL_TO_TV[id] ?? id))
export const movieGenreId = (id) => (NO_MOVIE_EQUIVALENT.has(id) ? null : id)

// Chaves de gênero de um título: ids canônicos (TMDB) ou nomes (títulos de demonstração)
export function genreKeys(title) {
  if (title.genreIds?.length) return canonicalGenres(title.genreIds)
  return [...new Set(title.genres ?? [])]
}

export const labelOf = (key, nameOf) =>
  typeof key === 'number' ? (nameOf(key) ?? `Gênero ${key}`) : key

// "Animação" é um gênero (vale para filmes e séries): vira um terceiro tipo para a comparação
export function kindOf(title) {
  if (isAnimated(title)) return 'animation'
  return title.mediaType === 'tv' || title.type === 'Série' ? 'tv' : 'movie'
}

// ---------- Perfil de cada pessoa ----------
// weights: o gênero mais frequente vale 1; os outros valem a proporção em relação a ele.
export function buildProfile(titles) {
  const counts = new Map()
  const kinds = { movie: 0, tv: 0, animation: 0 }

  titles.forEach((title) => {
    genreKeys(title).forEach((key) => counts.set(key, (counts.get(key) ?? 0) + 1))
    kinds[kindOf(title)] += 1
  })

  const top = Math.max(1, ...counts.values())
  const weights = new Map([...counts].map(([key, count]) => [key, count / top]))
  return { size: titles.length, counts, weights, kinds }
}

export function topGenres(profile, nameOf, limit = 4) {
  return [...profile.counts.entries()]
    .map(([key, count]) => ({ key, name: labelOf(key, nameOf), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'pt-BR'))
    .slice(0, limit)
}

// ---------- Nota de um título ----------
const harmonic = (a, b) => (a + b === 0 ? 0 : (2 * a * b) / (a + b))
const kindShare = (kind, profile) => (profile.size ? profile.kinds[kind] / profile.size : 0)

// Média do peso, para a pessoa, de cada gênero do título
function genreFit(keys, profile) {
  if (keys.length === 0) return 0
  return keys.reduce((sum, key) => sum + (profile.weights.get(key) ?? 0), 0) / keys.length
}

// Avaliação TMDB: 5 vale 0 e 9 vale 1. Sem nota, vale 0,5.
const qualityOf = (rating) =>
  rating == null ? 0.5 : Math.min(1, Math.max(0, (rating - 5) / 4))

export function scoreCandidate(title, profileA, profileB) {
  const keys = genreKeys(title)
  const kind = kindOf(title)
  const fitA = genreFit(keys, profileA)
  const fitB = genreFit(keys, profileB)

  // Média harmônica: só pontua alto se agradar às DUAS pessoas
  const genre = harmonic(fitA, fitB)
  const type = harmonic(kindShare(kind, profileA), kindShare(kind, profileB))
  const quality = qualityOf(title.rating)

  const total = WEIGHTS.genre * genre + WEIGHTS.type * type + WEIGHTS.quality * quality
  const percent = Math.round(Math.min(1, Math.max(0, total)) * 100)

  return { keys, kind, fitA, fitB, genre, type, quality, percent }
}

// ---------- Comparação das escolhas ----------
export function analyzeSelections(titlesA, titlesB, nameOf) {
  const profileA = buildProfile(titlesA)
  const profileB = buildProfile(titlesB)

  const idsB = new Set(titlesB.map((title) => title.id))
  const sharedTitles = titlesA.filter((title) => idsB.has(title.id))

  const strength = (key) => Math.min(profileA.weights.get(key), profileB.weights.get(key))
  const sharedKeys = [...profileA.counts.keys()]
    .filter((key) => profileB.counts.has(key))
    .sort((a, b) => strength(b) - strength(a))

  const person = (label, profile) => ({
    label,
    count: profile.size,
    kinds: profile.kinds,
    topGenres: topGenres(profile, nameOf),
  })

  return {
    profileA,
    profileB,
    sharedKeys,
    view: {
      people: [person('Pessoa 1', profileA), person('Pessoa 2', profileB)],
      sharedTitles,
      sharedGenres: sharedKeys.map((key) => labelOf(key, nameOf)),
      // 'common' = existem gêneros em comum · 'split' = nenhum gênero em comum
      situation: sharedKeys.length > 0 ? 'common' : 'split',
    },
  }
}

// ---------- Onde procurar candidatos na TMDB ----------
// seeds: escolhas das pessoas, para pedir "parecidos" à TMDB.
// combos: combinações de gêneros (a TMDB exige que o título tenha todos). Quando as pessoas não
// têm gênero em comum, as combinações juntam um gênero de cada uma: é o "meio-termo".
export function planCandidates(titlesA, titlesB, { profileA, profileB, sharedKeys }) {
  const seeds = [
    ...titlesA.slice(0, SEEDS_PER_PERSON).map((title) => ({ person: 1, title })),
    ...titlesB.slice(0, SEEDS_PER_PERSON).map((title) => ({ person: 2, title })),
  ].filter(({ title }) => title.tmdbId && title.mediaType)

  const ranked = (profile) =>
    [...profile.counts.entries()]
      .filter(([key]) => typeof key === 'number')
      .sort((a, b) => b[1] - a[1])
      .map(([key]) => key)

  const topA = ranked(profileA)
  const topB = ranked(profileB)
  const shared = sharedKeys.filter((key) => typeof key === 'number')

  const options = []
  if (shared.length >= 1) options.push([shared[0]])
  if (shared.length >= 2) options.push([shared[0], shared[1]])
  ;[
    [topA[0], topB[0]],
    [topA[0], topB[1]],
    [topA[1], topB[0]],
  ].forEach(([a, b]) => {
    if (a !== undefined && b !== undefined && a !== b) options.push([a, b])
  })

  const seen = new Set()
  const combos = options
    .filter((ids) => {
      const key = [...ids].sort((x, y) => x - y).join(',')
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, MAX_COMBOS)

  return { seeds, combos }
}

// ---------- Ranking ----------
function buildReasons(sources, score, profileA, profileB, nameOf) {
  const { keys, kind, fitA, fitB } = score
  const names = (list) => list.map((key) => labelOf(key, nameOf)).join(', ')

  const both = keys.filter((key) => profileA.weights.has(key) && profileB.weights.has(key))
  const onlyA = keys.filter((key) => profileA.weights.has(key) && !profileB.weights.has(key))
  const onlyB = keys.filter((key) => profileB.weights.has(key) && !profileA.weights.has(key))

  const reasons = []
  if (both.length > 0) {
    reasons.push(
      `Tem ${names(both)}, ${both.length > 1 ? 'gêneros' : 'um gênero'} que as duas pessoas escolheram.`,
    )
  } else if (onlyA.length > 0 && onlyB.length > 0) {
    reasons.push(`Une ${names(onlyA)} (Pessoa 1) e ${names(onlyB)} (Pessoa 2).`)
  }

  const seed1 = sources.find((source) => source.person === 1)
  const seed2 = sources.find((source) => source.person === 2)
  if (seed1 && seed2) {
    reasons.push(`Parecido com “${seed1.seedTitle}” (Pessoa 1) e “${seed2.seedTitle}” (Pessoa 2).`)
  } else if (seed1) {
    reasons.push(`Parecido com “${seed1.seedTitle}”, escolhido pela Pessoa 1.`)
  } else if (seed2) {
    reasons.push(`Parecido com “${seed2.seedTitle}”, escolhido pela Pessoa 2.`)
  }

  if (Math.abs(fitA - fitB) <= BALANCED_GAP) {
    reasons.push('Agrada de forma parecida às duas pessoas.')
  } else if (kindShare(kind, profileA) > 0 && kindShare(kind, profileB) > 0) {
    reasons.push(`As duas pessoas já escolheram ${KIND_PLURAL[kind]}.`)
  }

  return reasons
}

// pool: [{ title, sources: [{ person, seedTitle }] }]
// Fica de fora: título já escolhido por alguém, sem pôster, ou sem gênero em comum com uma das pessoas.
export function rankCandidates(
  pool,
  { profileA, profileB, excludeIds, nameOf, limit = MAX_RECOMMENDATIONS },
) {
  const ranked = []

  pool.forEach(({ title, sources }) => {
    if (excludeIds.has(title.id) || !title.posterPath) return
    const score = scoreCandidate(title, profileA, profileB)
    if (score.fitA <= 0 || score.fitB <= 0) return
    ranked.push({ title, sources, score })
  })

  ranked.sort(
    (a, b) =>
      b.score.percent - a.score.percent ||
      (b.title.rating ?? -1) - (a.title.rating ?? -1) ||
      (b.title.popularity ?? 0) - (a.title.popularity ?? 0),
  )

  return ranked.slice(0, limit).map(({ title, sources, score }) => ({
    title,
    percent: score.percent,
    kind: score.kind,
    reasons: buildReasons(sources, score, profileA, profileB, nameOf),
    breakdown: { genre: score.genre, type: score.type, quality: score.quality },
  }))
}

export const RESULTS_ERROR_FALLBACK = {
  title: 'Não foi possível montar as sugestões.',
  text: 'Algo deu errado ao falar com a TMDB. Tente novamente.',
}