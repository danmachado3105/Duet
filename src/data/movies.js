// Dados mockados e ilustrativos. "art" define a arte do pôster feita em CSS.
export const movies = {
  interstellar: {
    id: 'interstellar',
    title: 'Interstellar',
    year: 2014,
    genre: 'Ficção científica',
    art: { motif: 'orbit', a: '#0f0b0a', b: '#3a2216', c: '#f0b45f' },
  },
  corra: {
    id: 'corra',
    title: 'Corra!',
    year: 2017,
    genre: 'Suspense',
    art: { motif: 'eye', a: '#1a0709', b: '#5e1624', c: '#ecd2c4' },
  },
  origem: {
    id: 'origem',
    title: 'A Origem',
    year: 2010,
    genre: 'Ficção científica',
    art: { motif: 'city', a: '#0d1316', b: '#47606a', c: '#b7cad1' },
  },
  lalaland: {
    id: 'lalaland',
    title: 'La La Land',
    year: 2016,
    genre: 'Musical',
    art: { motif: 'spot', a: '#0e1626', b: '#27406b', c: '#f2a65a' },
  },
  parasita: {
    id: 'parasita',
    title: 'Parasita',
    year: 2019,
    genre: 'Suspense',
    art: { motif: 'window', a: '#0c1410', b: '#2e4a36', c: '#d6e0c8' },
  },
  meianoite: {
    id: 'meianoite',
    title: 'Meia-Noite em Paris',
    year: 2011,
    genre: 'Comédia romântica',
    art: { motif: 'moon', a: '#0b1230', b: '#1e3a6e', c: '#f4d77a' },
  },
  duna: {
    id: 'duna',
    title: 'Duna',
    year: 2021,
    genre: 'Ficção científica',
    art: { motif: 'dunes', a: '#2a160b', b: '#b86a2c', c: '#f3c98b' },
  },
  amelie: {
    id: 'amelie',
    title: 'Amélie',
    year: 2001,
    genre: 'Comédia romântica',
    art: { motif: 'orbit', a: '#1a0f0a', b: '#8a2f1c', c: '#f0c27a' },
  },
  budapeste: {
    id: 'budapeste',
    title: 'O Grande Hotel Budapeste',
    year: 2014,
    genre: 'Comédia',
    art: { motif: 'frame', a: '#3a0f1c', b: '#c76f86', c: '#f6d4d9' },
  },
}

const marina = { name: 'Marina', tone: 'coral' }
const caio = { name: 'Caio', tone: 'sand' }

export const scenarios = [
  {
    id: 'ficcao',
    picks: [
      { ...marina, movie: movies.interstellar },
      { ...caio, movie: movies.corra },
    ],
    result: {
      movie: movies.origem,
      score: 94,
      shared: ['Ficção científica', 'Suspense', 'Roteiro inteligente'],
    },
  },
  {
    id: 'paris',
    picks: [
      { ...marina, movie: movies.lalaland },
      { ...caio, movie: movies.parasita },
    ],
    result: {
      movie: movies.meianoite,
      score: 89,
      shared: ['Romance', 'Humor sutil', 'Boas conversas'],
    },
  },
  {
    id: 'hotel',
    picks: [
      { ...marina, movie: movies.duna },
      { ...caio, movie: movies.amelie },
    ],
    result: {
      movie: movies.budapeste,
      score: 91,
      shared: ['Visual marcante', 'Aventura', 'Charme'],
    },
  },
]

export const ranking = [
  { title: 'A Origem', score: 94 },
  { title: 'Ilha do Medo', score: 88 },
  { title: 'Ex Machina', score: 85 },
]