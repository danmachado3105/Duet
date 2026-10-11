import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button.jsx'
import { ROUTES } from '../utils/sessionFlow.js'

// "Entrar com código" continua mockado: sessões entre dispositivos virão com o backend.
// Criar sessão agora é uma rota real (/sessao/nova).
function JoinView({ titleId, onClose }) {
  const inputId = useId()
  const [code, setCode] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <h2 id={titleId} className="dialog__title">
        Entrar com código
      </h2>
      <p className="dialog__text">
        Digite o código que a outra pessoa compartilhou para entrar na sessão.
      </p>
      <form className="dialog__form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor={inputId}>Código da sessão</label>
          <input
            id={inputId}
            value={code}
            maxLength={6}
            placeholder="K7P-2X"
            autoComplete="off"
            autoFocus
            onChange={(event) => {
              setCode(event.target.value.toUpperCase())
              setSubmitted(false)
            }}
          />
        </div>
        <Button type="submit" size="lg" arrow>
          Entrar
        </Button>
      </form>
      <p className="dialog__note" role="status">
        {submitted
          ? 'Entrar em sessões de outros dispositivos ainda está em desenvolvimento.'
          : ''}
      </p>
      <Link to={ROUTES.newSession} className="linklike" onClick={onClose}>
        Quero começar uma sessão neste dispositivo
      </Link>
    </>
  )
}

export default function SessionDialog({ open, onClose }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {open && (
        <div className="dialog__panel">
          <button type="button" className="dialog__close" aria-label="Fechar" onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
          <JoinView titleId={titleId} onClose={onClose} />
        </div>
      )}
    </dialog>
  )
}