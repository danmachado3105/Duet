import Logo from './Logo.jsx'
import { footerLinks } from '../data/navigation.js'

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
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
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