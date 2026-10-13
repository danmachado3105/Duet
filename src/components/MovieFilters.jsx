import { useState } from 'react'

const TYPES = [
  { id: 'all', label: 'Todos' },
  { id: 'movie', label: 'Filmes' },
  { id: 'series', label: 'Séries' },
  { id: 'animation', label: 'Animações' },
]

const VISIBLE_GENRES = 10

// `genres` = lista de opções { name, ids } já filtrada para o tipo selecionado
export default function MovieFilters({ type, onTypeChange, genres, genre, onGenreChange }) {
  const [expanded, setExpanded] = useState(false)

  let visible = genres
  if (!expanded) {
    visible = genres.slice(0, VISIBLE_GENRES)
    const chosen = genres.find((option) => option.name === genre)
    // O gênero selecionado nunca fica escondido
    if (chosen && !visible.includes(chosen)) visible = [...visible, chosen]
  }

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

      {genres.length > 0 && (
        <div className="genres" data-expanded={expanded} role="group" aria-label="Gêneros">
          {visible.map((option) => (
            <button
              key={option.name}
              type="button"
              className="genre"
              aria-pressed={genre === option.name}
              onClick={() => onGenreChange(genre === option.name ? null : option.name)}
            >
              {option.name}
            </button>
          ))}
          {genres.length > VISIBLE_GENRES && (
            <button
              type="button"
              className="genre genre--more"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? 'Mostrar menos' : `Mais gêneros (${genres.length - VISIBLE_GENRES})`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}