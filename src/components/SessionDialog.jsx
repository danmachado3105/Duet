import { useEffect, useId, useRef, useState } from 'react'
import Button from './Button.jsx'

function CreateView({ titleId, onClose, onSwitch }) {
  return (
    <>
      <h2 id={titleId} className="dialog__title">
        Criar uma sessão
      </h2>
      <p className="dialog__text">
        Em breve, cada sessão terá um código para você compartilhar com a outra pessoa. Esta é uma
        prévia da tela.
      </p>
      <div className="code">
        <span className="code__label">Código de exemplo</span>
        <strong>K7P-2X</strong>
      </div>
      <p className="dialog__note">A criação de sessões ainda está em desenvolvimento.</p>
      <div className="dialog__actions">
        <Button size="lg" onClick={onClose}>
          Entendi
        </Button>
        <button type="button" className="linklike" onClick={() => onSwitch('join')}>
          Já tenho um código
        </button>
      </div>
    </>
  )
}

function JoinView({ titleId, onSwitch }) {
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
        {submitted ? 'Entrar em sessões ainda está em desenvolvimento. Esta é uma prévia da tela.' : ''}
      </p>
      <button type="button" className="linklike" onClick={() => onSwitch('create')}>
        Quero criar uma sessão
      </button>
    </>
  )
}

export default function SessionDialog({ open, mode, onClose, onSwitch }) {
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
          {mode === 'create' ? (
            <CreateView titleId={titleId} onClose={onClose} onSwitch={onSwitch} />
          ) : (
            <JoinView titleId={titleId} onSwitch={onSwitch} />
          )}
        </div>
      )}
    </dialog>
  )
}