import { CheckIcon } from './Icons.jsx'
import { FLOW_STEPS } from '../utils/sessionFlow.js'

export default function SessionProgress({ current }) {
  if (current < 0) return null

  return (
    <nav className="session__progress" aria-label="Progresso da sessão">
      <ol className="flowsteps">
        {FLOW_STEPS.map((step, i) => {
          const state = i < current ? 'done' : i === current ? 'current' : 'todo'
          return (
            <li
              key={step.id}
              data-state={state}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              <span className="flowsteps__n">
                {state === 'done' ? <CheckIcon size={12} /> : i + 1}
              </span>
              <span>{step.label}</span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}