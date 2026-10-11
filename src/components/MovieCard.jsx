import Poster from './Poster.jsx'
import { CheckIcon, StarIcon } from './Icons.jsx'

export default function MovieCard({ movie, selected, onOpen }) {
  return (
    <li className="mcard" data-selected={selected}>
      <button
        type="button"
        className="mcard__btn"
        aria-haspopup="dialog"
        aria-label={`${movie.title}, ${movie.year}. Ver detalhes${selected ? '. Selecionado' : ''}`}
        onClick={() => onOpen(movie)}
      >
        <span className="mcard__art">
          <Poster movie={movie} size="md" />
          {movie.type === 'Série' && <span className="mcard__tag">Série</span>}
          <span className="mcard__badge" aria-hidden="true">
            <CheckIcon size={16} />
          </span>
        </span>
        <span className="mcard__info">
          <span className="mcard__title">{movie.title}</span>
          <span className="mcard__meta">
            <span>{movie.year}</span>
            <span className="mcard__rating">
              <StarIcon size={12} />
              {movie.rating.toFixed(1)}
            </span>
          </span>
        </span>
      </button>
    </li>
  )
}