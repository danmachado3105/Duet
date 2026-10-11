import { useId } from 'react'
import { SORT_OPTIONS } from '../utils/catalog.js'

export default function ResultsBar({ count, sort, onSortChange, hasFilters, onClear }) {
  const selectId = useId()

  return (
    <div className="results">
      <p className="results__count">
        {count} {count === 1 ? 'título' : 'títulos'}
      </p>

      <div className="results__tools">
        {hasFilters && (
          <button type="button" className="linklike" onClick={onClear}>
            Limpar filtros
          </button>
        )}
        <div className="select">
          <label htmlFor={selectId}>Ordenar por</label>
          <select id={selectId} value={sort} onChange={(event) => onSortChange(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}