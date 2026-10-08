// Pôster ilustrativo feito em CSS. Sempre acompanha o título em texto, então é decorativo.
export default function Poster({ movie, size = 'md', className = '' }) {
  const { title, year, art } = movie

  return (
    <figure
      className={`poster poster--${size} ${className}`.trim()}
      data-motif={art.motif}
      style={{ '--pa': art.a, '--pb': art.b, '--pc': art.c }}
      aria-hidden="true"
    >
      <span className="poster__year">{year}</span>
      <figcaption className="poster__title">{title}</figcaption>
    </figure>
  )
}