import Reveal from '../components/Reveal.jsx'
import { wants } from '../data/problem.js'

export default function Problem() {
  return (
    <section id="por-que-duet" className="section theme-paper problem">
      <div className="container">
        <Reveal>
          <span className="eyebrow">O problema</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="problem__title">
            Porque escolher um filme <em>não deveria</em> levar 40 minutos.
          </h2>
        </Reveal>

        <div className="problem__grid">
          <Reveal delay={120} className="problem__copy">
            <p>
              Cada um chega com uma vontade diferente. Entre propor, recusar e ceder, a noite vai
              embora antes de o filme começar.
            </p>
            <p className="problem__closing">O DUET existe para resolver exatamente esse momento.</p>
          </Reveal>

          <ul className="wants">
            {wants.map((want, i) => (
              <Reveal as="li" key={want.a} delay={i * 120} className="want">
                <span className="want__side">
                  <small>Uma pessoa quer</small>
                  <b>{want.a}</b>
                </span>
                <span className="want__vs" aria-hidden="true">
                  ×
                </span>
                <span className="want__side want__side--b">
                  <small>A outra quer</small>
                  <b>{want.b}</b>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}