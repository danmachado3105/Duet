import { WEIGHTS } from '../utils/compat.js'

const pct = (value) => Math.round(value * 100)

export default function CompatRule() {
  return (
    <details className="rule">
      <summary>Como calculamos a compatibilidade</summary>
      <div className="rule__body">
        <p>Cada sugestão recebe uma nota de 0 a 100, sempre pela mesma regra:</p>
        <ul>
          <li>
            <b>{pct(WEIGHTS.genre)}% gêneros.</b> Para cada pessoa, o gênero mais frequente nas
            escolhas vale 100%, e os outros valem a proporção dele. A afinidade do título é a média
            desse valor nos gêneros dele. As duas pessoas entram por média harmônica, então o título
            só pontua alto se agradar às duas.
          </li>
          <li>
            <b>{pct(WEIGHTS.type)}% tipo.</b> Se é filme, série ou animação, comparado ao que cada
            pessoa costuma escolher (também por média harmônica).
          </li>
          <li>
            <b>{pct(WEIGHTS.quality)}% avaliação.</b> A nota do público na TMDB: 5 vale zero e 9
            vale o máximo. Sem nota, vale a metade.
          </li>
        </ul>
        <p>
          Ficam de fora os títulos já escolhidos por alguém e os que não têm nenhum gênero em
          comum com uma das pessoas. As sugestões vêm das recomendações da TMDB para as escolhas de
          vocês e de combinações de gêneros das duas pessoas.
        </p>
        <p>
          A conta é feita no seu navegador, com os dados da TMDB. Não usamos inteligência artificial
          nem dados pessoais.
        </p>
      </div>
    </details>
  )
}