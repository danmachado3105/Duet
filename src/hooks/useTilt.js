import { useEffect, useRef } from 'react'

// Inclina levemente o elemento conforme o mouse. Só ativa com mouse e sem reduced-motion.
export function useTilt(max = 4) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const canTilt = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    ).matches
    if (!canTilt) return

    let frame = 0

    const onMove = (event) => {
      const rect = el.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--tilt-x', `${(-y * max).toFixed(2)}deg`)
        el.style.setProperty('--tilt-y', `${(x * max).toFixed(2)}deg`)
      })
    }

    const onLeave = () => {
      cancelAnimationFrame(frame)
      el.style.setProperty('--tilt-x', '0deg')
      el.style.setProperty('--tilt-y', '0deg')
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [max])

  return ref
}