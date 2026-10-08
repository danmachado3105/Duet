import Reveal from '../components/Reveal.jsx'
import FlowStrip from '../components/FlowStrip.jsx'
import StepVisual from '../components/StepVisual.jsx'
import { steps } from '../data/steps.js'

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section how">
      <div className="container">
        <div className="how__head">
          <Reveal>
            <span className="eyebrow">Como funciona</span>
            <h2 className="section-title">
              Dois filmes entram.
              <br />
              Uma escolha sai.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <FlowStrip />
          </Reveal>
        </div>

        <ol className="rail">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.id} delay={i * 120} className="rail__step">
              <span className="rail__node" aria-hidden="true" />
              <div className="rail__visual">
                <StepVisual type={step.visual} />
              </div>
              <span className="rail__number">{step.number}</span>
              <h3 className="rail__title">{step.title}</h3>
              <p className="rail__text">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}