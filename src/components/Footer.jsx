import Logo from './Logo.jsx'
import { navLinks } from '../data/navigation.js'
import { useSessionDialog } from '../context/sessionDialogContext.js'

export default function Footer() {
  const { openDialog } = useSessionDialog()

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
                <button type="button" className="footer__link" onClick={() => openDialog('create')}>
                  Começar
                </button>
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