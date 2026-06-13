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
    <>
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
    </>
  )
}