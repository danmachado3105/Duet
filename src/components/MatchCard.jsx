import Poster from './Poster.jsx'
import { scenarios } from '../data/movies.js'
import { useMatchDemo } from '../hooks/useMatchDemo.js'
import { useCountUp } from '../hooks/useCountUp.js'
import { useTilt } from '../hooks/useTilt.js'

export default function MatchCard() {
  const { index, stage, auto, select, toggleAuto } = useMatchDemo(scenarios.length)
  const tiltRef = useTilt(4)

  const { picks, result } = scenarios[index]
  const score = useCountUp(result.score, stage >= 3)

  const statusByStage = [
    'Aguardando as escolhas',
    `Aguardando ${picks[1].name}`,
    'Cruzando os gostos',
    'Em comum',
  ]

  return (
    <div className="match" ref={tiltRef} role="group" aria-label="Demonstração do DUET">
      <div className="match__bar">
        <span className="match__session">
          <span className="match__dot" aria-hidden="true" />
          Sessão <strong>K7P-2X</strong>
        </span>
        <span className="match__people" aria-hidden="true">
          {picks.map((person) => (
            <span key={person.name} className="avatar" data-tone={person.tone}>
              {person.name[0]}
            </span>
          ))}
        </span>
      </div>

      <ul className="match__picks">
        {picks.map((person, i) => (
          <li key={person.name} className="pick" data-shown={stage > i}>
            <div className="pick__text">
              <span className="pick__label">
                <span className="pick__dot" data-tone={person.tone} aria-hidden="true" />
                {person.name} escolheu
              </span>
              <strong className="pick__title">{person.movie.title}</strong>
              <span className="pick__meta">
                {person.movie.genre} · {person.movie.year}
              </span>
            </div>
            <Poster movie={person.movie} size="mini" />
          </li>
        ))}
      </ul>

      <div className="match__bridge" data-stage={stage}>
        <span className="match__bridge-line" aria-hidden="true" />
        <span className="match__status">
          {statusByStage[stage]}
          {stage === 2 && (
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          )}
        </span>
        <span className="match__bridge-line" aria-hidden="true" />
      </div>

      <div className="result" data-shown={stage >= 3} aria-hidden={stage < 3}>
        <Poster movie={result.movie} size="md" className="result__poster" />
        <div className="result__body">
          <span className="result__label">O DUET encontrou</span>
          <h3 className="result__title">{result.movie.title}</h3>
          <p className="result__score">
            <span className="result__number">{score}</span>
            <span className="result__unit">% compatível</span>
          </p>
          <div className="meter" aria-hidden="true">
            <span className="meter__fill" style={{ width: `${score}%` }} />
          </div>
          <ul className="tags">
            {result.shared.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="match__foot">
        <div className="match__tabs" role="group" aria-label="Exemplos da demonstração">
          {scenarios.map((scenario, i) => (
            <button
              key={scenario.id}
              type="button"
              className="tab"
              aria-pressed={i === index}
              aria-label={`Ver exemplo ${i + 1}: ${scenario.picks[0].movie.title} e ${scenario.picks[1].movie.title}`}
              onClick={() => select(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button type="button" className="match__pause" onClick={toggleAuto}>
          {auto ? 'Pausar demonstração' : 'Reproduzir demonstração'}
        </button>
      </div>
    </div>
  )
}