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
  palmsprings: {
    id: 'palmsprings',
    title: 'Palm Springs',
    year: 2020,
    genre: 'Comédia romântica',
    art: { motif: 'dunes', a: '#3a1c12', b: '#d9825b', c: '#ffe0b0' },
  },
}

// Demonstração interativa do hero
export const heroDemo = {
  session: 'K7P-2X',
  picks: [
    { name: 'Marina', tone: 'coral', movie: movies.lalaland },
    { name: 'Caio', tone: 'sand', movie: movies.parasita },
  ],
  scan: [
    { label: 'Gêneros', width: '92%' },
    { label: 'Humor', width: '86%' },
    { label: 'Temas', width: '89%' },
  ],
  result: {
    movie: movies.meianoite,
    score: 89,
    reasons: ['Romance', 'Humor sutil', 'Boas conversas'],
  },
}

// Mockup da seção "DUET em ação"
export const sessionMock = {
  code: 'K7P-2X',
  people: [
    { name: 'Marina', tone: 'coral', movie: movies.interstellar },
    { name: 'Caio', tone: 'sand', movie: movies.corra },
  ],
  recommendations: [
    { movie: movies.origem, score: 94, note: 'Ficção científica · Suspense' },
    { movie: movies.meianoite, score: 89, note: 'Romance · Humor sutil' },
    { movie: movies.palmsprings, score: 88, note: 'Comédia · Romance' },
  ],
}