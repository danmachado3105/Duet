// Une os gêneros de filmes e séries por nome. Cada opção guarda o id de cada tipo:
// { name: 'Drama', ids: { movie: 18, tv: 18 } }
// Assim, só aparecem gêneros que existem para o tipo selecionado e o filtro nunca fica "mudo".
export function buildGenreOptions(genres, type) {
  if (!genres) return []

  const byName = new Map()
  const add = (list, kind) => {
    list.forEach(({ id, name }) => {
      const option = byName.get(name) ?? { name, ids: {} }
      option.ids[kind] = id
      byName.set(name, option)
    })
  }

  if (type !== 'series') add(genres.movie, 'movie')
  if (type !== 'movie') add(genres.tv, 'tv')

  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
}