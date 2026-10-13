import { fetchTitles } from './tmdb.js'
import { buildShowcase } from '../utils/showcase.js'

// Reaproveita fetchTitles: as mesmas listas (e o mesmo cache de 10 min) que o catálogo usa.
// São só listas populares de filmes, séries e animações; nada além disso é pedido à API.
export async function loadShowcase() {
  const [movies, series, animation] = await Promise.all([
    fetchTitles({ type: 'movie' }),
    fetchTitles({ type: 'series' }),
    fetchTitles({ type: 'animation' }),
  ])

  return buildShowcase({
    movies: movies.items,
    series: series.items,
    animation: animation.items,
  })
}