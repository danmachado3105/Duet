export const STORAGE_KEY = 'duet:session:v4'
const LEGACY_KEYS = ['duet:session:v1', 'duet:session:v2', 'duet:session:v3']

export const MAX_PICKS = 8
export const RECOMMENDED_PICKS = 3

const POSTER_PATH = /^\/[A-Za-z0-9_-]+\.(?:jpe?g|png|webp)$/i
const HEX_COLOR = /^#[0-9a-f]{3,8}$/i

// Cada pessoa tem uma LISTA de títulos. As listas nunca se misturam.
export const initialSession = {
  person1: { selections: [] },
  person2: { selections: [] },
}

export const personKey = (person) => (person === 1 ? 'person1' : 'person2')

export const getProgress = (session) => ({
  first: session.person1.selections.length > 0,
  second: session.person2.selections.length > 0,
})

// Identifica as escolhas atuais (usado para saber se o resultado em cache ainda vale)
export const selectionKey = (session) =>
  [session.person1.selections, session.person2.selections]
    .map((list) => list.map((title) => title.id).join(','))
    .join('|')

export function sessionReducer(state, action) {
  switch (action.type) {
    case 'set':
      return { ...state, [action.person]: { selections: action.selections } }
    case 'reset':
      return initialSession
    default:
      return state
  }
}

// ---------- Persistência: só um resumo de cada título, sem dados pessoais ----------
export function toSnapshot(movie) {
  return {
    id: movie.id,
    source: movie.source ?? 'tmdb',
    tmdbId: movie.tmdbId ?? null,
    mediaType: movie.mediaType ?? null,
    type: movie.type,
    title: movie.title,
    year: movie.year ?? null,
    genres: movie.genres ?? [],
    genreIds: movie.genreIds ?? [],
    rating: movie.rating ?? null,
    posterPath: movie.posterPath ?? null,
    art: movie.art ?? null, // só os títulos de demonstração têm
  }
}

function sanitizeArt(art) {
  if (!art || typeof art !== 'object') return null
  const { motif, a, b, c } = art
  const colorsOk = [a, b, c].every((color) => typeof color === 'string' && HEX_COLOR.test(color))
  return typeof motif === 'string' && colorsOk ? { motif, a, b, c } : null
}

// Valida tudo: dado ausente ou adulterado vira null
export function fromSnapshot(value) {
  if (!value || typeof value !== 'object') return null
  if (typeof value.id !== 'string' || !value.id) return null
  if (typeof value.title !== 'string' || !value.title) return null
  if (value.type !== 'Filme' && value.type !== 'Série') return null

  const source = value.source === 'demo' ? 'demo' : 'tmdb'
  if (source === 'tmdb' && !Number.isInteger(value.tmdbId)) return null

  return {
    id: value.id,
    source,
    tmdbId: source === 'tmdb' ? value.tmdbId : null,
    mediaType: value.mediaType === 'tv' ? 'tv' : 'movie',
    type: value.type,
    title: value.title.slice(0, 200),
    year: Number.isInteger(value.year) ? value.year : null,
    genres: Array.isArray(value.genres)
      ? value.genres.filter((genre) => typeof genre === 'string').slice(0, 12)
      : [],
    genreIds: Array.isArray(value.genreIds)
      ? value.genreIds.filter((id) => Number.isInteger(id)).slice(0, 12)
      : [],
    rating:
      typeof value.rating === 'number' && value.rating >= 0 && value.rating <= 10
        ? value.rating
        : null,
    posterPath:
      typeof value.posterPath === 'string' && POSTER_PATH.test(value.posterPath)
        ? value.posterPath
        : null,
    art: source === 'demo' ? sanitizeArt(value.art) : null,
    keywords: [],
    synopsis: null,
    backdropPath: null,
  }
}

function parseSelections(list) {
  if (!Array.isArray(list)) return []
  const seen = new Set()
  return list
    .map(fromSnapshot)
    .filter((title) => {
      if (!title || seen.has(title.id)) return false
      seen.add(title.id)
      return true
    })
    .slice(0, MAX_PICKS)
}

export function serializeSession(session) {
  return JSON.stringify({
    person1: session.person1.selections.map(toSnapshot),
    person2: session.person2.selections.map(toSnapshot),
  })
}

export function parseSession(raw) {
  try {
    const data = JSON.parse(raw)
    const first = parseSelections(data?.person1)
    // A Pessoa 2 só conta se a Pessoa 1 também escolheu
    const second = first.length > 0 ? parseSelections(data?.person2) : []
    return { person1: { selections: first }, person2: { selections: second } }
  } catch {
    return initialSession
  }
}

export function loadSession() {
  try {
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key))
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? parseSession(raw) : initialSession
  } catch {
    return initialSession
  }
}