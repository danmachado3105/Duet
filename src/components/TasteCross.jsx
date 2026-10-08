import { useState } from 'react'
import VennMark from './VennMark.jsx'
import Score from './Score.jsx'
import { compatibilityExample } from '../data/compatibility.js'

export default function TasteCross() {
  const { you, partner, result, score } = compatibilityExample
  const [linked, setLinked] = useState(null)

  const chipProps = (label) => ({
    onPointerEnter: () => setLinked(label),
    onPointerLeave: () => setLinked(null),
  })

  return (
    <div className="cross">
      <div className="cross__col">
        {[you, partner].map((person) => (
          <div key={person.label}>
            <span className="cross__who">
              <span className="dot" data-tone={person.tone} aria-hidden="true" />
              {person.label}
            </span>
            <ul className="chips">
              {person.tastes.map((taste) => (
                <li
                  key={taste}
                  className={`chip ${linked === taste ? 'is-linked' : ''}`}
                  {...chipProps(taste)}
                >
                  {taste}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="cross__core" aria-hidden="true">
        <span className="cross__arrow" />
        <span className="cross__brand">
          <VennMark />
          <span>DUET</span>
        </span>
        <span className="cross__arrow" />
      </div>

      <div className="cross__result">
        <span className="cross__who">Em comum</span>
        <ul className="chips">
          {result.map((item) => (
            <li
              key={item.label}
              className={`chip chip--${item.tone} ${linked === item.label ? 'is-linked' : ''}`}
              {...chipProps(item.label)}
            >
              <span className="dot" data-tone={item.tone} aria-hidden="true" />
              {item.label}
            </li>
          ))}
        </ul>
        <Score value={score} />
      </div>
    </div>
  )
}