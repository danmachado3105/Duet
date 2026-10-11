import { getTitleById } from '../data/catalog.js'

export const STORAGE_KEY = 'duet:session:v2'
const LEGACY_KEYS = ['duet:session:v1']

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

// Só os ids vão para o localStorage. Os títulos são buscados no catálogo ao carregar.
export function serializeSession(session) {
  return JSON.stringify({
    person1: { movieId: session.person1.selectedMovie?.id ?? null },
    person2: { movieId: session.person2.selectedMovie?.id ?? null },
  })
}

// Qualquer dado ausente, inválido ou de um título que não existe mais volta ao estado inicial.
export function parseSession(raw) {
  try {
    const data = JSON.parse(raw)
    const first = getTitleById(data?.person1?.movieId) ?? null
    // A Pessoa 2 só conta se a Pessoa 1 também escolheu
    const second = first ? (getTitleById(data?.person2?.movieId) ?? null) : null
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