// Cruzamento simples e previsível das duas escolhas. Não é o algoritmo de compatibilidade:
// só entrega, de forma local, os dados que a etapa de recomendações vai usar.
export function analyzeSelection(first, second) {
  const firstGenres = first.genres ?? []
  const secondGenres = second.genres ?? []
  const firstKeywords = first.keywords ?? []
  const secondKeywords = second.keywords ?? []

  return {
    sameTitle: first.id === second.id,
    sharedGenres: firstGenres.filter((genre) => secondGenres.includes(genre)),
    sharedKeywords: firstKeywords.filter((word) => secondKeywords.includes(word)),
  }
}