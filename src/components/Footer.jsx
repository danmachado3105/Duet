import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { navLinks } from '../data/navigation.js'
import { ROUTES } from '../utils/sessionFlow.js'

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
        </div>

        <div className="footer__bottom">
          <p>Projeto em desenvolvimento.</p>
          <p>© {new Date().getFullYear()} DUET</p>
        </div>
      </div>
    </footer>
  )
}