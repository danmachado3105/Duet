import { useCallback, useEffect, useState } from 'react'
import { getDetails } from '../services/tmdb.js'

function mergeDetails(movie, details) {
  return {
    ...movie,
    duration: details.duration,
    seasons: details.seasons,
    episodes: details.episodes,
    episodeRuntime: details.episodeRuntime,
    language: details.language,
    genres: details.genres.length ? details.genres : movie.genres,
    synopsis: details.synopsis ?? movie.synopsis,
    synopsisLanguage: details.synopsisLanguage,
    backdropPath: details.backdropPath ?? movie.backdropPath,
  }
}

// Busca os detalhes só quando um título é aberto. O título de demonstração já vem completo.
export function useTitleDetails(movie) {
  const key = movie?.source === 'tmdb' ? movie.id : null
  const mediaType = movie?.mediaType
  const tmdbId = movie?.tmdbId

  const [state, setState] = useState({ key: null, status: 'idle', data: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!key) return
    let active = true
    setState({ key, status: 'loading', data: null })
    getDetails(mediaType, tmdbId)
      .then((data) => {
        if (active) setState({ key, status: 'success', data })
      })
      .catch(() => {
        if (active) setState({ key, status: 'error', data: null })
      })
    return () => {
      active = false
    }
  }, [key, mediaType, tmdbId, attempt])

  const retry = useCallback(() => setAttempt((count) => count + 1), [])

  if (!key) return { item: movie, status: 'idle', retry }
  if (state.key !== key) return { item: movie, status: 'loading', retry }
  if (state.status === 'success') {
    return { item: mergeDetails(movie, state.data), status: 'success', retry }
  }
  return { item: movie, status: state.status, retry }
}