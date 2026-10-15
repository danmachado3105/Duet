import { useState } from 'react'
import { useTitleDetails } from '../hooks/useTitleDetails.js'
import PosterImage from './PosterImage.jsx'

function FeaturedMatch({ title, position, total, onOpen }) {
  const { item, status } = useTitleDetails(title)

  return (
    <article className="match-reveal" key={title.id}>
      <button
        type="button"
        className="match-reveal__poster"
        aria-haspopup="dialog"
        aria-label={`Ver detalhes de ${title.title}`}
        onClick={() => onOpen(title)}
      >
        <PosterImage movie={title} sizes="(min-width: 900px) 280px, 42vw" eager />
      </button>

      <div className="match-reveal__content">
        <span className="match-reveal__eyebrow">
          {total > 1 ? `MATCH ${position + 1} DE ${total}` : 'MATCH ENTRE VOCÊS'}
        </span>
        <h3 className="match-reveal__title">{title.title}</h3>
        <p className="match-reveal__meta">
          {[title.type, title.year].filter(Boolean).join(' · ')}
        </p>
        {item.synopsis ? (
          <p className="match-reveal__synopsis">{item.synopsis}</p>
        ) : status === 'loading' ? (
          <p className="match-reveal__synopsis" role="status">
            Carregando sinopse...
          </p>
        ) : null}
        <button type="button" className="linklike match-reveal__details" onClick={() => onOpen(title)}>
          Ver detalhes e onde assistir
        </button>
      </div>
    </article>
  )
}

export default function MatchReveal({ titles, onOpen }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeTitle = titles[activeIndex] ?? titles[0]

  return (
    <div className="match-showcase">
      <div className="match-showcase__intro">
        <span className="match-showcase__mark" aria-hidden="true" />
        <div>
          <p className="match-showcase__kicker">Em comum</p>
          <h2 className="match-showcase__heading">
            O mesmo título entrou nas duas listas.
          </h2>
        </div>
      </div>

      <FeaturedMatch
        key={activeTitle.id}
        title={activeTitle}
        position={activeIndex}
        total={titles.length}
        onOpen={onOpen}
      />

      {titles.length > 1 && (
        <div className="match-showcase__others">
          <p className="match-showcase__others-label">Outros títulos em comum</p>
          <ul className="match-showcase__list" aria-label="Títulos em comum">
            {titles
              .map((title, index) => ({ title, index }))
              .filter(({ index }) => index !== activeIndex)
              .map(({ title, index }) => (
                <li key={title.id}>
                  <button
                    type="button"
                    className="match-showcase__choice"
                    aria-pressed={false}
                    aria-label={`Destacar ${title.title}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <PosterImage movie={title} sizes="56px" />
                    <span>{title.title}</span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}
