import Reveal from '../components/Reveal.jsx'

// Só o que o DUET já faz hoje.
const ITEMS = [
  {
    title: 'Cada um escolhe o seu',
    text: 'Vocês escolhem separadamente, sem pressão e sem influenciar o outro.',
  },
  {
    title: 'Catálogo de verdade',
    text: 'Filmes, séries e animações com pôsteres, notas e sinopses vindos da TMDB.',
  },
  {
    title: 'Uma tela, duas pessoas',
    text: 'Tudo acontece no mesmo dispositivo. É só passar o celular.',
  },
  {
    title: 'Sem cadastro',
    text: 'Nada de conta ou login. Começou, escolheu.',
  },
]

export default function Differentials() {
  return (
    <section id="diferenciais" className="section theme-raised diff">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Diferenciais</span>
          <h2 className="section-title">Decidir juntos também faz parte da noite.</h2>
        </Reveal>

        <ul className="criteria criteria--four">
          {ITEMS.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 80} className="crit">
              <div className="crit__in">
                <span className="crit__n">{String(index + 1).padStart(2, '0')}</span>
                <div className="crit__top">
                  <h3>{item.title}</h3>
                </div>
                <p>{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}