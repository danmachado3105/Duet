import { useEffect, useState } from 'react'
import Button from '../components/Button.jsx'
import Poster from '../components/Poster.jsx'
import TransitionScreen from '../components/TransitionScreen.jsx'
import VennMark from '../components/VennMark.jsx'
import { useSession } from '../context/sessionContext.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { ROUTES } from '../utils/sessionFlow.js'

export default function AnalysisPage() {
  const reduced = usePrefersReducedMotion()
  const { session } = useSession()
  const [ready, setReady] = useState(false)

  const first = session.person1.selectedMovie
  const second = session.person2.selectedMovie
  const same = first.id === second.id

  // Aqui entra, no futuro, a chamada do algoritmo de recomendação.
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), reduced ? 600 : 2200)
    return () => clearTimeout(timer)
  }, [reduced])

  let status = 'DUET está analisando'
  if (ready) {
    status = same
      ? 'Vocês escolheram o mesmo título. Vamos buscar opções parecidas.'
      : 'Encontramos algumas possibilidades.'
  }

  return (
    <TransitionScreen
      eyebrow="Análise"
      title="Vamos ver o que vocês têm em comum."
      actions={
        ready && (
          <Button to={ROUTES.result} size="lg" arrow>
            Ver resultado
          </Button>
        )
      }
    >
      <div className="pair" data-state={ready ? 'ready' : 'working'}>
        <div className="pair__item">
          <Poster movie={first} size="md" />
          <p className="pair__cap">
            <span>Pessoa 1</span>
            <strong>{first.title}</strong>
          </p>
        </div>

        <div className="pair__mark" aria-hidden="true">
          <VennMark />
        </div>

        <div className="pair__item">
          <Poster movie={second} size="md" />
          <p className="pair__cap">
            <span>Pessoa 2</span>
            <strong>{second.title}</strong>
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
    </TransitionScreen>
  )
}