export const ROUTES = {
  home: '/',
  newSession: '/sessao/nova',
  person1: '/sessao/pessoa-1',
  handoff: '/sessao/passar',
  person2: '/sessao/pessoa-2',
  summary: '/sessao/resumo',
  analysis: '/sessao/analise',
  result: '/sessao/resultado',
}

export const FLOW_STEPS = [
  { id: 'pessoa-1', label: 'Pessoa 1' },
  { id: 'pessoa-2', label: 'Pessoa 2' },
  { id: 'resumo', label: 'Resumo' },
  { id: 'analise', label: 'Análise' },
]

// Índice da etapa atual no indicador de progresso (-1 = não mostrar)
export function stepIndexFor(pathname) {
  switch (pathname) {
    case ROUTES.person1:
      return 0
    case ROUTES.handoff:
    case ROUTES.person2:
      return 1
    case ROUTES.summary:
      return 2
    case ROUTES.analysis:
      return 3
    case ROUTES.result:
      return 4
    default:
      return -1
  }
}

// Para onde "Continuar sessão anterior" deve levar
export function getResumeRoute(progress) {
  if (progress.second) return ROUTES.summary
  if (progress.first) return ROUTES.handoff
  return ROUTES.person1
}