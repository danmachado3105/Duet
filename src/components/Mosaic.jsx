import PosterImage from './PosterImage.jsx'

// Pilha de pôsteres de uma pessoa (até `max`), com "+N" para o restante
export default function Mosaic({ titles, max = 3 }) {
  const shown = titles.slice(0, max)
  const extra = titles.length - shown.length

  return (
    <span className="mosaic" aria-hidden="true">
      {shown.map((title, index) => (
        <span key={title.id} className="mosaic__item" style={{ '--i': index }}>
          <PosterImage movie={title} sizes="96px" eager />
        </span>
      ))}
      {extra > 0 && <span className="mosaic__more">+{extra}</span>}
    </span>
  )
}