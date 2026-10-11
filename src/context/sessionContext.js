import { createContext, useContext } from 'react'

export const SessionContext = createContext(null)

export function useSession() {
  const value = useContext(SessionContext)
  if (!value) throw new Error('useSession precisa estar dentro de SessionProvider')
  return value
}