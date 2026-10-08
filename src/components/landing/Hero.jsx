import Button from '../ui/Button.jsx'
import Poster from '../ui/Poster.jsx'
import Reveal from '../ui/Reveal.jsx'
import { heroPosters } from '../../data/movies.js'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__content">
          <Reveal>
            <span className="eyebrow">Para quem nunca decide</span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="hero__title">
              Dois gostos.
              <br />
              Uma <em>escolha.</em>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="hero__lead">Encontrem um filme que os dois vão querer assistir.</p>
          </Reveal>

          <Reveal delay={300} className="hero__actions">
            <Button href="#">Começar uma sessão</Button>
            <Button href="#" variant="ghost">
              Entrar com código
            </Button>
          </Reveal>
        </div>

        <Reveal delay={200} className="hero__posters">
          {heroPosters.map((movie) => (
            <div className="hero__poster" key={movie.id}>
              <Poster {...movie} />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}