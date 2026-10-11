import MovieCard from './MovieCard.jsx'

export default function MovieGrid({ items, selectedId, onOpen, onClear, hasFilters, query }) {
  const term = query.trim()

  return (
    <>
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
            <button type="button" className="linklike" onClick={onClear}>
              Limpar busca e filtros
            </button>
          )}
        </div>
      ) : (
        <ul className="mgrid">
          {items.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              selected={movie.id === selectedId}
              onOpen={onOpen}
            />
          ))}
        </ul>
      )}
    </>
  )
}