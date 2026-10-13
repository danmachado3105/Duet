import { createContext, useContext } from 'react'

export const ShowcaseContext = createContext(null)

// { status: 'loading' | 'ready' | 'fallback', data }
export function useShowcase() {
  const value = useContext(ShowcaseContext)
  if (!value) throw new Error('useShowcase precisa estar dentro de ShowcaseProvider')
  return value
}