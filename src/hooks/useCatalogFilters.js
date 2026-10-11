import { useMemo, useState } from 'react'
import { DEFAULT_SORT, listGenres, queryCatalog } from '../utils/catalog.js'

// Ponto de troca futuro: quando o catálogo vier da API, o `catalog` recebido aqui
// pode vir de um hook de busca, sem mudar nenhum componente de interface.
export function useCatalogFilters(catalog) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all') // 'all' | 'movie' | 'series'
  const [genre, setGenre] = useState(null)
  const [sort, setSort] = useState(DEFAULT_SORT)

  const results = useMemo(
    () => queryCatalog(catalog, { query, type, genre, sort }),
    [catalog, query, type, genre, sort],
  )
  const genres = useMemo(() => listGenres(catalog), [catalog])

  // A ordenação não conta como filtro: "limpar" não mexe nela
  const hasFilters = query.trim() !== '' || type !== 'all' || genre !== null

  const clear = () => {
    setQuery('')
    setType('all')
    setGenre(null)
  }

  return {
    query,
    setQuery,
    type,
    setType,
    genre,
    setGenre,
    sort,
    setSort,
    genres,
    results,
    hasFilters,
    clear,
  }
}