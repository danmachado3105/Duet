import { useId } from 'react'
import { CloseIcon, SearchIcon } from './Icons.jsx'

export default function MovieSearch({ value, onChange }) {
  const id = useId()

  return (
    <div className="search">
      <label htmlFor={id} className="sr-only">
        Buscar filme ou série
      </label>
      <span className="search__icon">
        <SearchIcon />
      </span>
      <input
        id={id}
        type="search"
        value={value}
        placeholder="Buscar filme ou série..."
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button
          type="button"
          className="search__clear"
          aria-label="Limpar busca"
          onClick={() => onChange('')}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}