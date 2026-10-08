import Poster from './Poster.jsx'
import { CheckIcon } from './Icons.jsx'
import { sessionMock } from '../data/movies.js'

export default function SessionMock() {
  const { code, people, recommendations } = sessionMock

  return (
    <div className="app" role="group" aria-label="Exemplo ilustrativo de uma sessão do DUET">
      <div className="app__bar">
        <span>
          Sessão <strong>{code}</strong>
        </span>
        <span className="app__live">
          <i aria-hidden="true" />
          Em andamento
        </span>
      </div>

      <div className="app__section">
        <span className="app__tag" aria-hidden="true">
          1
        </span>
        <ul>
          {people.map((person, i) => (
            <li key={person.name} className="person" style={{ '--i': i }}>
              <span className="avatar" data-tone={person.tone} aria-hidden="true">
                {person.name[0]}
              </span>
              <div className="person__name">
                <strong>{person.name}</strong>
                <span>{person.movie.title}</span>
              </div>
              <span className="person__check">
                <CheckIcon />
                escolheu
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="app__cross">
        <span className="app__tag" aria-hidden="true">
          2
        </span>
        <span className="app__line" aria-hidden="true" />
        <span>{recommendations.length} recomendações encontradas</span>
        <span className="app__line" aria-hidden="true" />
      </div>

      <div className="app__section">
        <span className="app__tag" aria-hidden="true">
          3
        </span>
        <ul>
          {recommendations.map((item, i) => (
            <li
              key={item.movie.id}
              className={`rec ${i === 0 ? 'rec--top' : ''}`}
              style={{ '--i': i, '--w': `${item.score}%` }}
            >
              <Poster movie={item.movie} size="mini" />
              <div className="rec__text">
                {i === 0 && <span className="rec__flag">Melhor combinação</span>}
                <strong className="rec__title">{item.movie.title}</strong>
                <span className="rec__note">{item.note}</span>
              </div>
              <b className="rec__score">{item.score}%</b>
              <span className="rec__bar" aria-hidden="true">
                <i />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}