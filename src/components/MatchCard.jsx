import { useId } from 'react'
import Poster from './Poster.jsx'
import { PlayIcon } from './Icons.jsx'
import { heroDemo } from '../data/movies.js'
import { useDemoSteps, TOTAL_MS } from '../hooks/useDemoSteps.js'
import { useCountUp } from '../hooks/useCountUp.js'
import { useTilt } from '../hooks/useTilt.js'

const TABS = [
  { n: 1, label: 'As escolhas' },
  { n: 2, label: 'A análise' },
  { n: 3, label: 'O resultado' },
]

export default function MatchCard() {
  const clipId = useId().replace(/:/g, '')
  const { step, found, playing, runId, play, goTo } = useDemoSteps()
  const tiltRef = useTilt(3)
  const { session, picks, scan, result } = heroDemo
  const score = useCountUp(result.score, step === 3)

  let status = 'Dois gostos diferentes.'
  if (step === 2) status = found ? 'Encontramos algo em comum.' : 'Analisando os dois gostos...'
  if (step === 3) status = `O DUET encontrou ${result.movie.title}, ${result.score}% compatível.`

  let playLabel = 'Reproduzir demonstração'
  if (playing) playLabel = 'Reproduzindo...'
  else if (step === 3) playLabel = 'Reproduzir novamente'

  return (
    <div className="demo" ref={tiltRef} role="group" aria-label="Demonstração interativa do DUET">
      <p className="sr-only" aria-live="polite">
        {status}
      </p>

      <div className="demo__bar">
        <span className="demo__session">
          <span className="demo__dot" aria-hidden="true" />
          Sessão <strong>{session}</strong>
        </span>
        <span className="demo__people" aria-hidden="true">
          {picks.map((person) => (
            <span key={person.name} className="avatar" data-tone={person.tone}>
              {person.name[0]}
            </span>
          ))}
        </span>
      </div>

      <div className="demo__stage">
        {/* Etapa 1: as escolhas */}
        <div className="panel" data-active={step === 1}>
          <ul className="demo__picks">
            {picks.map((person, i) => (
              <li key={person.name} className="pick" style={{ '--i': i }}>
                <div className="pick__text">
                  <span className="pick__label">
                    <span className="dot" data-tone={person.tone} aria-hidden="true" />
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
          <p className="panel__note">
            <span className="apart" aria-hidden="true">
              <i />
              <i />
            </span>
            Dois gostos diferentes.
          </p>
        </div>

        {/* Etapa 2: a análise */}
        <div className="panel" data-active={step === 2} data-found={found}>
          <div className="analysis">
            <svg className="av" viewBox="0 0 120 70" aria-hidden="true">
              <defs>
                <clipPath id={clipId}>
                  <circle cx="50" cy="35" r="28" />
                </clipPath>
              </defs>
              <g clipPath={`url(#${clipId})`}>
                <circle className="av__lens" cx="70" cy="35" r="28" />
              </g>
              <circle className="av__a" cx="50" cy="35" r="28" />
              <circle className="av__b" cx="70" cy="35" r="28" />
            </svg>

            <p className="analysis__status" data-found={found} aria-hidden="true">
              <span key={found ? 'found' : 'analyzing'} className="swap">
                {found ? 'Encontramos algo em comum.' : 'Analisando os dois gostos'}
                {!found && (
                  <span className="dots">
                    <i />
                    <i />
                    <i />
                  </span>
                )}
              </span>
            </p>

            <ul className="scan" aria-hidden="true">
              {scan.map((item, i) => (
                <li key={item.label} style={{ '--i': i, '--w': item.width }}>
                  <span>{item.label}</span>
                  <span className="scan__bar">
                    <i />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Etapa 3: o resultado */}
        <div className="panel" data-active={step === 3}>
          <div className="result">
            <Poster movie={result.movie} size="md" className="result__poster" />
            <div className="result__body">
              <span className="result__label" style={{ '--i': 0 }}>
                O DUET encontrou
              </span>
              <h3 className="result__title" style={{ '--i': 1 }}>
                {result.movie.title}
              </h3>
              <p className="result__score" style={{ '--i': 2 }} aria-hidden="true">
                <span className="result__number">{score}</span>
                <span className="result__unit">% compatível</span>
              </p>
              <div className="meter" style={{ '--i': 3 }} aria-hidden="true">
                <span className="meter__fill" style={{ width: `${score}%` }} />
              </div>
              <ul className="tags" style={{ '--i': 4 }}>
                {result.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="progress" aria-hidden="true">
        {playing && <i key={runId} style={{ animationDuration: `${TOTAL_MS}ms` }} />}
      </div>

      <div className="demo__foot">
        <div className="tabs" role="group" aria-label="Etapas da demonstração">
          {TABS.map((tab) => (
            <button
              key={tab.n}
              type="button"
              className="tab"
              aria-current={step === tab.n ? 'step' : undefined}
              aria-label={`Etapa ${tab.n}: ${tab.label}`}
              onClick={() => goTo(tab.n)}
            >
              <span className="tab__n">{tab.n}</span>
              <span className="tab__label">{tab.label}</span>
            </button>
          ))}
        </div>

        <button type="button" className="demo__play" onClick={play} disabled={playing}>
          <PlayIcon />
          {playLabel}
        </button>
      </div>
    </div>
  )
}