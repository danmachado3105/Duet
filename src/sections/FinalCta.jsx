import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import { useSessionDialog } from '../context/sessionDialogContext.js'

export default function FinalCta() {
  const { openDialog } = useSessionDialog()

  return (
    <section className="final">
      <div className="container final__grid">
        <Reveal>
          <h2 className="final__title">Prontos para parar de procurar?</h2>
          <p className="final__text">Dois gostos. Uma escolha.</p>
          <Button variant="paper" size="lg" arrow onClick={() => openDialog('create')}>
            Começar uma sessão
          </Button>
        </Reveal>

        <Reveal delay={150} className="final__ticket">
          <article className="ticket" aria-label="Ingresso ilustrativo: entrada para dois">
            <div className="ticket__main">
              <span className="ticket__kicker">Sessão de hoje</span>
              <strong className="ticket__title">Entrada para dois</strong>
              <p className="ticket__slogan">Dois gostos. Uma escolha.</p>
              <dl className="ticket__meta">
                <div>
                  <dt>Sessão</dt>
                  <dd>K7P-2X</dd>
                </div>
                <div>
                  <dt>Filme</dt>
                  <dd>A decidir</dd>
                </div>
                <div>
                  <dt>Lugares</dt>
                  <dd>2</dd>
                </div>
              </dl>
            </div>
            <div className="ticket__stub" aria-hidden="true">
              <span>Entrada</span>
              <b>02</b>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}