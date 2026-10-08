import Reveal from '../components/Reveal.jsx'
import { conversation } from '../data/impasse.js'

export default function Impasse() {
  return (
    <section id="impasse" className="section impasse">
      <div className="container impasse__grid">
        <Reveal className="impasse__copy">
          <span className="eyebrow">O impasse</span>
          <h2 className="section-title">Meia hora rolando o catálogo. Nenhum filme assistido.</h2>
          <p className="lead">
            Todo casal conhece essa conversa. O DUET existe para acabar com o “tanto faz”.
          </p>
        </Reveal>

        <ol className="chat" aria-label="Exemplo de conversa">
          {conversation.map((message, i) => (
            <Reveal
              as="li"
              key={i}
              delay={i * 100}
              className={`chat__msg chat__msg--${message.from}`}
            >
              {message.from !== 'system' && <span className="chat__name">{message.name}</span>}
              <p>{message.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}