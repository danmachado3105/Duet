import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import PosterImage from '../components/PosterImage.jsx'
import MovieSearch from '../components/MovieSearch.jsx'
import MovieFilters from '../components/MovieFilters.jsx'
import ResultsBar from '../components/ResultsBar.jsx'
import MovieGrid from '../components/MovieGrid.jsx'
import MovieDetails from '../components/MovieDetails.jsx'
import { useCatalog } from '../hooks/useCatalog.js'
import { useSession } from '../context/sessionContext.js'
import { personKey } from '../utils/sessionState.js'
import { ROUTES } from '../utils/sessionFlow.js'

const COPY = {
  1: {
    tone: 'coral',
    who: 'Pessoa 1',
    title: 'Primeiro, escolha você.',
    sub: 'Qual filme ou série você assistiria agora?',
    hint: 'A escolha de cada um fica em segredo até a análise.',
    cta: 'Confirmar escolha',
    next: ROUTES.handoff,
  },
  2: {
    tone: 'sand',
    who: 'Pessoa 2',
    title: 'Agora é a vez da outra pessoa.',
    sub: 'Qual seria a sua escolha?',
    hint: 'A escolha da Pessoa 1 fica em segredo até a análise.',
    cta: 'Continuar',
    next: ROUTES.analysis,
  },
}

export default function PickMoviePage({ person }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, selectMovie } = useSession()
  const copy = COPY[person]

  // Se a pessoa veio da análise para trocar a escolha, volta para ela ao salvar
  const returnTo = location.state?.returnTo === ROUTES.analysis ? ROUTES.analysis : null

  // `pending` = seleção temporária no catálogo. A escolha confirmada só entra na sessão em `confirm`.
  const [pending, setPending] = useState(session[personKey(person)].selectedMovie)
  const [detail, setDetail] = useState(null)
  const catalog = useCatalog()

  const choose = (movie) => {
    setPending(movie)
    setDetail(null)
  }

  const confirm = () => {
    if (!pending) return
    selectMovie(person, pending)
    // replace: o botão "voltar" não leva de volta à tela de escolha
    navigate(returnTo ?? copy.next, { replace: true })
  }

  return (
    <div className="pick" data-person={person}>
      <div className="container pick__content">
        <header className="pick__head stagger">
          <span className="pick__who">
            <span className="dot" data-tone={copy.tone} aria-hidden="true" />
            {copy.who}
          </span>
          <h1 className="pick__title">{copy.title}</h1>
          <p className="pick__sub">{copy.sub}</p>
          <p className="pick__hint">{copy.hint}</p>
        </header>

        {catalog.source === 'demo' && (
          <p className="demo-banner" role="status">
            Catálogo de demonstração: dados fictícios, sem a TMDB.{' '}
            <button type="button" className="linklike" onClick={() => catalog.switchSource('tmdb')}>
              Usar a TMDB
            </button>
          </p>
        )}

        <div className="tools">
          <MovieSearch value={catalog.query} onChange={catalog.setQuery} />
          <MovieFilters
            type={catalog.type}
            onTypeChange={catalog.setType}
            genres={catalog.genreOptions}
            genre={catalog.genre}
            onGenreChange={catalog.setGenre}
          />
        </div>

        <ResultsBar
          status={catalog.status}
          count={catalog.items.length}
          hasMore={catalog.hasMore}
          sort={catalog.sort}
          onSortChange={catalog.setSort}
          hasFilters={catalog.hasFilters}
          onClear={catalog.clear}
        />

        <MovieGrid catalog={catalog} selectedId={pending?.id} onOpen={setDetail} />

        {catalog.source === 'tmdb' && (
          <p className="tmdb-notice">
            Dados e imagens fornecidos pela TMDB. Este produto usa a API da TMDB, mas não é
            endossado nem certificado por ela.
          </p>
        )}
      </div>

      <div className="pick__bar">
        <div className="container pick__bar-inner">
          <div className="chosen" aria-live="polite">
            {pending ? (
              <>
                <PosterImage movie={pending} sizes="40px" eager />
                <div className="chosen__text">
                  <span className="chosen__label">{copy.who} · sua escolha</span>
                  <span className="chosen__title">{pending.title}</span>
                </div>
              </>
            ) : (
              <div className="chosen__text">
                <span className="chosen__label">{copy.who}</span>
                <span className="chosen__empty">Selecione um título para continuar</span>
              </div>
            )}
          </div>

          <div className="pick__bar-actions">
            {pending && (
              <Button variant="ghost" onClick={() => setPending(null)}>
                Trocar
              </Button>
            )}
            <Button size="lg" arrow disabled={!pending} onClick={confirm}>
              {returnTo ? 'Salvar escolha' : copy.cta}
            </Button>
          </div>
        </div>
      </div>

      <MovieDetails
        movie={detail}
        selected={Boolean(detail) && detail.id === pending?.id}
        onClose={() => setDetail(null)}
        onChoose={choose}
      />
    </div>
  )
}