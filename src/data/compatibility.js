// Dados mockados e ilustrativos. O algoritmo real vem em outra etapa.
export const compatibilityExample = {
  you: { label: 'Você', tone: 'coral', tastes: ['Ficção científica', 'Suspense'] },
  partner: { label: 'Seu par', tone: 'sand', tastes: ['Drama', 'Suspense'] },
  result: [
    { label: 'Suspense', tone: 'both' },
    { label: 'Ficção científica', tone: 'coral' },
    { label: 'Drama', tone: 'sand' },
  ],
  score: 92,
}

export const criteria = [
  { id: 'generos', name: 'Gêneros', text: 'O que cada um costuma assistir.', value: 96 },
  { id: 'duracao', name: 'Duração', text: 'O tempo que vocês têm para a noite.', value: 88 },
  { id: 'humor', name: 'Humor', text: 'Leve, sombrio ou o meio-termo.', value: 90 },
  { id: 'avaliacao', name: 'Avaliação', text: 'Filmes bem avaliados por quem já viu.', value: 92 },
  { id: 'temas', name: 'Temas', text: 'Os assuntos que interessam aos dois.', value: 95 },
  { id: 'preferencias', name: 'Preferências', text: 'O que cada um já indicou que gosta.', value: 91 },
]