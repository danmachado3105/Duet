import { useId, useState } from 'react'
import { providerLogoUrl } from '../services/tmdb.js'

const TYPES = [
  { id: 'all', label: 'Todos' },
  { id: 'movie', label: 'Filmes' },
  { id: 'series', label: 'Séries' },
  { id: 'animation', label: 'Animações' },
]

const VISIBLE_GENRES = 6
const VISIBLE_PROVIDERS = 8

export default function MovieFilters({
  type,
  onTypeChange,
  genres,
  selectedGenres,
  onGenreToggle,
  genreStatus,
  onRetryGenres,
  providers,
  providerIds,
  onProviderToggle,
  providerStatus,
  onRetryProviders,
  activeCount,
  onClear,
}) {
  const [open, setOpen] = useState(false)
  const [genresExpanded, setGenresExpanded] = useState(false)
  const [providersExpanded, setProvidersExpanded] = useState(false)
  const panelId = useId()

  const visibleGenres = genresExpanded ? genres : genres.slice(0, VISIBLE_GENRES)
  if (!genresExpanded) {
    selectedGenres.forEach((name) => {
      const chosen = genres.find((option) => option.name === name)
      if (chosen && !visibleGenres.includes(chosen)) visibleGenres.push(chosen)
    })
  }

  const visibleProviders = providersExpanded
    ? providers
    : providers.slice(0, VISIBLE_PROVIDERS)
  const chosenProviders = providers.filter((provider) => providerIds.includes(provider.id))
  if (!providersExpanded) {
    chosenProviders.forEach((provider) => {
      if (!visibleProviders.includes(provider)) visibleProviders.push(provider)
    })
  }
  const hiddenGenreCount = Math.max(0, genres.length - visibleGenres.length)
  const hiddenProviderCount = Math.max(0, providers.length - visibleProviders.length)

  return (
    <section className="filters" aria-label="Filtros do catálogo">
      <div className="filters__toolbar">
        <div className="filters__type">
          <span className="sr-only">Tipo de conteúdo</span>
          <div className="seg" role="group" aria-label="Tipo de conteúdo">
            {TYPES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={type === item.id}
                onClick={() => onTypeChange(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="filters__toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="filters__toggle-label">Filtros</span>
          {activeCount > 0 && (
            <span className="filters__count" aria-label={`${activeCount} filtros aplicados`}>
              {activeCount}
            </span>
          )}
          <span className="filters__chevron" aria-hidden="true">
            {open ? '−' : '+'}
          </span>
        </button>
      </div>

      <div
        id={panelId}
        className="filters__panel"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="filters__body">
          <div className="filters__heading">
            <p>Refine por gênero ou serviço</p>
            {activeCount > 0 && (
              <button type="button" className="linklike filters__clear" onClick={onClear}>
                Limpar filtros
              </button>
            )}
          </div>

          <section className="filters__group" aria-labelledby={`${panelId}-genres`}>
            <h2 id={`${panelId}-genres`}>Gêneros</h2>
            {genres.length > 0 ? (
              <div className="filters__chips filters__chips--genres" role="group" aria-label="Gêneros">
                {visibleGenres.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    className="genre"
                    aria-pressed={selectedGenres.includes(option.name)}
                    onClick={() => onGenreToggle(option.name)}
                  >
                    {option.name}
                  </button>
                ))}
                {(genresExpanded || hiddenGenreCount > 0) && (
                  <button
                    type="button"
                    className="genre genre--more"
                    aria-expanded={genresExpanded}
                    onClick={() => setGenresExpanded((value) => !value)}
                  >
                    {genresExpanded ? 'Mostrar menos' : `Mais gêneros (${hiddenGenreCount})`}
                  </button>
                )}
              </div>
            ) : (
              <p className="filters__message">
                {genreStatus === 'loading' && 'Carregando gêneros...'}
                {genreStatus === 'error' && (
                  <>
                    Não foi possível carregar os gêneros.{' '}
                    <button type="button" className="linklike" onClick={onRetryGenres}>
                      Tentar novamente
                    </button>
                  </>
                )}
              </p>
            )}
          </section>

          <section className="filters__group filters__group--providers" aria-labelledby={`${panelId}-providers`}>
            <div className="filters__group-heading">
              <h2 id={`${panelId}-providers`}>Onde assistir</h2>
              <span>Brasil · assinatura</span>
            </div>

            {providerStatus === 'loading' && (
              <p className="filters__message" role="status">
                Carregando serviços...
              </p>
            )}
            {providerStatus === 'error' && (
              <p className="filters__message" role="alert">
                Não foi possível carregar os serviços.{' '}
                <button type="button" className="linklike" onClick={onRetryProviders}>
                  Tentar novamente
                </button>
              </p>
            )}
            {providerStatus === 'idle' && (
              <p className="filters__message">
                A disponibilidade só é informada pelo catálogo TMDB.
              </p>
            )}
            {providerStatus === 'success' && providers.length === 0 && (
              <p className="filters__message">Nenhum serviço informado para o Brasil.</p>
            )}
            {providerStatus === 'success' && providers.length > 0 && (
              <div className="filters__chips filters__chips--providers" role="group" aria-label="Serviços de streaming">
                {visibleProviders.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    className="filters__provider"
                    aria-label={provider.name}
                    aria-pressed={providerIds.includes(provider.id)}
                    onClick={() => onProviderToggle(provider.id)}
                  >
                    {provider.logoPath ? (
                      <img
                        src={providerLogoUrl(provider.logoPath)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className="filters__provider-mark" aria-hidden="true">
                        {provider.name.slice(0, 1)}
                      </span>
                    )}
                    <span>{provider.name}</span>
                  </button>
                ))}
                {(providersExpanded || hiddenProviderCount > 0) && (
                  <button
                    type="button"
                    className="filters__provider filters__provider--more"
                    aria-expanded={providersExpanded}
                    onClick={() => setProvidersExpanded((value) => !value)}
                  >
                    {providersExpanded ? 'Mostrar menos' : `Mais serviços (${hiddenProviderCount})`}
                  </button>
                )}
              </div>
            )}
            {providerStatus === 'success' && providers.length > 0 && (
              <p className="filters__message filters__provider-note">
                Os resultados consideram apenas assinatura; aluguel e compra ficam de fora.
              </p>
            )}
          </section>
        </div>
      </div>
    </section>
  )
}
