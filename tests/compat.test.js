import test from 'node:test'
import assert from 'node:assert/strict'
import {
  analyzeSelections,
  buildProfile,
  canonicalGenres,
  rankCandidates,
} from '../src/utils/compat.js'

function title(id, genreIds, { rating = 8, type = 'Filme', posterPath = '/poster.jpg' } = {}) {
  return {
    id,
    title: id,
    type,
    mediaType: type === 'Série' ? 'tv' : 'movie',
    genreIds,
    genres: [],
    rating,
    posterPath,
  }
}

test('converte gêneros de séries para ids canônicos e remove duplicatas', () => {
  assert.deepEqual(canonicalGenres([10759, 28, 10765]), [28, 12, 878, 14])
})

test('analisa títulos em comum e gêneros compartilhados sem alterar as escolhas', () => {
  const first = [title('shared', [28]), title('first-only', [12])]
  const second = [title('shared', [28]), title('second-only', [28])]
  const result = analyzeSelections(first, second, (id) => (id === 28 ? 'Ação' : null))

  assert.deepEqual(result.view.sharedTitles.map(({ id }) => id), ['shared'])
  assert.deepEqual(result.view.sharedGenres, ['Ação'])
  assert.equal(result.view.situation, 'common')
  assert.equal(first.length, 2)
  assert.equal(second.length, 2)
})

test('preserva vários títulos escolhidos pelas duas pessoas', () => {
  const first = [title('shared-a', [28]), title('shared-b', [12])]
  const second = [title('shared-a', [28]), title('shared-b', [12])]
  const result = analyzeSelections(first, second, () => null)

  assert.deepEqual(result.view.sharedTitles.map(({ id }) => id), ['shared-a', 'shared-b'])
})

test('apresenta cenário sem gêneros compartilhados sem inventar títulos em comum', () => {
  const result = analyzeSelections([title('one', [28])], [title('two', [878])], () => null)
  assert.deepEqual(result.view.sharedTitles, [])
  assert.deepEqual(result.view.sharedGenres, [])
  assert.equal(result.view.situation, 'split')
})

test('ranking exclui escolhas, pôster ausente e títulos que não agradam às duas pessoas', () => {
  const first = [title('a', [28])]
  const second = [title('b', [28])]
  const profiles = { profileA: buildProfile(first), profileB: buildProfile(second) }
  const pool = [
    { title: title('selected', [28]), sources: [] },
    { title: title('good', [28], { rating: 9 }), sources: [] },
    { title: title('no-poster', [28], { posterPath: null }), sources: [] },
    { title: title('unmatched', [878]), sources: [] },
  ]

  const ranked = rankCandidates(pool, { ...profiles, excludeIds: new Set(['selected']), nameOf: () => null })
  assert.deepEqual(ranked.map(({ title: item }) => item.id), ['good'])
  assert.ok(ranked[0].percent >= 0 && ranked[0].percent <= 100)
})
