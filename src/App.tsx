import { MotionConfig } from 'framer-motion'
import { Navbar, Footer } from '@/components/layout'
import { Hero, Profil, Formation, Competences, Projets, Contact } from '@/components/sections'
import { ModeProvider } from '@/context/ModeProvider'

export default function App() {
  return (
    <ModeProvider>
      <MotionConfig reducedMotion="user">
        <a
          href="#profil"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-ink"
        >
          Aller au contenu
        </a>
        <Navbar />
        <main>
          <Hero />
          <Profil />
          <Formation />
          <Competences />
          <Projets />
          <Contact />
        </main>
        <Footer />
      </MotionConfig>
    </ModeProvider>
  )
}
