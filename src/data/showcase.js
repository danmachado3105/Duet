import { catalog } from './catalog.js'
import { SCAN, buildShowcase, isAnimated } from '../utils/showcase.js'

// Vitrine de demonstração: usada sem chave da TMDB ou quando a API falha.
const demo = catalog.map((item) => ({ ...item, source: 'demo' }))

export const fallbackShowcase = buildShowcase(
  {
    movies: demo.filter((item) => item.type === 'Filme'),
    series: demo.filter((item) => item.type === 'Série'),
    animation: demo.filter(isAnimated),
  },
  { requirePoster: false, source: 'demo' },
)

// Enquanto a TMDB responde: o layout fica pronto e os pôsteres aparecem como esqueleto
const placeholder = (key) => ({
  id: `placeholder-${key}`,
  placeholder: true,
  source: 'placeholder',
  title: 'Carregando',
  type: 'Filme',
  year: null,
  genres: [],
  rating: null,
  posterPath: null,
})

const slots = (prefix) => [0, 1, 2].map((index) => placeholder(`${prefix}-${index}`))

export const loadingShowcase = {
  source: 'loading',
  pair: [
    { name: 'Marina', tone: 'coral', movie: placeholder('a') },
    { name: 'Caio', tone: 'sand', movie: placeholder('b') },
  ],
  result: { movie: placeholder('c'), score: 0, reasons: [] },
  recommendations: slots('rec').map((movie) => ({ movie, score: 0, note: '' })),
  scan: SCAN,
  categories: { movie: slots('movie'), series: slots('series'), animation: slots('animation') },
}