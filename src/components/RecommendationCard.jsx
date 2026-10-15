import PosterImage from './PosterImage.jsx'

export default function RecommendationCard({ item, rank, onOpen }) {
  const { title } = item

  return (
    <li className="rcard" style={{ '--i': Math.min(rank, 8) }}>
      <button
        type="button"
        className="rcard__button"
        aria-haspopup="dialog"
        aria-label={`Ver detalhes de ${title.title}`}
        onClick={() => onOpen(title)}
      >
        <PosterImage movie={title} sizes="(min-width: 1120px) 200px, (min-width: 640px) 25vw, 42vw" />
        <span className="rcard__title">{title.title}</span>
      </button>
    </li>
  )
}
