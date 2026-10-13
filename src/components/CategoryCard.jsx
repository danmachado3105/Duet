import { Link } from 'react-router-dom'
import PosterImage from './PosterImage.jsx'
import { ArrowIcon } from './Icons.jsx'
import { categoryRoute } from '../utils/categories.js'

export default function CategoryCard({ category, titles }) {
  return (
    <Link
      to={categoryRoute(category)}
      className="cat"
      aria-label={`Explorar ${category.label}`}
    >
      <span className="cat__posters" aria-hidden="true">
        {titles.map((title, index) => (
          <span key={title.id} className="cat__poster" style={{ '--i': index }}>
            <PosterImage movie={title} sizes="(min-width: 960px) 130px, 100px" />
          </span>
        ))}
      </span>

      <span className="cat__body">
        <span className="cat__label">{category.label}</span>
        <span className="cat__text">{category.text}</span>
        <span className="cat__cta">
          Explorar
          <ArrowIcon />
        </span>
      </span>
    </Link>
  )
}