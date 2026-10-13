import { useLocation } from 'react-router-dom'
import Button from '../components/Button.jsx'
import TransitionScreen from '../components/TransitionScreen.jsx'
import { CheckIcon } from '../components/Icons.jsx'
import { useSession } from '../context/sessionContext.js'
import { ROUTES } from '../utils/sessionFlow.js'

export default function HandoffPage() {
  // Mantém a categoria escolhida na landing (?categoria=...) para a Pessoa 2
  const { search } = useLocation()
  const { session } = useSession()
  const count = session.person1.selections.length

  return (
    <TransitionScreen
      eyebrow="Pessoa 1"
      title="Boa escolha."
      text="Agora é a vez da outra pessoa."
      actions={
        <>
          <Button to={`${ROUTES.person2}${search}`} size="lg" arrow>
            Passar para Pessoa 2
          </Button>
          <Button to={`${ROUTES.person1}${search}`} variant="ghost" size="lg">
            Alterar minhas escolhas
          </Button>
        </>
      }
    >
      <p className="registered">
        <CheckIcon />
        Escolhas da Pessoa 1 registradas ({count} {count === 1 ? 'título' : 'títulos'}).
      </p>
      <p className="hint">Entreguem o dispositivo. As escolhas ficam em segredo até o resumo.</p>
    </TransitionScreen>
  )
}