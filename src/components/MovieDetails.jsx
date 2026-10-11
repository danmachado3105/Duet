import { useEffect, useId, useRef } from 'react'
import Button from './Button.jsx'
import Poster from './Poster.jsx'
import { CheckIcon, CloseIcon, StarIcon } from './Icons.jsx'
import { catalogMeta } from '../data/catalog.js'
import { formatCertification, formatMinutes } from '../utils/catalog.js'
import { useBackdropClose } from '../hooks/useBackdropClose.js'

// Painel de detalhes: janela central no desktop, "bottom sheet" no celular.
// Usa o <dialog> nativo (Esc, foco preso no painel e backdrop já vêm prontos).
export default function MovieDetails({ movie, selected, onClose, onChoose }) {
  const ref = useRef(null)
  const titleId = useId()
  const backdrop = useBackdropClose(onClose)

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

  const isSeries = movie?.type === 'Série'
  const certification = movie ? formatCertification(movie.certification) : null
  const runtime = movie
    ? isSeries
      ? movie.seasons
        ? String(movie.seasons)
        : null
      : formatMinutes(movie.duration)
    : null

  return (
    <dialog
      ref={ref}
      className="dialog details"
      aria-labelledby={titleId}
      onClose={onClose}
      {...backdrop}
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
                <span className="sr-only">Nota </span>
                {movie.rating.toFixed(1)}
              </span>
            </p>

            <ul className="chips">
              {movie.genres.map((name) => (
                <li key={name} className="chip">
                  {name}
                </li>
              ))}
            </ul>

            <dl className="facts">
              {runtime && (
                <div>
                  <dt>{isSeries ? 'Temporadas' : 'Duração'}</dt>
                  <dd>{runtime}</dd>
                </div>
              )}
              {certification && (
                <div>
                  <dt>Classificação</dt>
                  <dd>{certification}</dd>
                </div>
              )}
              {movie.language && (
                <div>
                  <dt>Idioma original</dt>
                  <dd>{movie.language}</dd>
                </div>
              )}
            </dl>

            <p className="details__desc">{movie.synopsis}</p>

            {movie.keywords.length > 0 && (
              <p className="details__themes">Temas: {movie.keywords.join(', ')}</p>
            )}

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

            {!catalogMeta.officialData && <p className="details__demo">{catalogMeta.note}</p>}
          </div>
        </div>
      )}
    </dialog>
  )
}