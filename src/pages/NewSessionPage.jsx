import { useEffect, useRef } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import VennMark from '../components/VennMark.jsx'
import { useSession } from '../context/sessionContext.js'
import { categoryFromSlug } from '../utils/categories.js'
import { getProgress } from '../utils/sessionState.js'
import { ROUTES, getResumeRoute } from '../utils/sessionFlow.js'

export default function NewSessionPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { session, reset } = useSession()
  const resetHandled = useRef(false)
  const progress = getProgress(session)
  const resetting = location.state?.resetSession === true

  useEffect(() => {
    if (!resetting || resetHandled.current) return
    resetHandled.current = true
    reset()
    navigate(`${location.pathname}${location.search}`, { replace: true, state: null })
  }, [location.pathname, location.search, navigate, reset, resetting])

  // Vem da landing: /sessao/nova?categoria=animacoes. O catálogo abre já nessa categoria.
  const category = categoryFromSlug(params.get('categoria'))
  const search = category ? `?categoria=${category.slug}` : ''

  const start = () => {
    reset()
    navigate(`${ROUTES.person1}${search}`)
  }

  return (
    <section className="container newsession">
      <div className="newsession__copy stagger">
        <span className="eyebrow">
          Nova sessão{category ? ` · ${category.label}` : ''}
        </span>
        <h1 className="newsession__title">Vamos encontrar algo para vocês.</h1>
        <p className="lead">Cada pessoa escolhe um título. O DUET cuida do resto.</p>
        <p className="newsession__explain">
          Vocês vão escolher separadamente o que gostariam de assistir. Depois, o DUET encontra
          opções que combinam os dois gostos.
        </p>

        <ol className="legend">
          <li>
            <b>1</b>A Pessoa 1 escolhe
          </li>
          <li>
            <b>2</b>A Pessoa 2 escolhe
          </li>
          <li>
            <b>3</b>O DUET analisa os dois gostos
          </li>
        </ol>

        <div className="newsession__actions">
          <Button size="lg" arrow onClick={start}>
            Começar
          </Button>
          {progress.first && !resetting && (
            <Button variant="ghost" size="lg" to={getResumeRoute(progress)}>
              Continuar sessão anterior
            </Button>
          )}
        </div>
        <p className="newsession__note">Uma tela, duas pessoas. Passem o dispositivo entre vocês.</p>
      </div>

      <div className="duo" aria-hidden="true">
        <VennMark lens="var(--accent-solid)" />
        <span className="duo__label" style={{ left: '25%' }}>
          Pessoa 1
        </span>
        <span className="duo__label duo__label--core" style={{ left: '50%' }}>
          DUET
        </span>
        <span className="duo__label" style={{ left: '75%' }}>
          Pessoa 2
        </span>
      </div>
    </section>
  )
}