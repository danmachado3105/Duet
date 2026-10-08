import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import VennMark from '../components/VennMark.jsx'

export default function FinalCta() {
  return (
    <section className="final">
      <div className="container final__inner">
        <Reveal>
          <h2 className="final__title">Prontos para decidir?</h2>
          <p className="final__text">Deixem a indecisão para trás.</p>
          <Button href="#" variant="paper" size="lg" arrow>
            Começar uma sessão
          </Button>
        </Reveal>
        <VennMark className="final__mark" lens="rgba(243, 236, 226, 0.18)" />
      </div>
    </section>
  )
}