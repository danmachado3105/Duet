import Button from './Button.jsx'
import PosterImage from './PosterImage.jsx'
import { StarIcon } from './Icons.jsx'
import { KIND_LABEL } from '../utils/compat.js'

export default function RecommendationCard({ item, rank, onOpen }) {
  const { title, percent, kind, reasons } = item
  const meta = [title.year, title.genres.slice(0, 3).join(' · ')].filter(Boolean).join(' · ')

  return (
    <li className="rcard" style={{ '--i': Math.min(rank, 8) }}>
      <button
        type="button"
        className="rcard__poster"
        aria-haspopup="dialog"
        aria-label={`${title.title}. Ver detalhes`}
        onClick={() => onOpen(title)}
      >
        <PosterImage movie={title} sizes="(min-width: 1100px) 160px, 140px" />
      </button>

      <div className="rcard__body">
        {rank === 0 && <span className="rcard__flag">Melhor combinação</span>}

        <div className="rcard__kinds">
          <span className="kind" data-kind={kind}>
            {KIND_LABEL[kind]}
          </span>
          {kind === 'animation' && <span className="kind">{title.type}</span>}
        </div>

        <h3 className="rcard__title">{title.title}</h3>

        <p className="rcard__meta">
          {meta}
          {title.rating != null && (
            <span className="rcard__rating">
              <StarIcon size={12} />
              <span className="sr-only">Nota </span>
              {title.rating.toFixed(1)}
            </span>
          )}
        </p>

        <div className="rcard__score">
          <p>
            <b>{percent}%</b> compatível
          </p>
          <div className="meter" aria-hidden="true">
            <span className="meter__fill" style={{ '--w': `${percent}%` }} />
          </div>
        </div>

        <ul className="rcard__reasons">
          {reasons.slice(0, 3).map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>

        {title.synopsis && <p className="rcard__synopsis">{title.synopsis}</p>}

        <Button variant="ghost" size="sm" onClick={() => onOpen(title)}>
          Ver detalhes
        </Button>
      </div>
    </li>
  )
}