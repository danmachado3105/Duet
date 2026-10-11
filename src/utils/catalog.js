const TYPE_BY_FILTER = { movie: 'Filme', series: 'Série' }

// Remove acentos e caixa para a busca ("amelie" encontra "Amélie")
export function normalize(text = '') {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function filterCatalog(catalog, { query, type, genre }) {
  const q = normalize(query)

  return catalog.filter((item) => {
    if (type !== 'all' && item.type !== TYPE_BY_FILTER[type]) return false
    if (genre && !item.genres.includes(genre)) return false
    if (!q) return true
    return (
      normalize(item.title).includes(q) || item.genres.some((name) => normalize(name).includes(q))
    )
  })
}

// Os gêneros mais frequentes do catálogo, para os filtros
export function topGenres(catalog, limit = 8) {
  const counts = new Map()
  catalog.forEach((item) => {
    item.genres.forEach((name) => counts.set(name, (counts.get(name) ?? 0) + 1))
  })

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR'))
    .slice(0, limit)
    .map(([name]) => name)
}

export function formatDuration(item) {
  if (item.type === 'Série') return `${item.duration} min por episódio`
  const hours = Math.floor(item.duration / 60)
  const minutes = item.duration % 60
  if (!hours) return `${minutes}min`
  return minutes ? `${hours}h ${minutes}min` : `${hours}h`
}