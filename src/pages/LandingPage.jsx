import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../sections/Hero.jsx'
import Impasse from '../sections/Impasse.jsx'
import HowItWorks from '../sections/HowItWorks.jsx'
import Difference from '../sections/Difference.jsx'
import FinalCta from '../sections/FinalCta.jsx'

export default function LandingPage() {
  return (
    <div id="top">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Impasse />
        <HowItWorks />
        <Difference />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}