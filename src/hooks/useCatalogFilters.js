import { useMemo, useState } from 'react'
import { filterCatalog, topGenres } from '../utils/catalog.js'

// Ponto de troca futuro: quando o catálogo vier da API, o `catalog` passado aqui
// pode vir de um hook de busca, sem mudar nenhum componente de interface.
export function useCatalogFilters(catalog) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all') // 'all' | 'movie' | 'series'
  const [genre, setGenre] = useState(null)

  const results = useMemo(
    () => filterCatalog(catalog, { query, type, genre }),
    [catalog, query, type, genre],
  )
  const genres = useMemo(() => topGenres(catalog, 8), [catalog])
  const hasFilters = query.trim() !== '' || type !== 'all' || genre !== null

  const clear = () => {
    setQuery('')
    setType('all')
    setGenre(null)
  }

  return { query, setQuery, type, setType, genre, setGenre, genres, results, hasFilters, clear }
}