import { useId } from 'react'

// Símbolo do DUET: dois gostos (círculos) e o que têm em comum (interseção).
export default function VennMark({ className = '', lens = 'var(--accent)' }) {
  const clipId = useId().replace(/:/g, '')

  return (
    <svg className={className} viewBox="0 0 48 32" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipId}>
          <circle cx="18" cy="16" r="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <circle cx="30" cy="16" r="12" fill={lens} />
      </g>
      <circle cx="18" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="30" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}