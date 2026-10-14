import ShowcaseProvider from '../context/ShowcaseProvider.jsx'
import { useShowcase } from '../context/showcaseContext.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../sections/Hero.jsx'
import Explore from '../sections/Explore.jsx'
import HowItWorks from '../sections/HowItWorks.jsx'
import Problem from '../sections/Problem.jsx'
import InAction from '../sections/InAction.jsx'
import Differentials from '../sections/Differentials.jsx'
import FinalCta from '../sections/FinalCta.jsx'

function LandingContent() {
  const { status } = useShowcase()

  return (
    // data-loading: enquanto a TMDB responde, os textos da vitrine viram esqueletos (ver landing.css)
    <div id="top" data-loading={status === 'loading'}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Explore />
        <HowItWorks />
        <Problem />
        <InAction />
        <Differentials />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}

export default function LandingPage() {
  return (
    <ShowcaseProvider>
      <LandingContent />
    </ShowcaseProvider>
  )
}