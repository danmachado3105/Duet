import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Volta ao topo a cada troca de rota (menos no primeiro carregamento, para não quebrar links com #âncora)
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}