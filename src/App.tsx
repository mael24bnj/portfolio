import { Navbar, Footer } from '@/components/layout'
import {
  Hero,
  About,
  Experience,
  Skills,
  Projects,
  Objectifs,
  PourquoiSD,
  Contact,
  Gallery,
} from '@/components/sections'

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-white selection:bg-violet-500/30">
      {/* ── 1. Grille technique visible sur TOUT le portfolio ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      {/* ── 2. Halos lumineux d'ambiance fixes ── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Halo violet haut gauche */}
        <div className="absolute -top-32 left-1/4 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]" />
        {/* Halo cyan centre droit */}
        <div className="absolute top-1/2 -right-20 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px]" />
        {/* Halo fuchsia bas gauche */}
        <div className="absolute -bottom-32 left-10 h-[500px] w-[500px] rounded-full bg-fuchsia-600/15 blur-[140px]" />
      </div>

      {/* ── 3. Contenu au premier plan ── */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Objectifs />
          <PourquoiSD />
          <Contact />
          <Gallery />
        </main>
        <Footer />
      </div>
    </div>
  )
}