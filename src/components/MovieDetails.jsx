import { useEffect, useId, useRef } from 'react'
import Button from './Button.jsx'
import Poster from './Poster.jsx'
import { CheckIcon, CloseIcon, StarIcon } from './Icons.jsx'
import { formatDuration } from '../utils/catalog.js'

// Painel de detalhes: janela central no desktop, "bottom sheet" no celular.
// Usa o <dialog> nativo (Esc, foco preso e backdrop já vêm prontos).
export default function MovieDetails({ movie, selected, onClose, onChoose }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (movie && !dialog.open) dialog.showModal()
    if (!movie && dialog.open) dialog.close()
  }, [movie])

  useEffect(() => {
    if (!movie) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [movie])

  return (
    <dialog
      ref={ref}
      className="dialog details"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {movie && (
        <div className="details__panel">
          <button type="button" className="dialog__close" aria-label="Fechar" onClick={onClose}>
            <CloseIcon size={20} />
          </button>

          <div className="details__poster">
            <Poster movie={movie} size="md" />
          </div>

          <div className="details__body">
            <span className="eyebrow">
              {movie.type} · {movie.year}
            </span>
            <h2 id={titleId} className="details__title">
              {movie.title}
            </h2>

            <p className="details__meta">
              <span>
                <StarIcon />
                {movie.rating.toFixed(1)}
              </span>
              <span>{formatDuration(movie)}</span>
            </p>

            <ul className="chips">
              {movie.genres.map((name) => (
                <li key={name} className="chip">
                  {name}
                </li>
              ))}
            </ul>

            <p className="details__desc">{movie.description}</p>

            <div className="details__actions">
              {selected ? (
                <Button size="lg" onClick={onClose}>
                  <CheckIcon /> Escolhido
                </Button>
              ) : (
                <>
                  <Button size="lg" arrow onClick={() => onChoose(movie)}>
                    Escolher este
                  </Button>
                  <Button variant="ghost" size="lg" onClick={onClose}>
                    Voltar ao catálogo
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}