import Button from '../components/Button.jsx'
import MatchCard from '../components/MatchCard.jsx'
import Reveal from '../components/Reveal.jsx'

export default function Hero() {
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
            <Button href="#" size="lg" arrow>
              Começar uma sessão
            </Button>
            <Button href="#" variant="ghost" size="lg">
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