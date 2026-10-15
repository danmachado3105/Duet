import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { catalog as demoCatalog } from '../data/catalog.js'
import { fetchTitles, getGenres, getWatchProviderOptions } from '../services/tmdb.js'
import { DEFAULT_SORT, listGenres, queryCatalog, sortTitles } from '../utils/catalog.js'
import { buildGenreOptions } from '../utils/genres.js'
import { useDebouncedValue } from './useDebouncedValue.js'

// Catálogo de demonstração: só entra se o usuário escolher (por exemplo, sem chave da TMDB)
const DEMO_TITLES = demoCatalog.map((item) => ({ ...item, source: 'demo' }))
const DEMO_GENRES = listGenres(DEMO_TITLES).map((name) => ({ name, ids: {} }))

const initialState = {
  status: 'loading', // 'loading' | 'success' | 'error'
  items: [],
  page: 0,
  hasMore: false,
  error: null,
  moreStatus: 'idle', // 'idle' | 'loading' | 'error'
}

function mergeUnique(current, incoming) {
  const seen = new Set(current.map((item) => item.id))
  return [...current, ...incoming.filter((item) => !seen.has(item.id))]
}

function reducer(state, action) {
  switch (action.type) {
    case 'start':
      return initialState
    case 'success':
      return {
        ...initialState,
        status: 'success',
        items: action.result.items,
        page: 1,
        hasMore: action.result.hasMore,
      }
    case 'error':
      return { ...initialState, status: 'error', error: action.error }
    case 'more-start':
      return { ...state, moreStatus: 'loading' }
    case 'more-success':
      return {
        ...state,
        items: mergeUnique(state.items, action.result.items),
        page: state.page + 1,
        hasMore: action.result.hasMore,
        moreStatus: 'idle',
      }
    case 'more-error':
      return { ...state, moreStatus: 'error' }
    default:
      return state
  }
}

