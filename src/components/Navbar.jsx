import { useEffect, useState } from 'react'
import Logo from './Logo.jsx'
import Button from './Button.jsx'
import { navLinks } from '../data/navigation.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 900px)')
    const onChange = (event) => {
      if (event.matches) setOpen(false)
    }
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  return (
    <header className={`navbar ${scrolled || open ? 'navbar--solid' : ''}`}>
      <div className="container navbar__inner">
        <Logo />

        <nav className="navbar__nav" aria-label="Principal">
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <a href="#" className="navbar__login">
            Entrar
          </a>
          <Button href="#" size="sm">
            Começar
          </Button>
        </div>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="menu-mobile" className="menu" hidden={!open}>
        <ul className="menu__links">
          {[...navLinks, { label: 'Entrar', href: '#' }].map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={close}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="menu__actions">
          <Button href="#" size="lg" arrow onClick={close}>
            Começar uma sessão
          </Button>
          <Button href="#" variant="ghost" size="lg" onClick={close}>
            Entrar com código
          </Button>
        </div>
      </div>
    </header>
  )
}