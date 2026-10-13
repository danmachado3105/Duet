import PosterImage from './PosterImage.jsx'
import VennMark from './VennMark.jsx'
import { useShowcase } from '../context/showcaseContext.js'

export default function FlowStrip() {
  const { data } = useShowcase()
  const [first, second] = data.pair
  const result = data.result.movie

  return (
    <div
      className="flow"
      role="img"
      aria-label={`Dois títulos, ${first.movie.title} e ${second.movie.title}, entram no DUET e saem como uma única sugestão: ${result.title}.`}
    >
      <div className="flow__group">
        <PosterImage movie={first.movie} sizes="78px" />
        <span className="flow__plus">+</span>
        <PosterImage movie={second.movie} sizes="78px" />
      </div>

      <span className="flow__arrow" />

      <div className="flow__core">
        <VennMark />
        <span>DUET</span>
      </div>

      <span className="flow__arrow" />

      <PosterImage movie={result} sizes="78px" />
    </div>
  )
}