// initialType: 'movie' | 'series' | 'animation' (vem da categoria escolhida na landing)
export function useCatalog({ initialType, initialProviderIds = [] } = {}) {
  const [source, setSource] = useState('tmdb') // 'tmdb' | 'demo'
  const [query, setQuery] = useState('')
  const [type, setTypeState] = useState(initialType ?? 'all') // 'all' | 'movie' | 'series' | 'animation'
  const [genreNames, setGenreNames] = useState([])
  const [providerIds, setProviderIds] = useState(initialProviderIds)
  const [sort, setSort] = useState(DEFAULT_SORT)
  const [genres, setGenres] = useState(null)
  const [genreStatus, setGenreStatus] = useState('loading')
  const [providerOptions, setProviderOptions] = useState([])
  const [providerStatus, setProviderStatus] = useState('loading')
  const [providerReloadKey, setProviderReloadKey] = useState(0)
  const [reloadKey, setReloadKey] = useState(0)
  const [state, dispatch] = useReducer(reducer, initialState)
  const requestId = useRef(0)

  const isDemo = source === 'demo'
  const searchTerm = useDebouncedValue(query.trim(), 400)

  // Gêneros (uma vez; a camada de serviço guarda em cache)
  useEffect(() => {
    if (isDemo) return
    let active = true
    getGenres()
      .then((data) => {
        if (active) {
          setGenres(data)
          setGenreStatus('success')
        }
      })
      .catch(() => {
        if (active) {
          setGenres(null)
          setGenreStatus('error')
        }
      })
    return () => {
      active = false
    }
  }, [isDemo, reloadKey])

  // A lista de provedores vem do catálogo agregado da TMDB, não de consultas por título.
  useEffect(() => {
    if (isDemo) return undefined

    let active = true
    getWatchProviderOptions()
      .then((options) => {
        if (active) {
          setProviderOptions(options)
          setProviderStatus('success')
        }
      })
      .catch(() => {
        if (active) setProviderStatus('error')
      })
    return () => {
      active = false
    }
  }, [isDemo, providerReloadKey])

  const genreOptions = useMemo(() => {
    if (!isDemo) return buildGenreOptions(genres, type)
    return type === 'animation'
      ? DEMO_GENRES.filter((option) => option.name !== 'Animação')
      : DEMO_GENRES
  }, [isDemo, genres, type])

  const selectedGenres = useMemo(
    () => genreOptions.filter((option) => genreNames.includes(option.name)),
    [genreOptions, genreNames],
  )

  const setType = useCallback(
    (next) => {
      setTypeState(next)
      const options = isDemo
        ? next === 'animation'
          ? DEMO_GENRES.filter((option) => option.name !== 'Animação')
          : DEMO_GENRES
        : buildGenreOptions(genres, next)
      setGenreNames((current) => current.filter((name) => options.some((option) => option.name === name)))
    },
    [genres, isDemo],
  )

  // Busca na TMDB. A resposta só vale se ainda for a requisição mais recente.
  const load = useCallback(
    async (page) => {
      const id = ++requestId.current
      const first = page === 1
      dispatch({ type: first ? 'start' : 'more-start' })
      try {
        const result = await fetchTitles({
          query: searchTerm,
          type,
          genre: selectedGenres,
          providers: providerIds,
          sort,
          page,
        })
        if (id === requestId.current) {
          dispatch({ type: first ? 'success' : 'more-success', result })
        }
      } catch (error) {
        if (id === requestId.current) {
          dispatch({ type: first ? 'error' : 'more-error', error })
        }
      }
    },
    [searchTerm, type, selectedGenres, providerIds, sort],
  )

  useEffect(() => {
    if (isDemo) return
    load(1)
  }, [isDemo, load, reloadKey])

  const loadMore = useCallback(() => {
    if (!state.hasMore || state.moreStatus === 'loading') return
    load(state.page + 1)
  }, [state.hasMore, state.moreStatus, state.page, load])

  const retry = useCallback(() => setReloadKey((key) => key + 1), [])

  const items = useMemo(() => {
    if (isDemo) return queryCatalog(DEMO_TITLES, { query, type, genre: genreNames, sort })
    // Na busca a TMDB não ordena: ordenamos tudo o que já foi carregado
    return searchTerm && sort !== DEFAULT_SORT ? sortTitles(state.items, sort) : state.items
  }, [isDemo, query, type, genreNames, sort, searchTerm, state.items])

  const hasFilters =
    query.trim() !== '' || type !== 'all' || genreNames.length > 0 || providerIds.length > 0

  const clear = useCallback(() => {
    setQuery('')
    setTypeState('all')
    setGenreNames([])
    setProviderIds([])
  }, [])

  const toggleGenre = useCallback((name) => {
    setGenreNames((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    )
  }, [])

  const switchSource = useCallback((nextSource) => {
    setSource(nextSource)
    if (nextSource === 'demo') {
      setProviderIds([])
    } else {
      setProviderStatus('loading')
    }
  }, [])

  const retryProviders = useCallback(() => {
    setProviderStatus('loading')
    setProviderReloadKey((key) => key + 1)
  }, [])

  const selectedProviderNames = providerIds.map(
    (id) => providerOptions.find((provider) => provider.id === id)?.name ?? null,
  )
  const activeFilterCount =
    Number(query.trim() !== '') +
    Number(type !== 'all') +
    genreNames.length +
    providerIds.length

  return {
    source,
    switchSource,
    query,
    setQuery,
    type,
    setType,
    genres: genreNames,
    toggleGenre,
    genreOptions,
    genreStatus,
    providerIds,
    setProviderIds,
    providerOptions,
    providerStatus: isDemo ? 'idle' : providerStatus,
    retryProviders,
    activeFilterCount,
    selectedProviderNames,
    sort,
    setSort,
    status: isDemo ? 'success' : state.status,
    error: state.error,
    items,
    hasMore: isDemo ? false : state.hasMore,
    loadingMore: state.moreStatus === 'loading',
    moreError: state.moreStatus === 'error',
    loadMore,
    retry,
    hasFilters,
    clear,
    // Muda quando a categoria, o gênero ou a ordenação mudam: reinicia a animação de entrada da grade
    viewKey: `${source}|${type}|${genreNames.join(',')}|${providerIds.join(',')}|${sort}`,
  }
}