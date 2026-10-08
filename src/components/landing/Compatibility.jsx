import Poster from '../ui/Poster.jsx'
import Reveal from '../ui/Reveal.jsx'
import { compatibilityExample } from '../../data/movies.js'

export default function Compatibility() {
  const { picks, result } = compatibilityExample

  return (
    <section className="section compat">
      <div className="container compat__grid">
        <Reveal className="compat__text">
          <span className="eyebrow">O diferencial</span>
          <h2 className="section__title">Feito para dois.</h2>
          <p>
            Vocês escolhem filmes diferentes. O DUET encontra o ponto em comum e mostra o quanto a
            recomendação combina com os dois.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="match">
            <div className="match__inputs">
              <div className="match__pick">
                <span className="match__label">{picks[0].person}</span>
                <Poster {...picks[0].movie} />
              </div>
              <span className="match__plus" aria-hidden="true">
                +
              </span>
              <div className="match__pick">
                <span className="match__label">{picks[1].person}</span>
                <Poster {...picks[1].movie} />
              </div>
            </div>

            <div className="match__connector" aria-hidden="true" />

            <div className="match__result">
              <div className="match__result-poster">
                <Poster {...result.movie} />
              </div>
              <div className="match__info">
                <span className="match__label">Recomendação</span>
                <h3 className="match__title">{result.movie.title}</h3>
                <div
                  className="meter"
                  role="img"
                  aria-label={`${result.score}% compatível`}
                  style={{ '--value': `${result.score}%` }}
                >
                  <span className="meter__fill" />
                </div>
                <p className="match__score">{result.score}% compatível</p>
              </div>
            </div>

            <p className="match__caption">Exemplo ilustrativo</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}