import CategoryCard from '../components/CategoryCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { useShowcase } from '../context/showcaseContext.js'
import { CATEGORIES } from '../utils/categories.js'

export default function Explore() {
  const { data } = useShowcase()

  return (
    <section id="explorar" className="section theme-raised explore">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Explore o catálogo</span>
          <h2 className="section-title">
            Filmes, séries e animações. Escolham por onde começar.
          </h2>
          <p className="lead">
            Cada entrada leva ao mesmo catálogo que vocês usam na hora de escolher, já na
            categoria certa.
          </p>
        </Reveal>

        <ul className="cats">
          {CATEGORIES.map((category, index) => (
            <Reveal as="li" key={category.id} delay={index * 100} className="cats__item">
              <CategoryCard category={category} titles={data.categories[category.id] ?? []} />
            </Reveal>
          ))}
        </ul>

        {data.source === 'demo' && (
          <p className="explore__note">
            Exibindo títulos de demonstração. Não foi possível carregar o catálogo agora.
          </p>
        )}
      </div>
    </section>
  )
}