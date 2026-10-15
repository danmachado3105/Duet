import PosterImage from './PosterImage.jsx'
import { CheckIcon, PlusIcon, StarIcon } from './Icons.jsx'

const CARD_SIZES = '(min-width: 1120px) 220px, (min-width: 900px) 22vw, (min-width: 640px) 30vw, 46vw'

// Clicar no cartão abre os detalhes. O botão redondo (+ / ✓) adiciona ou remove da lista.
export default function MovieCard({ movie, selected, disabled, onOpen, onToggle, index = 0 }) {
  const year = movie.year ? `, ${movie.year}` : ''

  return (
    <li
      className="mcard"
      data-selected={selected}
      data-disabled={disabled && !selected}
      style={{ '--i': Math.min(index, 11) }}
    >
      <button
        type="button"
        className="mcard__btn"
        aria-haspopup="dialog"
        aria-label={`${movie.title}, ${movie.type}${year}. Ver detalhes${selected ? '. Está na sua lista' : ''}`}
        onClick={() => onOpen(movie)}
      >
        <span className="mcard__art">
          <PosterImage movie={movie} sizes={CARD_SIZES} />
          {movie.type === 'Série' && <span className="mcard__tag">Série</span>}
        </span>
        <span className="mcard__info">
          <span className="mcard__title">{movie.title}</span>
          <span className="mcard__meta">
            {movie.year && <span>{movie.year}</span>}
            {movie.rating != null && (
              <span className="mcard__rating">
                <StarIcon size={12} />
                {movie.rating.toFixed(1)}
              </span>
            )}
          </span>
        </span>
      </button>

      <button
        type="button"
        className="mcard__toggle"
        aria-pressed={selected}
        aria-label={
          selected ? `Remover ${movie.title} da lista` : `Adicionar ${movie.title} à lista`
        }
        title={disabled && !selected ? 'Limite de títulos atingido' : undefined}
        disabled={disabled && !selected}
        onClick={() => onToggle(movie)}
      >
        {selected ? <CheckIcon size={16} /> : <PlusIcon size={16} />}
      </button>
    </li>
  )
}