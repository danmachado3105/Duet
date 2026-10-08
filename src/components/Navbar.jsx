import { useEffect, useRef, useState } from 'react'
import Logo from './Logo.jsx'
import Button from './Button.jsx'
import { navLinks } from '../data/navigation.js'
import { useSessionDialog } from '../context/sessionDialogContext.js'

export default function Navbar() {
  const { openDialog } = useSessionDialog()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const progressRef = useRef(null)
  const close = () => setOpen(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0
      progressRef.current?.style.setProperty('--progress', progress.toFixed(3))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
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

  const openFromMenu = (mode) => {
    close()
    openDialog(mode)
  }

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
          <button type="button" className="navbar__login" onClick={() => openDialog('join')}>
            Entrar
          </button>
          <Button size="sm" onClick={() => openDialog('create')}>
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

      <span className="navbar__progress" ref={progressRef} aria-hidden="true" />

      <div id="menu-mobile" className="menu" hidden={!open}>
        <ul className="menu__links">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={close}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="menu__actions">
          <Button size="lg" arrow onClick={() => openFromMenu('create')}>
            Começar uma sessão
          </Button>
          <Button variant="ghost" size="lg" onClick={() => openFromMenu('join')}>
            Entrar com código
          </Button>
        </div>
      </div>
    </header>
  )
}