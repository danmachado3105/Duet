import Reveal from '../components/Reveal.jsx'
import TasteCross from '../components/TasteCross.jsx'
import { criteria } from '../data/compatibility.js'

export default function Compatibility() {
  return (
    <section className="section theme-raised compat">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Compatibilidade</span>
          <h2 className="section-title">
            Não é sorte.
            <br />É compatibilidade.
          </h2>
          <p className="lead">
            O DUET compara o que cada um indicou e procura o que existe de comum, em vez de sortear
            um título.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <TasteCross />
        </Reveal>

        <ul className="criteria">
          {criteria.map((item, i) => (
            <Reveal as="li" key={item.id} delay={(i % 3) * 80} className="crit">
              <div className="crit__in" style={{ '--w': `${item.value}%` }}>
                <div className="crit__top">
                  <h3>{item.name}</h3>
                  <b>{item.value}%</b>
                </div>
                <p>{item.text}</p>
                <span className="crit__bar" aria-hidden="true">
                  <i />
                </span>
              </div>
            </Reveal>
          ))}
        </ul>

        <p className="compat__caption">Valores ilustrativos. O cálculo real vem em uma próxima etapa.</p>
      </div>
    </section>
  )
}