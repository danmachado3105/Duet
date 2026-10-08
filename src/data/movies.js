// Dados mockados e ilustrativos. A "tone" define a arte do pôster no CSS.
const interstellar = { id: 'interstellar', title: 'Interstellar', year: 2014, tone: 'interstellar' }
const origem = { id: 'origem', title: 'A Origem', year: 2010, tone: 'origem' }
const corra = { id: 'corra', title: 'Corra!', year: 2017, tone: 'corra' }

// Ordem: esquerda, centro, direita
export const heroPosters = [interstellar, origem, corra]

export const compatibilityExample = {
  picks: [
    { person: 'Pessoa 1', movie: interstellar },
    { person: 'Pessoa 2', movie: corra },
  ],
  result: { movie: origem, score: 94 },
}