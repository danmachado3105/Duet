import Button from '../components/Button.jsx'
import MatchCard from '../components/MatchCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { useSessionDialog } from '../context/sessionDialogContext.js'
import { ROUTES } from '../utils/sessionFlow.js'

export default function Hero() {
  const { openDialog } = useSessionDialog()

  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__copy">
          <Reveal>
            <span className="eyebrow">Para noites de filme em dupla</span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="hero__title">
              Dois gostos.
              <br />
              Uma <em>escolha.</em>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="lead hero__lead">
              Cada um escolhe um filme. O DUET cruza os dois gostos e encontra o que vocês dois vão
              querer assistir.
            </p>
          </Reveal>

          <Reveal delay={240} className="hero__actions">
            <Button size="lg" arrow to={ROUTES.newSession}>
              Começar uma sessão
            </Button>
            <Button variant="ghost" size="lg" onClick={() => openDialog('join')}>
              Entrar com código
            </Button>
          </Reveal>
        </div>

        <Reveal delay={200} className="hero__demo">
          <MatchCard />
        </Reveal>
      </div>
    </section>
  )
}