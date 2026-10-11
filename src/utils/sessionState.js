export const STORAGE_KEY = 'duet:session:v1'

export const initialSession = {
  person1: { selectedMovie: null },
  person2: { selectedMovie: null },
}

export const personKey = (person) => (person === 1 ? 'person1' : 'person2')

export const getProgress = (session) => ({
  first: Boolean(session.person1.selectedMovie),
  second: Boolean(session.person2.selectedMovie),
})

const asMovie = (value) =>
  value && typeof value === 'object' && value.id != null && typeof value.title === 'string' && value.art
    ? value
    : null

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

// Lê a sessão salva. Qualquer dado inválido volta para o estado inicial.
export function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialSession
    const parsed = JSON.parse(raw)
    return {
      person1: { selectedMovie: asMovie(parsed?.person1?.selectedMovie) },
      person2: { selectedMovie: asMovie(parsed?.person2?.selectedMovie) },
    }
  } catch {
    return initialSession
  }
}