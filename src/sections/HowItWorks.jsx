import Reveal from '../components/Reveal.jsx'
import StepVisual from '../components/StepVisual.jsx'
import { steps } from '../data/steps.js'

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section how">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Como funciona</span>
          <h2 className="section-title">Do “tanto faz” ao match em quatro passos.</h2>
        </Reveal>

        <ol className="steps">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.id} delay={i * 100} className="step">
              <div className="step__visual">
                <StepVisual type={step.visual} />
              </div>
              <div className="step__body">
                <span className="step__number">{step.number}</span>
                <h3 className="step__title">{step.title}</h3>
                <p className="step__text">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}