import Reveal from '../components/Reveal.jsx'
import SessionMock from '../components/SessionMock.jsx'

export default function InAction() {
  return (
    <section className="section action">
      <div className="container action__grid">
        <Reveal>
          <span className="eyebrow">DUET em ação</span>
          <h2 className="section-title">É assim que acontece.</h2>
          <p className="lead">
            Uma sala para os dois, escolhas lado a lado e recomendações ordenadas por
            compatibilidade.
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
              As recomendações, da mais compatível à menos
            </li>
          </ol>
        </Reveal>

        <Reveal delay={120}>
          <SessionMock />
          <p className="action__caption">Prévia ilustrativa da futura tela.</p>
        </Reveal>
      </div>
    </section>
  )
}