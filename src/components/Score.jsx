import { useInView } from '../hooks/useInView.js'
import { useCountUp } from '../hooks/useCountUp.js'

export default function Score({ value, label = 'compatível' }) {
  const [ref, inView] = useInView(0.5)
  const number = useCountUp(value, inView, 1200)

  return (
    <p ref={ref} className="score">
      <span className="sr-only">
        {value}% {label}
      </span>
      <span className="score__n" aria-hidden="true">
        {number}
      </span>
      <span className="score__u" aria-hidden="true">
        % {label}
      </span>
    </p>
  )
}