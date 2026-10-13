// `soon: true` = etapa ainda em desenvolvimento (a landing não promete como se já existisse)
export const steps = [
  {
    id: 'escolham',
    number: '01',
    title: 'Escolham',
    text: 'Cada um escolhe o filme, a série ou a animação que gostaria de assistir.',
    visual: 'picks',
  },
  {
    id: 'comparem',
    number: '02',
    title: 'Comparem',
    text: 'O DUET olha o que existe por trás das duas escolhas.',
    visual: 'overlap',
  },
  {
    id: 'descubram',
    number: '03',
    title: 'Descubram',
    text: 'Aparecem títulos que podem agradar aos dois.',
    visual: 'ranking',
    soon: true,
  },
  {
    id: 'match',
    number: '04',
    title: 'Deu match',
    text: 'Vocês escolhem juntos e pronto.',
    visual: 'match',
    soon: true,
  },
]