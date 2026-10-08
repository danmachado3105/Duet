import Poster from './Poster.jsx'
import VennMark from './VennMark.jsx'
import { movies, sessionMock } from '../data/movies.js'

export default function StepVisual({ type }) {
  switch (type) {
    case 'picks':
      return (
        <div className="sv">
          <Poster movie={movies.interstellar} size="sm" />
          <span className="sv__plus">+</span>
          <Poster movie={movies.corra} size="sm" />
        </div>
      )

    case 'overlap':
      return (
        <div className="sv">
          <VennMark className="sv__venn" />
        </div>
      )

    case 'ranking':
      return (
        <ul className="sv sv--ranking">
          {sessionMock.recommendations.map((item, i) => (
            <li key={item.movie.id} style={{ '--w': `${item.score}%`, '--i': i }}>
              <span>{item.movie.title}</span>
              <b>{item.score}%</b>
              <span className="sv__bar">
                <i />
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