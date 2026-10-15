import test from 'node:test'
import assert from 'node:assert/strict'
import { filterCatalog, queryCatalog, sortCatalog } from '../src/utils/catalog.js'

const titles = [
  { id: 'film-a', title: 'Amélie', type: 'Filme', year: 2001, rating: 8.3, genres: ['Comédia', 'Romance'] },
  { id: 'film-b', title: 'O Fabuloso Destino de Amélie Poulain', type: 'Filme', year: 2001, rating: 8.1, genres: ['Comédia'] },
  { id: 'series-a', title: 'Amélie: A Série', type: 'Série', year: 2024, rating: 7.5, genres: ['Animação'] },
]

test('busca ignora acentos e combina tipo e gênero sem perder resultados', () => {
  assert.deepEqual(
    filterCatalog(titles, { query: 'amelie', type: 'movie', genre: 'Comédia' }).map(({ id }) => id),
    ['film-a', 'film-b'],
  )
})

test('tipo animação inclui filmes e séries marcados com esse gênero', () => {
  assert.deepEqual(
    filterCatalog(titles, { type: 'animation' }).map(({ id }) => id),
    ['series-a'],
  )
})

test('ordenar não modifica a lista original e busca por relevância prioriza título iniciado', () => {
  const input = [...titles]
  const ordered = queryCatalog(input, { query: 'amelie' })
  assert.deepEqual(ordered.map(({ id }) => id), ['film-a', 'series-a', 'film-b'])
  assert.deepEqual(input, titles)
  assert.deepEqual(sortCatalog(input, 'rating').map(({ id }) => id), ['film-a', 'film-b', 'series-a'])
})
