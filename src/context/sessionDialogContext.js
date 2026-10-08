import { createContext, useContext } from 'react'

export const SessionDialogContext = createContext(null)

export function useSessionDialog() {
  const value = useContext(SessionDialogContext)
  if (!value) throw new Error('useSessionDialog precisa estar dentro de SessionDialogProvider')
  return value
}