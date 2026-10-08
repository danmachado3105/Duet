export default function Poster({ title, year, tone, className = '' }) {
  return (
    <figure className={`poster ${className}`} data-tone={tone}>
      <span className="poster__year">{year}</span>
      <figcaption className="poster__title">{title}</figcaption>
    </figure>
  )
}