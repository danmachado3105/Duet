import { Link, Outlet, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import SessionProgress from './SessionProgress.jsx'
import { ROUTES, stepIndexFor } from '../utils/sessionFlow.js'

export default function SessionLayout() {
  const { pathname } = useLocation()

  return (
    <div className="session">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="session__bar">
        <div className="container session__bar-inner">
          <Logo to={ROUTES.home} />
          <SessionProgress current={stepIndexFor(pathname)} />
          <Link to={ROUTES.home} className="session__exit">
            Sair
          </Link>
        </div>
      </header>

      <main id="conteudo" className="session__main">
        {/* A key reinicia a animação de entrada a cada etapa */}
        <div key={pathname} className="session__page">
          <Outlet />
        </div>
      </main>
    </div>
  )
}