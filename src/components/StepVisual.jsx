import Poster from './Poster.jsx'
import VennMark from './VennMark.jsx'
import { movies, ranking } from '../data/movies.js'

export default function StepVisual({ type }) {
  switch (type) {
    case 'picks':
      return (
        <div className="sv sv--picks">
          <div className="sv__item">
            <Poster movie={movies.interstellar} size="sm" />
            <span className="sv__caption">Marina</span>
          </div>
          <div className="sv__item">
            <Poster movie={movies.corra} size="sm" />
            <span className="sv__caption">Caio</span>
          </div>
        </div>
      )

    case 'overlap':
      return (
        <div className="sv sv--overlap">
          <VennMark className="sv__venn" />
        </div>
      )

    case 'ranking':
      return (
        <ul className="sv sv--ranking">
          {ranking.map((item) => (
            <li key={item.title}>
              <span>{item.title}</span>
              <b>{item.score}%</b>
              <span className="sv__bar">
                <i style={{ '--w': `${item.score}%` }} />
              </span>
            </li>
          ))}
        </ul>
      )

    case 'match':
      return (
        <div className="sv sv--match">
          <Poster movie={movies.origem} size="sm" />
          <span className="sv__stamp">Match</span>
        </div>
      )

    default:
      return null
  }
}