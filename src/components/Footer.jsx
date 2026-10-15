import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { navLinks } from '../data/navigation.js'
import { CATEGORIES, categoryRoute } from '../utils/categories.js'
import { ROUTES } from '../utils/sessionFlow.js'

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p>Dois gostos. Uma escolha.</p>
          </div>

          <nav aria-label="Rodapé">
            <p className="footer__heading">Navegação</p>
            <ul className="footer__links">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
              <li>
                <Link to={ROUTES.newSession}>Começar</Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Categorias">
            <p className="footer__heading">Categorias</p>
            <ul className="footer__links">
              {CATEGORIES.map((category) => (
                <li key={category.id}>
                  <Link to={categoryRoute(category)}>{category.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <p>Projeto em desenvolvimento.</p>
          <p>© {CURRENT_YEAR} DUET</p>
        </div>

        <p className="footer__credit">
          Dados e imagens de filmes e séries:{' '}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
            TMDB
          </a>
          . Este produto usa a API da TMDB, mas não é endossado nem certificado por ela. Dados de
          disponibilidade fornecidos por JustWatch.
        </p>
      </div>
    </footer>
  )
}