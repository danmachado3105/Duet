import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { SessionContext } from './sessionContext.js'
import {
  STORAGE_KEY,
  loadSession,
  personKey,
  serializeSession,
  sessionReducer,
} from '../utils/sessionState.js'

// Estado único da sessão. Hoje vive no navegador (localStorage, só com ids).
// Para trocar por backend, só este arquivo e o sessionState.js precisam mudar.
export default function SessionProvider({ children }) {
  const [session, dispatch] = useReducer(sessionReducer, undefined, loadSession)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, serializeSession(session))
    } catch {
      // Sem localStorage (modo privado, por exemplo): a sessão continua só em memória.
    }
  }, [session])

  const selectMovie = useCallback(
    (person, movie) => dispatch({ type: 'select', person: personKey(person), movie }),
    [],
  )
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  const value = useMemo(() => ({ session, selectMovie, reset }), [session, selectMovie, reset])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}