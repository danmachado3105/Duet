import { footerLinks } from '../../data/navigation.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="logo">DUET</span>
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

        <p className="footer__note">
          Projeto em desenvolvimento · © {new Date().getFullYear()} DUET
        </p>
      </div>
    </footer>
  )
}