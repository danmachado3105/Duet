export const DEFAULT_SORT = 'relevance'

export const SORT_OPTIONS = [
  { id: 'relevance', label: 'Destaque' },
  { id: 'rating', label: 'Melhor avaliação' },
  { id: 'recent', label: 'Mais recentes' },
]

const TYPE_BY_FILTER = { movie: 'Filme', series: 'Série' }

// Remove acentos, caixa e espaços repetidos ("amelie" encontra "Amélie")
export function normalize(text = '') {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

// A busca olha só o título, para não trazer resultados incoerentes.
export function filterCatalog(catalog, { query = '', type = 'all', genre = null } = {}) {
  const q = normalize(query)

  return catalog.filter((item) => {
    if (type !== 'all' && item.type !== TYPE_BY_FILTER[type]) return false
    if (genre && !item.genres.includes(genre)) return false
    return !q || normalize(item.title).includes(q)
  })
}

// 0 = começa com a busca · 1 = alguma palavra começa · 2 = apenas contém
function matchRank(title, q) {
  if (!q) return 0
  const t = normalize(title)
  if (t.startsWith(q)) return 0
  if (t.includes(` ${q}`)) return 1
  return 2
}

// Não altera o array recebido. Em "relevance", a ordem do catálogo é a ordem de destaque.
export function sortCatalog(items, sort = DEFAULT_SORT, query = '') {
  const q = normalize(query)
  const indexed = items.map((item, index) => ({ item, index }))

  const comparators = {
    relevance: (a, b) =>
      matchRank(a.item.title, q) - matchRank(b.item.title, q) || a.index - b.index,
    rating: (a, b) =>
      b.item.rating - a.item.rating || b.item.year - a.item.year || a.index - b.index,
    recent: (a, b) =>
      b.item.year - a.item.year || b.item.rating - a.item.rating || a.index - b.index,
  }

  return indexed.sort(comparators[sort] ?? comparators.relevance).map(({ item }) => item)
}

// Busca + tipo + gênero + ordenação, tudo junto
export function queryCatalog(catalog, { query = '', type = 'all', genre = null, sort = DEFAULT_SORT } = {}) {
  return sortCatalog(filterCatalog(catalog, { query, type, genre }), sort, query)
}

// Todos os gêneros presentes no catálogo, do mais frequente ao menos
export function listGenres(catalog) {
  const counts = new Map()
  catalog.forEach((item) => {
    item.genres.forEach((name) => counts.set(name, (counts.get(name) ?? 0) + 1))
  })

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR'))
    .map(([name]) => name)
}

export function formatMinutes(minutes) {
  if (!minutes) return null
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return `${rest}min`
  return rest ? `${hours}h ${rest}min` : `${hours}h`
}

export function formatCertification(value) {
  if (!value) return null
  return value === 'L' ? 'Livre' : `${value} anos`
}