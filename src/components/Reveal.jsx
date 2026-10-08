import { useInView } from '../hooks/useInView.js'

export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children }) {
  const [ref, visible] = useInView(0.15, '0px 0px -8% 0px')

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}