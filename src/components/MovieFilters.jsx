const TYPES = [
  { id: 'all', label: 'Todos' },
  { id: 'movie', label: 'Filmes' },
  { id: 'series', label: 'Séries' },
]

export default function MovieFilters({ type, onTypeChange, genres, genre, onGenreChange }) {
  return (
    <div className="filters">
      <div className="seg" role="group" aria-label="Tipo de título">
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

      <div className="genres" role="group" aria-label="Gêneros">
        {genres.map((name) => (
          <button
            key={name}
            type="button"
            className="genre"
            aria-pressed={genre === name}
            onClick={() => onGenreChange(genre === name ? null : name)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}