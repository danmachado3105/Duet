import {
  discoverByGenres,
  genreNameOf,
  getGenres,
  getRecommendationsFor,
  loadImageConfig,
} from './tmdb.js'
import {
  analyzeSelections,
  movieGenreId,
  planCandidates,
  rankCandidates,
  tvGenreId,
} from '../utils/compat.js'

const hasGenreIds = (title) => Array.isArray(title.genreIds) && title.genreIds.length > 0

// Junta, sem repetir, os candidatos vindos das recomendações da TMDB e das combinações de gêneros
async function loadPool(plan) {
  const jobs = []

  plan.seeds.forEach(({ person, title }) => {
    jobs.push({
      run: () => getRecommendationsFor(title.mediaType, title.tmdbId),
      source: { person, seedTitle: title.title },
    })
  })

  plan.combos.forEach((ids) => {
    const movieIds = ids.map(movieGenreId)
    if (movieIds.every((id) => id != null)) {
      jobs.push({ run: () => discoverByGenres('movie', movieIds), source: null })
    }
    const tvIds = [...new Set(ids.map(tvGenreId))]
    if (tvIds.every((id) => id != null)) {
      jobs.push({ run: () => discoverByGenres('tv', tvIds), source: null })
    }
  })

  const settled = await Promise.allSettled(jobs.map((job) => job.run()))
  // Se tudo falhou, o erro sobe (e a tela oferece "tentar novamente"). Falhas parciais são ignoradas.
  if (jobs.length > 0 && settled.every((result) => result.status === 'rejected')) {
    throw settled[0].reason
  }

  const pool = new Map()
  settled.forEach((result, index) => {
    if (result.status !== 'fulfilled') return
    const { source } = jobs[index]
    result.value.forEach((title) => {
      const entry = pool.get(title.id) ?? { title, sources: [] }
      if (source) entry.sources.push(source)
      pool.set(title.id, entry)
    })
  })

  return [...pool.values()]
}

// first/second: listas de títulos de cada pessoa. Lança TmdbError.
export async function computeCompatibility(first, second) {
  const all = [...first, ...second]
  const canRecommend = all.every((title) => title.source === 'tmdb' && hasGenreIds(title))

  if (canRecommend) await getGenres() // nomes dos gêneros (e erro claro se a TMDB falhar)
  else if (all.some(hasGenreIds)) await getGenres().catch(() => null)
  void loadImageConfig()

  const analysis = analyzeSelections(first, second, genreNameOf)

  // Títulos de demonstração não têm ids de gênero da TMDB: só dá para comparar as escolhas
  if (!canRecommend) return { ...analysis.view, mode: 'picks-only', recommendations: [] }

  const plan = planCandidates(first, second, analysis)
  const pool = await loadPool(plan)
  const recommendations = rankCandidates(pool, {
    profileA: analysis.profileA,
    profileB: analysis.profileB,
    excludeIds: new Set(all.map((title) => title.id)),
    nameOf: genreNameOf,
  })

  return { ...analysis.view, mode: 'tmdb', recommendations }
}