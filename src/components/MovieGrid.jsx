import { useState } from 'react'
import Button from './Button.jsx'
import CatalogMessage from './CatalogMessage.jsx'
import MovieCard from './MovieCard.jsx'
import MovieGridSkeleton from './MovieGridSkeleton.jsx'

const PAGE_SIZE = 12

export default function MovieGrid({ catalog, pickedIds, limitReached, onOpen, onToggle }) {
  const { status, error, items, query, hasFilters, hasMore, loadingMore, moreError } = catalog
  const gridKey = `${catalog.viewKey}|${query}`
  const [pageState, setPageState] = useState({ key: gridKey, count: PAGE_SIZE })
  const visibleCount = pageState.key === gridKey ? pageState.count : PAGE_SIZE
  const visibleItems = items.slice(0, visibleCount)
  const canRevealMore = visibleCount < items.length

  if (status === 'loading') {
    return (
      <>
        <p className="sr-only" role="status">
          Carregando títulos...
        </p>
        <MovieGridSkeleton />
      </>
    )
  }

  if (status === 'error') {
    return (
      <CatalogMessage
        error={error}
        onRetry={catalog.retry}
        onUseDemo={() => catalog.switchSource('demo')}
      />
    )
  }

  const term = query.trim()

  return (
    <div key={catalog.viewKey} className="view-in">
      <p className="sr-only" aria-live="polite">
        {items.length} {items.length === 1 ? 'título encontrado' : 'títulos encontrados'}
      </p>

      {items.length === 0 ? (
        <div className="empty">
          <h2>Nada por aqui.</h2>
          <p>
            {term
              ? `Nenhum título encontrado para “${term}”.`
              : 'Nenhum título combina com esses filtros.'}
          </p>
          {hasFilters && (
            <button type="button" className="linklike" onClick={catalog.clear}>
              Limpar busca e filtros
            </button>
          )}
        </div>
      ) : (
        <ul className="mgrid">
          {visibleItems.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={index}
              selected={pickedIds.has(movie.id)}
              disabled={limitReached}
              onOpen={onOpen}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}

      {(canRevealMore || hasMore) && (
        <div className="loadmore">
          {moreError && <p role="alert">Não foi possível carregar mais títulos.</p>}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              if (canRevealMore) {
                setPageState({ key: gridKey, count: visibleCount + PAGE_SIZE })
              } else {
                catalog.loadMore()
              }
            }}
            disabled={loadingMore}
          >
            {loadingMore
              ? 'Carregando...'
              : canRevealMore
                ? 'Ver mais títulos'
                : moreError
                  ? 'Tentar novamente'
                  : 'Carregar mais'}
          </Button>
        </div>
      )}
    </div>
  )
}