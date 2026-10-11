// Cruzamento simples e previsível das duas escolhas. Não é o algoritmo de compatibilidade:
// só entrega, de forma local, os dados que a etapa de recomendações vai usar.
export function analyzeSelection(first, second) {
  return {
    sameTitle: first.id === second.id,
    sharedGenres: first.genres.filter((genre) => second.genres.includes(genre)),
    sharedKeywords: first.keywords.filter((word) => second.keywords.includes(word)),
  }
}