import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { SessionContext } from './sessionContext.js'
import {
  STORAGE_KEY,
  loadSession,
  personKey,
  serializeSession,
  sessionReducer,
} from '../utils/sessionState.js'

// Estado único da sessão. Hoje vive no navegador (localStorage, só com um resumo dos títulos).
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

  // person: 1 | 2 · selections: lista completa de títulos daquela pessoa
  const setSelections = useCallback(
    (person, selections) => dispatch({ type: 'set', person: personKey(person), selections }),
    [],
  )
  const setProviderPreferences = useCallback(
    (person, providers) =>
      dispatch({ type: 'set-providers', person: personKey(person), providers }),
    [],
  )
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  const value = useMemo(
    () => ({ session, setSelections, setProviderPreferences, reset }),
    [session, setSelections, setProviderPreferences, reset],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}