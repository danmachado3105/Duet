import VennMark from './VennMark.jsx'

export default function Logo({ href = '#top', label = 'DUET, início' }) {
  return (
    <a href={href} className="logo" aria-label={label}>
      <VennMark className="logo__mark" />
      <span className="logo__word">DUET</span>
    </a>
  )
}