import { KIND_LABEL, KIND_PLURAL } from '../utils/compat.js'

// person: { label, count, kinds, topGenres: [{ name, count }] }
export default function PreferenceCard({ person, tone }) {
  const kindText = ['movie', 'tv', 'animation']
    .filter((kind) => person.kinds[kind] > 0)
    .map((kind) => {
      const total = person.kinds[kind]
      return `${total} ${total === 1 ? KIND_LABEL[kind].toLowerCase() : KIND_PLURAL[kind]}`
    })
    .join(' · ')

  return (
    <li className="pref">
      <span className="pref__who">
        <span className="dot" data-tone={tone} aria-hidden="true" />
        {person.label}
      </span>
      <p className="pref__count">
        {person.count} {person.count === 1 ? 'título' : 'títulos'} · {kindText}
      </p>

      <ul className="pref__genres">
        {person.topGenres.map((genre) => (
          <li key={genre.key}>
            <span>{genre.name}</span>
            <b>
              {genre.count} de {person.count}
            </b>
            <span className="pref__bar" aria-hidden="true">
              <i style={{ width: `${(genre.count / person.count) * 100}%` }} />
            </span>
          </li>
        ))}
      </ul>
    </li>
  )
}