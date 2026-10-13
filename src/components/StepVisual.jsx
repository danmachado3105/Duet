import PosterImage from './PosterImage.jsx'
import VennMark from './VennMark.jsx'
import { useShowcase } from '../context/showcaseContext.js'

export default function StepVisual({ type }) {
  const { data } = useShowcase()
  const [first, second] = data.pair

  switch (type) {
    case 'picks':
      return (
        <div className="sv">
          <PosterImage movie={first.movie} sizes="78px" />
          <span className="sv__plus">+</span>
          <PosterImage movie={second.movie} sizes="78px" />
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
          {data.recommendations.map((item, i) => (
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
          <PosterImage movie={data.result.movie} sizes="78px" />
          <span className="sv__stamp">Match</span>
        </div>
      )

    default:
      return null
  }
}