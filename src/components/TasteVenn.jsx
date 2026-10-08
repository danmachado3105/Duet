import { useId } from 'react'

export default function TasteVenn() {
  const clipId = useId().replace(/:/g, '')

  return (
    <figure className="venn">
      <svg
        className="venn__svg"
        viewBox="0 0 400 260"
        role="img"
        aria-label="Dois gostos diferentes se encontram em uma recomendação com 94% de compatibilidade"
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx="150" cy="130" r="105" />
          </clipPath>
        </defs>
        <circle className="venn__circle venn__circle--a" cx="150" cy="130" r="105" />
        <circle className="venn__circle venn__circle--b" cx="250" cy="130" r="105" />
        <g clipPath={`url(#${clipId})`}>
          <circle className="venn__lens" cx="250" cy="130" r="105" />
        </g>
        <text className="venn__score" x="200" y="148" textAnchor="middle">
          94%
        </text>
      </svg>

      <figcaption className="venn__legend">
        <span>
          <b>Marina</b>
          Interstellar
        </span>
        <span className="venn__match">A Origem</span>
        <span>
          <b>Caio</b>
          Corra!
        </span>
      </figcaption>
    </figure>
  )
}