import { useEffect, useState } from 'react'
import { ShowcaseContext } from './showcaseContext.js'
import { fallbackShowcase, loadingShowcase } from '../data/showcase.js'
import { isTmdbConfigured } from '../services/tmdb.js'
import { loadShowcase } from '../services/showcase.js'

// Busca a vitrine uma única vez para toda a landing. Sem chave, nem chama a API.
export default function ShowcaseProvider({ children }) {
  const [state, setState] = useState(() =>
    isTmdbConfigured()
      ? { status: 'loading', data: loadingShowcase }
      : { status: 'fallback', data: fallbackShowcase },
  )

  useEffect(() => {
    if (!isTmdbConfigured()) return
    let active = true

    loadShowcase()
      .then((data) => {
        if (active) setState({ status: 'ready', data })
      })
      .catch(() => {
        if (active) setState({ status: 'fallback', data: fallbackShowcase })
      })

    return () => {
      active = false
    }
  }, [])

  return <ShowcaseContext.Provider value={state}>{children}</ShowcaseContext.Provider>
}