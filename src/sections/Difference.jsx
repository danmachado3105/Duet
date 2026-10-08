import Reveal from '../components/Reveal.jsx'
import TasteVenn from '../components/TasteVenn.jsx'
import { before, after } from '../data/difference.js'

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

export default function Difference() {
  return (
    <section id="diferencial" className="section theme-paper difference">
      <div className="container difference__grid">
        <div className="difference__copy">
          <Reveal>
            <span className="eyebrow">Por que o DUET</span>
            <h2 className="section-title">Não é mais uma busca. É um cruzamento.</h2>
            <p className="lead">
              Catálogos mostram tudo para todo mundo. O DUET mostra o que faz sentido para vocês dois.
            </p>
          </Reveal>

          <Reveal delay={120} className="compare">
            <div className="compare__col compare__col--before">
              <h3 className="compare__title">Procurando no catálogo</h3>
              <ul>
                {before.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="compare__col compare__col--after">
              <h3 className="compare__title">Com o DUET</h3>
              <ul>
                {after.map((item) => (
                  <li key={item}>
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={100} className="difference__visual">
          <TasteVenn />
        </Reveal>
      </div>
    </section>
  )
}