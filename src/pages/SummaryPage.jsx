import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import PosterImage from '../components/PosterImage.jsx'
import { useSession } from '../context/sessionContext.js'
import { RECOMMENDED_PICKS } from '../utils/sessionState.js'
import { ROUTES } from '../utils/sessionFlow.js'

function SummaryColumn({ who, tone, titles, sharedIds, editTo }) {
  return (
    <section className="sumcol" aria-label={`Escolhas da ${who}`}>
      <div className="sumcol__head">
        <span className="sumcol__who">
          <span className="dot" data-tone={tone} aria-hidden="true" />
          {who}
        </span>
        <span className="sumcol__count">
          {titles.length} {titles.length === 1 ? 'título' : 'títulos'}
        </span>
      </div>

      <ul className="sumlist">
        {titles.map((title) => (
          <li key={title.id} className="sumitem">
            <PosterImage movie={title} sizes="48px" />
            <div>
              <strong className="sumitem__title">{title.title}</strong>
              <span className="sumitem__meta">
                {[title.type, title.year].filter(Boolean).join(' · ')}
              </span>
            </div>
            {sharedIds.has(title.id) && <span className="kind kind--both">Os dois</span>}
          </li>
        ))}
      </ul>

      <Link to={editTo} state={{ returnTo: ROUTES.summary }} className="linklike">
        Alterar escolhas<span className="sr-only"> da {who}</span>
      </Link>
    </section>
  )
}

export default function SummaryPage() {
  const navigate = useNavigate()
  const { session, reset } = useSession()
  const first = session.person1.selections
  const second = session.person2.selections

  const secondIds = new Set(second.map((title) => title.id))
  const sharedIds = new Set(first.filter((title) => secondIds.has(title.id)).map((t) => t.id))
  const sharedTitles = first.filter((title) => sharedIds.has(title.id))

  const restart = () => {
    reset()
    navigate(ROUTES.person1, { replace: true })
  }

  return (
    <section className="container summary">
      <header className="stagger">
        <span className="eyebrow">Resumo</span>
        <h1 className="summary__title">Tudo certo com as escolhas?</h1>
        <p className="lead">
          Revisem antes de o DUET comparar os gostos. Dá para alterar quantas vezes quiserem.
        </p>
      </header>

      <div className="summary__cols">
        <SummaryColumn
          who="Pessoa 1"
          tone="coral"
          titles={first}
          sharedIds={sharedIds}
          editTo={ROUTES.person1}
        />
        <SummaryColumn
          who="Pessoa 2"
          tone="sand"
          titles={second}
          sharedIds={sharedIds}
          editTo={ROUTES.person2}
        />
      </div>

      {sharedTitles.length > 0 && (
        <p className="summary__note">
          Os dois escolheram: {sharedTitles.map((title) => title.title).join(', ')}.
        </p>
      )}
      {Math.min(first.length, second.length) < RECOMMENDED_PICKS && (
        <p className="summary__note">
          Com {RECOMMENDED_PICKS} ou mais títulos cada um, as sugestões ficam melhores.
        </p>
      )}

      <div className="summary__actions">
        <Button to={ROUTES.analysis} size="lg" arrow>
          Analisar compatibilidade
        </Button>
        <Button variant="ghost" size="lg" onClick={restart}>
          Recomeçar
        </Button>
      </div>
    </section>
  )
}