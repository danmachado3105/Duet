import { Link } from 'react-router-dom'
import VennMark from './VennMark.jsx'

export default function Logo({ href = '#top', to, label = 'DUET, início' }) {
  const content = (
    <>
      <VennMark className="logo__mark" />
      <span className="logo__word">DUET</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className="logo" aria-label={label}>
        {content}
      </Link>
    )
  }

  return (
    <a href={href} className="logo" aria-label={label}>
      {content}
    </a>
  )
}