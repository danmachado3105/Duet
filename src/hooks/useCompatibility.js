import { useCallback, useEffect, useState } from 'react'
import { useSession } from '../context/sessionContext.js'
import { computeCompatibility } from '../services/compatibility.js'
import { selectionKey } from '../utils/sessionState.js'

// Guarda só o último resultado: a tela de análise calcula e a de resultado reaproveita.
let cached = { key: null, data: null }

// { status: 'loading' | 'ready' | 'error', data, error, retry }
export function useCompatibility() {
  const { session } = useSession()
  const first = session.person1.selections
  const second = session.person2.selections
  const key = selectionKey(session)

  const [state, setState] = useState(() =>
    cached.key === key && cached.data
      ? { status: 'ready', data: cached.data, error: null }
      : { status: 'loading', data: null, error: null },
  )
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (cached.key === key && cached.data) {
      setState({ status: 'ready', data: cached.data, error: null })
      return
    }

    let active = true
    setState({ status: 'loading', data: null, error: null })

    computeCompatibility(first, second)
      .then((data) => {
        cached = { key, data }
        if (active) setState({ status: 'ready', data, error: null })
      })
      .catch((error) => {
        if (active) setState({ status: 'error', data: null, error })
      })

    return () => {
      active = false
    }
  }, [key, first, second, attempt])

  const retry = useCallback(() => setAttempt((count) => count + 1), [])

  return { ...state, retry }
}