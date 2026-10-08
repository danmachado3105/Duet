import { useEffect, useState } from 'react'
import Button from '../ui/Button.jsx'
import { navLinks } from '../../data/navigation.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a href="#top" className="logo" aria-label="DUET, início">
          DUET
        </a>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={open}
          aria-controls="menu-principal"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="menu-principal"
          className={`navbar__nav ${open ? 'is-open' : ''}`}
          aria-label="Principal"
        >
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={close}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href="#" size="sm" onClick={close}>
            Começar
          </Button>
        </nav>
      </div>
    </header>
  )
}