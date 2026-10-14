import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import CatalogMessage from '../components/CatalogMessage.jsx'
import Mosaic from '../components/Mosaic.jsx'
import TransitionScreen from '../components/TransitionScreen.jsx'
import VennMark from '../components/VennMark.jsx'
import { useSession } from '../context/sessionContext.js'
import { useCompatibility } from '../hooks/useCompatibility.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { RESULTS_ERROR_FALLBACK } from '../utils/compat.js'
import { ROUTES } from '../utils/sessionFlow.js'

export default function AnalysisPage() {
  const navigate = useNavigate()
  const reduced = usePrefersReducedMotion()
  const { session, reset } = useSession()
  const compat = useCompatibility()
  const [minTimePassed, setMinTimePassed] = useState(false)

  // A análise é real (consulta a TMDB). O tempo mínimo só evita um "piscar" quando o cache responde na hora.
  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), reduced ? 500 : 1800)
    return () => clearTimeout(timer)
  }, [reduced])

  const first = session.person1.selections
  const second = session.person2.selections
  if (first.length === 0 || second.length === 0) return null

  const ready = compat.status === 'ready' && minTimePassed
  const failed = compat.status === 'error'

  let status = 'DUET está analisando'
  if (ready) {
    const total = compat.data.recommendations.length
    if (total > 0) status = `Encontramos ${total} ${total === 1 ? 'sugestão' : 'sugestões'} para os dois.`
    else if (compat.data.mode === 'picks-only') status = 'Comparamos as escolhas de vocês.'
    else status = 'Não encontramos um meio-termo claro. Vale ver o resultado.'
  }

  const restart = () => {
    reset()
    navigate(ROUTES.person1, { replace: true })
  }

  return (
    <TransitionScreen
      eyebrow="Análise"
      title="Vamos ver o que vocês têm em comum."
      actions={
        <>
          {ready && (
            <Button to={ROUTES.result} size="lg" arrow>
              Ver resultado
            </Button>
          )}
          <Button to={ROUTES.summary} variant="ghost" size="lg">
            Voltar ao resumo
          </Button>
          <Button variant="ghost" size="lg" onClick={restart}>
            Recomeçar
          </Button>
        </>
      }
    >
      {failed ? (
        <CatalogMessage
          error={compat.error}
          onRetry={compat.retry}
          fallback={RESULTS_ERROR_FALLBACK}
        />
      ) : (
        <>
          <div className="pair" data-state={ready ? 'ready' : 'working'}>
            <div className="pair__item">
              <Mosaic titles={first} />
              <p className="pair__cap">
                <span>Pessoa 1</span>
                <strong>
                  {first.length} {first.length === 1 ? 'título' : 'títulos'}
                </strong>
              </p>
            </div>

            <div className="pair__mark" aria-hidden="true">
              <VennMark />
            </div>

            <div className="pair__item">
              <Mosaic titles={second} />
              <p className="pair__cap">
                <span>Pessoa 2</span>
                <strong>
                  {second.length} {second.length === 1 ? 'título' : 'títulos'}
                </strong>
              </p>
            </div>
          </div>

          <p className="pair__status" role="status">
            {status}
            {!ready && (
              <span className="dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            )}
          </p>
        </>
      )}
    </TransitionScreen>
  )
}