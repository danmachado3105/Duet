import { Navigate } from 'react-router-dom'
import { useSession } from '../context/sessionContext.js'
import { getProgress } from '../utils/sessionState.js'
import { ROUTES } from '../utils/sessionFlow.js'

// Impede abrir uma etapa sem ter concluído a anterior (ex.: colar a URL da análise)
// needs: 'first' = Pessoa 1 já escolheu · 'both' = as duas já escolheram
export default function RequireStep({ needs, children }) {
  const { session } = useSession()
  const progress = getProgress(session)

  if (!progress.first) return <Navigate to={ROUTES.person1} replace />
  if (needs === 'both' && !progress.second) return <Navigate to={ROUTES.person2} replace />

  return children
}