import Button from '../components/Button.jsx'
import TransitionScreen from '../components/TransitionScreen.jsx'
import { CheckIcon } from '../components/Icons.jsx'
import { ROUTES } from '../utils/sessionFlow.js'

export default function HandoffPage() {
  return (
    <TransitionScreen
      eyebrow="Pessoa 1"
      title="Boa escolha."
      text="Agora é a vez da outra pessoa."
      actions={
        <Button to={ROUTES.person2} size="lg" arrow>
          Passar para Pessoa 2
        </Button>
      }
    >
      <p className="registered">
        <CheckIcon />
        Escolha de Pessoa 1 registrada.
      </p>
      <p className="hint">Entreguem o dispositivo. A escolha fica em segredo até a análise.</p>
    </TransitionScreen>
  )
}