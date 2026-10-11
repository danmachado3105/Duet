import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { SessionContext } from './sessionContext.js'
import {
  STORAGE_KEY,
  loadSession,
  personKey,
  sessionReducer,
} from '../utils/sessionState.js'

// Estado único da sessão. Hoje vive no navegador (localStorage).
// Para trocar por backend, só este arquivo precisa mudar.
export default function SessionProvider({ children }) {
  const [session, dispatch] = useReducer(sessionReducer, undefined, loadSession)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
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