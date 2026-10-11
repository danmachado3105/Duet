import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Poster from '../components/Poster.jsx'
import MovieSearch from '../components/MovieSearch.jsx'
import MovieFilters from '../components/MovieFilters.jsx'
import MovieGrid from '../components/MovieGrid.jsx'
import MovieDetails from '../components/MovieDetails.jsx'
import { catalog } from '../data/catalog.js'
import { useCatalogFilters } from '../hooks/useCatalogFilters.js'
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
  const { session, selectMovie } = useSession()
  const copy = COPY[person]

  const [pending, setPending] = useState(session[personKey(person)].selectedMovie)
  const [detail, setDetail] = useState(null)
  const filters = useCatalogFilters(catalog)

  const choose = (movie) => {
    setPending(movie)
    setDetail(null)
  }

  const confirm = () => {
    selectMovie(person, pending)
    // replace: o botão "voltar" não leva de volta à tela de escolha
    navigate(copy.next, { replace: true })
  }

  return (
    <div className="container pick" data-person={person}>
      <header className="pick__head stagger">
        <span className="pick__who">
          <span className="dot" data-tone={copy.tone} aria-hidden="true" />
          {copy.who}
        </span>
        <h1 className="pick__title">{copy.title}</h1>
        <p className="pick__sub">{copy.sub}</p>
        <p className="pick__hint">{copy.hint}</p>
      </header>

      <div className="tools">
        <MovieSearch value={filters.query} onChange={filters.setQuery} />
        <MovieFilters
          type={filters.type}
          onTypeChange={filters.setType}
          genres={filters.genres}
          genre={filters.genre}
          onGenreChange={filters.setGenre}
        />
      </div>

      <MovieGrid
        items={filters.results}
        selectedId={pending?.id}
        onOpen={setDetail}
        onClear={filters.clear}
        hasFilters={filters.hasFilters}
      />

      {pending && (
        <div className="pick__bar">
          <div className="pick__bar-inner">
            <div className="chosen">
              <Poster movie={pending} size="mini" />
              <div className="chosen__text">
                <span className="chosen__label">Sua escolha</span>
                <span className="chosen__title">{pending.title}</span>
              </div>
            </div>
            <div className="pick__bar-actions">
              <Button variant="ghost" onClick={() => setPending(null)}>
                Trocar
              </Button>
              <Button size="lg" arrow onClick={confirm}>
                {copy.cta}
              </Button>
            </div>
          </div>
        </div>
      )}

      <MovieDetails
        movie={detail}
        selected={Boolean(detail) && detail.id === pending?.id}
        onClose={() => setDetail(null)}
        onChoose={choose}
      />
    </div>
  )
}