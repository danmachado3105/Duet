import { useRef } from 'react'

// Fecha o <dialog> só quando o clique COMEÇA e TERMINA no fundo.
// Evita fechar ao arrastar o mouse de dentro do painel para fora (selecionar texto, por exemplo).
export function useBackdropClose(onClose) {
  const pressedBackdrop = useRef(false)

  return {
    onPointerDown: (event) => {
      pressedBackdrop.current = event.target === event.currentTarget
    },
    onClick: (event) => {
      if (pressedBackdrop.current && event.target === event.currentTarget) onClose()
      pressedBackdrop.current = false
    },
  }
}