import PosterImage from './PosterImage.jsx'
import { CheckIcon, StarIcon } from './Icons.jsx'

const CARD_SIZES = '(min-width: 1120px) 220px, (min-width: 900px) 22vw, (min-width: 640px) 30vw, 46vw'

export default function MovieCard({ movie, selected, onOpen }) {
  const year = movie.year ? `, ${movie.year}` : ''

  return (
    <li className="mcard" data-selected={selected}>
      <button
        type="button"
        className="mcard__btn"
        aria-haspopup="dialog"
        aria-label={`${movie.title}, ${movie.type}${year}. Ver detalhes${selected ? '. Selecionado' : ''}`}
        onClick={() => onOpen(movie)}
      >
        <span className="mcard__art">
          <PosterImage movie={movie} sizes={CARD_SIZES} />
          {movie.type === 'Série' && <span className="mcard__tag">Série</span>}
          <span className="mcard__badge" aria-hidden="true">
            <CheckIcon size={16} />
          </span>
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
          {movie.genres.length > 0 && (
            <span className="mcard__genres">{movie.genres.slice(0, 2).join(' · ')}</span>
          )}
        </span>
      </button>
    </li>
  )
}