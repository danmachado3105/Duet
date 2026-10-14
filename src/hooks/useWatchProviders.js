import { useCallback, useEffect, useState } from 'react'
import { getWatchProviders } from '../services/tmdb.js'

export function useWatchProviders(movie, enabled = true) {
  const isTmdbTitle = movie?.source === 'tmdb'
  const key = isTmdbTitle ? `${movie.mediaType}:${movie.tmdbId}` : null
  const mediaType = movie?.mediaType
  const tmdbId = movie?.tmdbId
  const [state, setState] = useState({ key: null, status: 'idle', data: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!enabled || !key) return
    let active = true
    getWatchProviders(mediaType, tmdbId)
      .then((data) => {
        if (active) setState({ key, attempt, status: 'success', data })
      })
      .catch((error) => {
        if (active) setState({ key, attempt, status: 'error', data: null, error })
      })
    return () => {
      active = false
    }
  }, [attempt, enabled, key, mediaType, tmdbId])

  const retry = useCallback(() => setAttempt((count) => count + 1), [])

  if (!movie || !enabled) return { status: 'idle', data: null, retry }
  if (!isTmdbTitle) return { status: 'unsupported', data: null, retry }
  if (state.key !== key || state.attempt !== attempt) return { status: 'loading', data: null, retry }
  return { status: state.status, data: state.data, retry, error: state.error }
}
