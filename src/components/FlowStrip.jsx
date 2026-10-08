import Poster from './Poster.jsx'
import VennMark from './VennMark.jsx'
import { movies } from '../data/movies.js'

export default function FlowStrip() {
  return (
    <div
      className="flow"
      role="img"
      aria-label="Dois filmes, Interstellar e Corra!, entram no DUET e saem como uma única recomendação: A Origem."
    >
      <div className="flow__group">
        <Poster movie={movies.interstellar} size="sm" />
        <span className="flow__plus">+</span>
        <Poster movie={movies.corra} size="sm" />
      </div>

      <span className="flow__arrow" />

      <div className="flow__core">
        <VennMark />
        <span>DUET</span>
      </div>

      <span className="flow__arrow" />

      <Poster movie={movies.origem} size="sm" />
    </div>
  )
}