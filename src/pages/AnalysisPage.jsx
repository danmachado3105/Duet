import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import PosterImage from '../components/PosterImage.jsx'
import TransitionScreen from '../components/TransitionScreen.jsx'
import VennMark from '../components/VennMark.jsx'
import { useSession } from '../context/sessionContext.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { analyzeSelection } from '../utils/analysis.js'
import { ROUTES } from '../utils/sessionFlow.js'

export default function AnalysisPage() {
  const navigate = useNavigate()
  const reduced = usePrefersReducedMotion()
  const { session, reset } = useSession()
  const [ready, setReady] = useState(false)

  // Aqui entra, no futuro, a chamada do algoritmo de recomendação.
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), reduced ? 600 : 2200)
    return () => clearTimeout(timer)
  }, [reduced])

  const first = session.person1.selectedMovie
  const second = session.person2.selectedMovie
  if (!first || !second) return null

  const analysis = analyzeSelection(first, second)

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
          <Button variant="ghost" size="lg" onClick={restart}>
            Recomeçar
          </Button>
        </>
      }
    >
      <div className="pair" data-state={ready ? 'ready' : 'working'}>
        <div className="pair__item">
          <PosterImage movie={first} sizes="160px" eager />
          <p className="pair__cap">
            <span>Pessoa 1</span>
            <strong>{first.title}</strong>
          </p>
          <Link to={ROUTES.person1} state={{ returnTo: ROUTES.analysis }} className="pair__edit">
            Trocar<span className="sr-only"> escolha da Pessoa 1</span>
          </Link>
        </div>

        <div className="pair__mark" aria-hidden="true">
          <VennMark />
        </div>

        <div className="pair__item">
          <PosterImage movie={second} sizes="160px" eager />
          <p className="pair__cap">
            <span>Pessoa 2</span>
            <strong>{second.title}</strong>
          </p>
          <Link to={ROUTES.person2} state={{ returnTo: ROUTES.analysis }} className="pair__edit">
            Trocar<span className="sr-only"> escolha da Pessoa 2</span>
          </Link>
        </div>
      </div>

      <p className="pair__status" role="status">
        {ready ? 'Encontramos algumas possibilidades.' : 'DUET está analisando'}
        {!ready && (
          <span className="dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
      </p>

      {ready && (
        <div className="common">
          <span className="common__label">
            {analysis.sameTitle ? 'Vocês escolheram o mesmo título' : 'Gêneros em comum'}
          </span>
          {analysis.sharedGenres.length > 0 ? (
            <ul className="chips">
              {analysis.sharedGenres.map((genre) => (
                <li key={genre} className="chip chip--both">
                  {genre}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum por enquanto. O DUET vai procurar o meio-termo.</p>
          )}
        </div>
      )}
    </TransitionScreen>
  )
}