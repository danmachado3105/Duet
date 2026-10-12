import { useEffect, useState } from 'react'

// Valor vazio passa direto (limpar a busca é imediato). Texto espera o usuário parar de digitar.
export function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    if (value === '') {
      setDebounced('')
      return
    }
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return value === '' ? '' : debounced
}