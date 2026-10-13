import Reveal from '../components/Reveal.jsx'
import SessionMock from '../components/SessionMock.jsx'

export default function InAction() {
  return (
    <section className="section action">
      <div className="container action__grid">
        <Reveal>
          <span className="eyebrow">DUET em ação</span>
          <h2 className="section-title">É assim que vai acontecer.</h2>
          <p className="lead">
            Uma prévia da tela da sessão: as escolhas de cada um e as recomendações para os dois.
          </p>
          <ol className="legend">
            <li>
              <b>1</b>
              As escolhas de cada um
            </li>
            <li>
              <b>2</b>O cruzamento dos gostos
            </li>
            <li>
              <b>3</b>
              As recomendações (em breve)
            </li>
          </ol>
        </Reveal>

        <Reveal delay={120}>
          <SessionMock />
          <p className="action__caption">
            Prévia ilustrativa da futura tela. Recomendações e votação ainda estão em
            desenvolvimento.
          </p>
        </Reveal>
      </div>
    </section>
  )
}