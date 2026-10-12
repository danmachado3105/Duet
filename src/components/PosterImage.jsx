import { useEffect, useRef, useState } from 'react'
import Poster from './Poster.jsx'
import { posterSources } from '../services/tmdb.js'

const DEFAULT_SIZES = '(min-width: 900px) 220px, 46vw'

function PosterFrame({ movie, sizes, eager, className }) {
  const sources = posterSources(movie.posterPath)
  const [status, setStatus] = useState(sources ? 'loading' : 'error')
  const imgRef = useRef(null)

  // Imagem que já estava em cache pode carregar antes do React anexar o onLoad
  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth > 0) setStatus('loaded')
  }, [])

  return (
    <span className={`pimg ${className}`.trim()} data-status={status}>
      {sources && status !== 'error' && (
        <img
          ref={imgRef}
          src={sources.src}
          srcSet={sources.srcSet}
          sizes={sizes}
          alt={`Pôster de ${movie.title}`}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
      {status === 'error' && (
        <>
          {movie.year && <span className="pimg__year">{movie.year}</span>}
          <span className="pimg__title">{movie.title}</span>
        </>
      )}
    </span>
  )
}

// Pôster real da TMDB. Sem imagem (ou com erro), mostra um cartaz com o título.
// Títulos de demonstração (sem posterPath, com "art") usam o pôster em CSS.
export default function PosterImage({ movie, sizes = DEFAULT_SIZES, eager = false, className = '' }) {
  if (!movie.posterPath && movie.art) {
    return <Poster movie={movie} size="md" className={className} />
  }

  return (
    <PosterFrame
      key={movie.posterPath ?? movie.id}
      movie={movie}
      sizes={sizes}
      eager={eager}
      className={className}
    />
  )
}