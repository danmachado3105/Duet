import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import PosterImage from '../components/PosterImage.jsx'
import MovieSearch from '../components/MovieSearch.jsx'
import MovieFilters from '../components/MovieFilters.jsx'
import ResultsBar from '../components/ResultsBar.jsx'
import MovieGrid from '../components/MovieGrid.jsx'
import MovieDetails from '../components/MovieDetails.jsx'
import { CloseIcon } from '../components/Icons.jsx'
import { useCatalog } from '../hooks/useCatalog.js'
import { useSession } from '../context/sessionContext.js'
import { categoryFromSlug } from '../utils/categories.js'
import { MAX_PICKS, RECOMMENDED_PICKS, personKey } from '../utils/sessionState.js'
import { ROUTES } from '../utils/sessionFlow.js'

const COPY = {
  1: {
    tone: 'coral',
    who: 'Pessoa 1',
    title: 'Primeiro, escolha você.',
    sub: `Quais filmes, séries e animações você assistiria agora? Escolha quantos quiser, até ${MAX_PICKS}.`,
    hint: 'As escolhas de cada um ficam em segredo até o resumo.',
    cta: 'Confirmar escolhas',
    next: ROUTES.handoff,
  },
  2: {
    tone: 'sand',
    who: 'Pessoa 2',
    title: 'Agora é a vez da outra pessoa.',
    sub: `E você, o que escolheria? Pode escolher até ${MAX_PICKS} títulos.`,
    hint: 'As escolhas da Pessoa 1 ficam em segredo até o resumo.',
    cta: 'Continuar',
    next: ROUTES.summary,
  },
}

function uniquePicks(titles) {
  const seen = new Set()
  return titles
    .filter((title) => {
      if (seen.has(title.id)) return false
      seen.add(title.id)
      return true
    })
    .slice(0, MAX_PICKS)
}

export default function PickMoviePage({ person }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, setSelections, setProviderPreferences } = useSession()
  const copy = COPY[person]

  // Se a pessoa veio do resumo para alterar as escolhas, volta para ele ao salvar
  const returnTo = location.state?.returnTo === ROUTES.summary ? ROUTES.summary : null

  // Mantém a categoria escolhida na landing (?categoria=...)
  const search = location.search
  const initialType = categoryFromSlug(new URLSearchParams(search).get('categoria'))?.id

  // `picks` = lista em edição desta pessoa. Só entra na sessão em `confirm`.
  const [picks, setPicks] = useState(() => uniquePicks(session[personKey(person)].selections))
  const [detail, setDetail] = useState(null)
  const catalog = useCatalog({
    initialType,
    initialProviderIds: session[personKey(person)].providers ?? [],
  })

  useEffect(() => {
    setProviderPreferences(person, catalog.providerIds)
  }, [catalog.providerIds, person, setProviderPreferences])

  const pickedIds = useMemo(() => new Set(picks.map((title) => title.id)), [picks])
  const limitReached = picks.length >= MAX_PICKS

  const toggle = (movie) => {
    setPicks((current) => {
      if (current.some((title) => title.id === movie.id)) {
        return current.filter((title) => title.id !== movie.id)
      }
      return current.length >= MAX_PICKS ? current : [...current, movie]
    })
  }

  const toggleFromDetails = (movie) => {
    toggle(movie)
    setDetail(null)
  }

  const confirm = () => {
    if (picks.length === 0) return
    setSelections(person, picks)
    // replace: o botão "voltar" não leva de volta à tela de escolha
    navigate(`${returnTo ?? copy.next}${search}`, { replace: true })
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
          <p className={`pick__sub${person === 1 ? ' pick__sub--single-line' : ''}`}>{copy.sub}</p>
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
            selectedGenres={catalog.genres}
            onGenreToggle={catalog.toggleGenre}
            genreStatus={catalog.genreStatus}
            onRetryGenres={catalog.retry}
            providers={catalog.providerOptions}
            providerIds={catalog.providerIds}
            onProviderToggle={(providerId) =>
              catalog.setProviderIds((current) =>
                current.includes(providerId)
                  ? current.filter((id) => id !== providerId)
                  : [...current, providerId],
              )
            }
            providerStatus={catalog.providerStatus}
            onRetryProviders={catalog.retryProviders}
            activeCount={catalog.activeFilterCount}
            onClear={catalog.clear}
          />
        </div>

        <ResultsBar
          status={catalog.status}
          count={catalog.items.length}
          hasMore={catalog.hasMore}
          sort={catalog.sort}
          onSortChange={catalog.setSort}
        />

        <MovieGrid
          catalog={catalog}
          pickedIds={pickedIds}
          limitReached={limitReached}
          onOpen={setDetail}
          onToggle={toggle}
        />

        {catalog.source === 'tmdb' && (
          <p className="tmdb-notice">
            Dados e imagens fornecidos pela TMDB. Este produto usa a API da TMDB, mas não é
            endossado nem certificado por ela.
          </p>
        )}
      </div>

      <div className="pick__bar">
        <div className="container pick__bar-inner">
          <div className="tray">
            <p className="tray__label" aria-live="polite">
              <span className="tray__who">{copy.who}</span>
              <span>
                {picks.length} de {MAX_PICKS} títulos escolhidos
                {limitReached ? ' · limite atingido' : ` · faltam ${MAX_PICKS - picks.length}`}
              </span>
            </p>
            <div
              className="tray__progress"
              role="progressbar"
              aria-label={`Títulos escolhidos por ${copy.who}`}
              aria-valuemin={0}
              aria-valuemax={MAX_PICKS}
              aria-valuenow={picks.length}
              aria-valuetext={`${picks.length} de ${MAX_PICKS} títulos escolhidos`}
            >
              <span style={{ width: `${(picks.length / MAX_PICKS) * 100}%` }} />
            </div>
            {limitReached && (
              <p className="tray__limit" role="status">
                Remova um título da lista para escolher outro.
              </p>
            )}

            {picks.length > 0 ? (
              <ul className="tray__list">
                {picks.map((title) => (
                  <li key={title.id}>
                    <button
                      type="button"
                      className="tray__item"
                      aria-label={`Remover ${title.title} da lista`}
                      onClick={() => toggle(title)}
                    >
                      <PosterImage movie={title} sizes="40px" eager />
                      <span className="tray__x" aria-hidden="true">
                        <CloseIcon size={10} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="tray__hint">Use + em um título para adicioná-lo à sua lista.</p>
            )}

            {picks.length > 0 && picks.length < RECOMMENDED_PICKS && (
              <p className="tray__hint">
                Com {RECOMMENDED_PICKS} ou mais, as sugestões ficam melhores.
              </p>
            )}
          </div>

          <div className="pick__bar-actions">
            {picks.length > 0 && (
              <Button variant="ghost" onClick={() => setPicks([])}>
                Limpar
              </Button>
            )}
            <Button size="lg" arrow disabled={picks.length === 0} onClick={confirm}>
              {returnTo ? 'Salvar escolhas' : copy.cta}
            </Button>
          </div>
        </div>
      </div>

      <MovieDetails
        movie={detail}
        selected={Boolean(detail) && pickedIds.has(detail.id)}
        limitReached={limitReached}
        onClose={() => setDetail(null)}
        onToggle={toggleFromDetails}
      />
    </div>
  )
}