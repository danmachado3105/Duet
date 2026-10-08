import Reveal from '../ui/Reveal.jsx'
import { steps } from '../../data/steps.js'

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section">
      <div className="container">
        <Reveal className="section__head">
          <span className="eyebrow">Como funciona</span>
          <h2 className="section__title">Quatro passos até a sessão da noite.</h2>
        </Reveal>

        <ol className="steps">
          {steps.map((step, index) => (
            <Reveal as="li" key={step.number} delay={index * 100} className="step">
              <span className="step__number">{step.number}</span>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__text">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}