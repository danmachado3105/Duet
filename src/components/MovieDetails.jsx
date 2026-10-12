import { useEffect, useId, useRef } from 'react'
import Button from './Button.jsx'
import PosterImage from './PosterImage.jsx'
import { CheckIcon, CloseIcon, StarIcon } from './Icons.jsx'
import { catalogMeta } from '../data/catalog.js'
import { backdropUrl } from '../services/tmdb.js'
import { formatCertification, formatMinutes } from '../utils/catalog.js'
import { useBackdropClose } from '../hooks/useBackdropClose.js'
import { useTitleDetails } from '../hooks/useTitleDetails.js'

// Painel de detalhes: janela central no desktop, "bottom sheet" no celular.
// Usa o <dialog> nativo (Esc, foco preso no painel e backdrop já vêm prontos).
export default function MovieDetails({ movie, selected, onClose, onChoose }) {
  const ref = useRef(null)
  const titleId = useId()
  const backdrop = useBackdropClose(onClose)
  const { item, status, retry } = useTitleDetails(movie)

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

  const facts = []
  let backdropSrc = null

  if (item) {
    backdropSrc = backdropUrl(item.backdropPath)

    if (item.type === 'Série') {
      if (item.seasons) facts.push(['Temporadas', String(item.seasons)])
      if (item.episodes) facts.push(['Episódios', String(item.episodes)])
      if (item.episodeRuntime) facts.push(['Duração do episódio', formatMinutes(item.episodeRuntime)])
    } else if (item.duration) {
      facts.push(['Duração', formatMinutes(item.duration)])
    }

    const certification = formatCertification(item.certification)
    if (certification) facts.push(['Classificação', certification])
    if (item.language) facts.push(['Idioma original', item.language])
  }

  return (
    <dialog
      ref={ref}
      className="dialog details"
      aria-labelledby={titleId}
      onClose={onClose}
      {...backdrop}
    >
      {item && (
        <div className="details__panel">
          {backdropSrc && (
            <div className="details__backdrop" aria-hidden="true">
              <img
                src={backdropSrc}
                alt=""
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}

          <button type="button" className="dialog__close" aria-label="Fechar" onClick={onClose}>
            <CloseIcon size={20} />
          </button>

          <div className="details__poster">
            <PosterImage movie={item} sizes="200px" eager />
          </div>

          <div className="details__body">
            <span className="eyebrow">
              {item.type}
              {item.year ? ` · ${item.year}` : ''}
            </span>
            <h2 id={titleId} className="details__title">
              {item.title}
            </h2>

            {item.rating != null && (
              <p className="details__meta">
                <span>
                  <StarIcon />
                  <span className="sr-only">Nota </span>
                  {item.rating.toFixed(1)}
                </span>
              </p>
            )}

            {item.genres.length > 0 && (
              <ul className="chips">
                {item.genres.map((name) => (
                  <li key={name} className="chip">
                    {name}
                  </li>
                ))}
              </ul>
            )}

            {facts.length > 0 && (
              <dl className="facts">
                {facts.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {status === 'loading' && facts.length === 0 && (
              <p className="details__loading" role="status">
                Carregando detalhes...
              </p>
            )}

            {status === 'error' && (
              <p className="details__note" role="alert">
                Não foi possível carregar todos os detalhes.{' '}
                <button type="button" className="linklike" onClick={retry}>
                  Tentar novamente
                </button>
              </p>
            )}

            <p className="details__desc">{item.synopsis ?? 'Sinopse indisponível em português.'}</p>
            {item.synopsis && item.synopsisLanguage === 'en' && (
              <p className="details__note">Sinopse em inglês: ainda não há tradução.</p>
            )}

            {item.keywords?.length > 0 && (
              <p className="details__themes">Temas: {item.keywords.join(', ')}</p>
            )}

            <div className="details__actions">
              {selected ? (
                <Button size="lg" onClick={onClose}>
                  <CheckIcon /> Escolhido
                </Button>
              ) : (
                <>
                  <Button size="lg" arrow onClick={() => onChoose(item)}>
                    Escolher este
                  </Button>
                  <Button variant="ghost" size="lg" onClick={onClose}>
                    Voltar ao catálogo
                  </Button>
                </>
              )}
            </div>

            {item.source === 'demo' && <p className="details__demo">{catalogMeta.note}</p>}
          </div>
        </div>
      )}
    </dialog>
  )
}