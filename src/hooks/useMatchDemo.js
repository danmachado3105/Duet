import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'

// Estágios: 0 vazio · 1 primeira escolha · 2 as duas escolhas + cruzando · 3 resultado
const FINAL_STAGE = 3
const STAGE_DELAYS = [500, 1400, 3000] // ms em que os estágios 1, 2 e 3 começam
const HOLD = 5500 // tempo parado no resultado antes do próximo exemplo

export function useMatchDemo(total) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [stage, setStage] = useState(reduced ? FINAL_STAGE : 0)
  const [auto, setAuto] = useState(true)
  const [run, setRun] = useState(0)

  // Linha do tempo de um exemplo
  useEffect(() => {
    if (reduced) {
      setStage(FINAL_STAGE)
      return
    }
    setStage(0)
    const timers = STAGE_DELAYS.map((delay, i) => setTimeout(() => setStage(i + 1), delay))
    return () => timers.forEach(clearTimeout)
  }, [index, run, reduced])

  // Avança para o próximo exemplo enquanto o autoplay estiver ligado
  useEffect(() => {
    if (reduced || !auto || stage !== FINAL_STAGE) return
    const timer = setTimeout(() => setIndex((current) => (current + 1) % total), HOLD)
    return () => clearTimeout(timer)
  }, [reduced, auto, stage, total])

  const select = (nextIndex) => {
    setAuto(false)
    setIndex(nextIndex)
    setRun((value) => value + 1)
  }

  const toggleAuto = () => setAuto((value) => !value)

  return { index, stage, auto, select, toggleAuto }
}