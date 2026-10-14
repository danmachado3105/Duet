// Monta a "vitrine" da landing a partir de listas de títulos (da TMDB ou de demonstração).
// A pontuação é ILUSTRATIVA: serve só para a demonstração visual. O algoritmo real vem depois.

export const SCAN = [
  { label: 'Gêneros', width: '92%' },
  { label: 'Época', width: '68%' },
  { label: 'Avaliação', width: '84%' },
]

const ANIMATION_GENRE_ID = 16
const PEOPLE = [
  { name: 'Marina', tone: 'coral' },
  { name: 'Caio', tone: 'sand' },
]

export const isAnimated = (title) =>
  Boolean(title.genreIds?.includes(ANIMATION_GENRE_ID)) || title.genres.includes('Animação')

const overlap = (a, b) => a.genres.filter((genre) => b.genres.includes(genre)).length

function illustrativeScore(title, first, second) {
  const union = new Set([...first.genres, ...second.genres])
  const hits = title.genres.filter((genre) => union.has(genre)).length
  const both = overlap(title, first) > 0 && overlap(title, second) > 0
  return Math.min(96, 72 + hits * 7 + (both ? 5 : 0))
}

export function buildShowcase(
  { movies, series, animation },
  { requirePoster = true, source = 'tmdb' } = {},
) {
  const usable = (title) => !requirePoster || Boolean(title.posterPath)
  const pool = movies.filter((t) => usable(t) && t.genres.length > 0 && !isAnimated(t))
  if (pool.length < 6) throw new Error('Títulos insuficientes para a vitrine.')

  // Duas escolhas com gostos diferentes; o resultado é quem mais combina com as duas
  const first = pool[0]
  const second = pool.slice(1).sort((a, b) => overlap(a, first) - overlap(b, first))[0]
  const candidates = pool
    .filter((t) => t !== first && t !== second)
    .map((movie) => ({ movie, score: illustrativeScore(movie, first, second) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const best = candidates[0].movie
  const union = new Set([...first.genres, ...second.genres])
  const shared = best.genres.filter((genre) => union.has(genre))
  const reasons = (shared.length ? shared : best.genres).slice(0, 3)

  // Os pôsteres das categorias não repetem os da demonstração
  const used = new Set([first.id, second.id, ...candidates.map((c) => c.movie.id)])
  const take = (list, count) => {
    const picked = []
    for (const title of list) {
      if (picked.length === count) break
      if (!usable(title) || used.has(title.id)) continue
      used.add(title.id)
      picked.push(title)
    }
    return picked
  }

  return {
    source,
    pair: PEOPLE.map((person, index) => ({ ...person, movie: index === 0 ? first : second })),
    result: { movie: best, score: candidates[0].score, reasons },
    recommendations: candidates.map(({ movie, score }) => ({
      movie,
      score,
      note: movie.genres.slice(0, 2).join(' · '),
    })),
    scan: SCAN,
    categories: {
      movie: take(movies.filter((t) => !isAnimated(t)), 3),
      series: take(series.filter((t) => !isAnimated(t)), 3),
      animation: take(animation, 3),
    },
  }
}