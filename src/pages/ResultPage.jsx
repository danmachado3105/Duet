import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Poster from '../components/Poster.jsx'
import TransitionScreen from '../components/TransitionScreen.jsx'
import { useSession } from '../context/sessionContext.js'
import { ROUTES } from '../utils/sessionFlow.js'

// Placeholder: o resultado real (recomendações e votação) é a próxima etapa.
export default function ResultPage() {
  const navigate = useNavigate()
  const { session, reset } = useSession()
  const first = session.person1.selectedMovie
  const second = session.person2.selectedMovie

  const startOver = () => {
    reset()
    navigate(ROUTES.person1)
  }

  return (
    <TransitionScreen
      eyebrow="Resultado"
      title="O resultado chega na próxima etapa."
      text="Por enquanto, estas são as duas escolhas. O DUET vai cruzar os gostos e sugerir opções para os dois."
      actions={
        <>
          <Button size="lg" onClick={startOver}>
            Começar outra sessão
          </Button>
          <Button to={ROUTES.home} variant="ghost" size="lg">
            Voltar ao início
          </Button>
        </>
      }
    >
      <div className="pair pair--static">
        <div className="pair__item">
          <Poster movie={first} size="md" />
          <p className="pair__cap">
            <span>Pessoa 1</span>
            <strong>{first.title}</strong>
          </p>
        </div>
        <span className="pair__plus" aria-hidden="true">
          +
        </span>
        <div className="pair__item">
          <Poster movie={second} size="md" />
          <p className="pair__cap">
            <span>Pessoa 2</span>
            <strong>{second.title}</strong>
          </p>
        </div>
      </div>
    </TransitionScreen>
  )
}