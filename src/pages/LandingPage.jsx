import SessionDialogProvider from '../context/SessionDialogProvider.jsx'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../sections/Hero.jsx'
import HowItWorks from '../sections/HowItWorks.jsx'
import Problem from '../sections/Problem.jsx'
import InAction from '../sections/InAction.jsx'
import Compatibility from '../sections/Compatibility.jsx'
import FinalCta from '../sections/FinalCta.jsx'

export default function LandingPage() {
  return (
    <SessionDialogProvider>
      <div id="top">
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Navbar />
        <main id="conteudo">
          <Hero />
          <HowItWorks />
          <Problem />
          <InAction />
          <Compatibility />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </SessionDialogProvider>
  )
}