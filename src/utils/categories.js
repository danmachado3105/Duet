import { ROUTES } from './sessionFlow.js'

// Categorias da landing e do catálogo.
// "Animações" NÃO é um terceiro formato: é o gênero Animação (id 16 na TMDB), que existe tanto
// para filmes quanto para séries. Um filme animado aparece em Filmes e em Animações; dentro de
// uma mesma lista, nunca se repete.
export const CATEGORIES = [
  { id: 'movie', slug: 'filmes', label: 'Filmes', text: 'Histórias para ver de uma vez só.' },
  {
    id: 'series',
    slug: 'series',
    label: 'Séries',
    text: 'Para quando a noite rende mais de um episódio.',
  },
  {
    id: 'animation',
    slug: 'animacoes',
    label: 'Animações',
    text: 'Filmes e séries animados, para todos os gostos.',
  },
]

export const categoryFromSlug = (slug) => CATEGORIES.find((item) => item.slug === slug) ?? null

// A landing leva à introdução da sessão já com a categoria escolhida
export const categoryRoute = (category) => `${ROUTES.newSession}?categoria=${category.slug}`