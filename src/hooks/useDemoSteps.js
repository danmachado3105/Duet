import { useCallback, useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'

export const STEP_ONE_MS = 2800
export const ANALYZE_MS = 1700
export const FOUND_MS = 1500
export const TOTAL_MS = STEP_ONE_MS + ANALYZE_MS + FOUND_MS

// Etapas: 1 escolhas · 2 análise (analisando → encontrou) · 3 resultado
export function useDemoSteps() {
  const reduced = usePrefersReducedMotion()
  const [step, setStep] = useState(1)
  const [found, setFound] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    const timers = []
    const later = (fn, ms) => timers.push(setTimeout(fn, ms))

    if (step === 1) {
      setFound(false)
      if (playing) later(() => setStep(2), STEP_ONE_MS)
    } else if (step === 2) {
      setFound(false)
      later(() => setFound(true), ANALYZE_MS)
      if (playing) later(() => setStep(3), ANALYZE_MS + FOUND_MS)
    } else {
      setFound(true)
      setPlaying(false)
    }

    return () => timers.forEach(clearTimeout)
  }, [step, playing, runId])

  const play = useCallback(() => {
    setStep(1)
    setPlaying(true)
    setRunId((value) => value + 1)
  }, [])

  const goTo = useCallback((next) => {
    setPlaying(false)
    setStep(next)
  }, [])

  // Toca uma vez ao carregar (exceto com "reduzir movimento")
  useEffect(() => {
    if (reduced) return
    const timer = setTimeout(play, 1200)
    return () => clearTimeout(timer)
  }, [reduced, play])

  return { step, found, playing, runId, play, goTo }
}