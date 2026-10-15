import test from 'node:test'
import assert from 'node:assert/strict'
import { MAX_PICKS, parseSession, serializeSession } from '../src/utils/sessionState.js'

function movie(id) {
  return {
    id: `movie-${id}`,
    source: 'tmdb',
    tmdbId: id,
    mediaType: 'movie',
    type: 'Filme',
    title: `Filme ${id}`,
    genres: ['Ação'],
    genreIds: [28],
  }
}

test('restaura escolhas independentes, sem duplicatas e respeitando o limite atual', () => {
  const picks = Array.from({ length: MAX_PICKS + 2 }, (_, index) => movie(index + 1))
  const raw = JSON.stringify({
    person1: { selections: [...picks, picks[0]], providers: [8, 8, -1, '12'] },
    person2: { selections: [movie(20)], providers: [9] },
  })
  const session = parseSession(raw)

  assert.equal(session.person1.selections.length, MAX_PICKS)
  assert.equal(new Set(session.person1.selections.map(({ id }) => id)).size, MAX_PICKS)
  assert.deepEqual(session.person1.providers, [8])
  assert.deepEqual(session.person2.selections.map(({ id }) => id), ['movie-20'])
  assert.deepEqual(session.person2.providers, [9])
})

test('ignora escolhas da Pessoa 2 se a Pessoa 1 não tiver escolhas válidas', () => {
  const session = parseSession(JSON.stringify({
    person1: { selections: [] },
    person2: { selections: [movie(20)], providers: [9] },
  }))
  assert.deepEqual(session.person2.selections, [])
  assert.deepEqual(session.person2.providers, [])
})

test('serializa e restaura uma sessão sem misturar as pessoas', () => {
  const session = {
    person1: { selections: [movie(1)], providers: [8] },
    person2: { selections: [movie(2)], providers: [9] },
  }
  const restored = parseSession(serializeSession(session))
  assert.deepEqual(restored.person1.selections.map(({ id }) => id), ['movie-1'])
  assert.deepEqual(restored.person2.selections.map(({ id }) => id), ['movie-2'])
  assert.deepEqual(restored.person1.providers, [8])
  assert.deepEqual(restored.person2.providers, [9])
})
