export const STORAGE_KEY = 'duet:session:v3'
const LEGACY_KEYS = ['duet:session:v1', 'duet:session:v2']

const POSTER_PATH = /^\/[A-Za-z0-9_-]+\.(?:jpe?g|png|webp)$/i
const HEX_COLOR = /^#[0-9a-f]{3,8}$/i

export const initialSession = {
  person1: { selectedMovie: null },
  person2: { selectedMovie: null },
}

export const personKey = (person) => (person === 1 ? 'person1' : 'person2')

export const getProgress = (session) => ({
  first: Boolean(session.person1.selectedMovie),
  second: Boolean(session.person2.selectedMovie),
})

export function sessionReducer(state, action) {
  switch (action.type) {
    case 'select':
      return { ...state, [action.person]: { selectedMovie: action.movie } }
    case 'reset':
      return initialSession
    default:
      return state
  }
}

// ---------- Persistência: só um resumo do título, sem dados pessoais ----------
export function toSnapshot(movie) {
  if (!movie) return null
  return {
    id: movie.id,
    source: movie.source ?? 'tmdb',
    tmdbId: movie.tmdbId ?? null,
    mediaType: movie.mediaType ?? null,
    type: movie.type,
    title: movie.title,
    year: movie.year ?? null,
    genres: movie.genres ?? [],
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

// Valida tudo: dado ausente ou adulterado vira null (a etapa é refeita)
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
      ? value.genres.filter((genre) => typeof genre === 'string').slice(0, 10)
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

export function serializeSession(session) {
  return JSON.stringify({
    person1: toSnapshot(session.person1.selectedMovie),
    person2: toSnapshot(session.person2.selectedMovie),
  })
}

export function parseSession(raw) {
  try {
    const data = JSON.parse(raw)
    const first = fromSnapshot(data?.person1)
    // A Pessoa 2 só conta se a Pessoa 1 também escolheu
    const second = first ? fromSnapshot(data?.person2) : null
    return { person1: { selectedMovie: first }, person2: { selectedMovie: second } }
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