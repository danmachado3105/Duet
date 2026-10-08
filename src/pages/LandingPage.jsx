import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Hero from '../components/landing/Hero.jsx'
import HowItWorks from '../components/landing/HowItWorks.jsx'
import Compatibility from '../components/landing/Compatibility.jsx'
import FinalCta from '../components/landing/FinalCta.jsx'

export default function LandingPage() {
  return (
    <div id="top">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <HowItWorks />
        <Compatibility />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}