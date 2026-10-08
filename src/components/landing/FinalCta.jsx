import Button from '../ui/Button.jsx'
import Reveal from '../ui/Reveal.jsx'

export default function FinalCta() {
  return (
    <section className="section final">
      <Reveal className="container final__inner">
        <h2 className="final__title">Prontos para decidir?</h2>
        <p className="final__text">Deixem a indecisão para trás.</p>
        <Button href="#">Começar uma sessão</Button>
      </Reveal>
    </section>
  )
}