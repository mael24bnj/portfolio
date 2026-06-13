import { Navbar, Footer } from '@/components/layout'
import {
  Hero,
  About,
  Experience,
  Skills,
  Projects,
  Objectifs,
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
        <Contact />
        <Gallery />
      </main>
      <Footer />
    </>
  )
}
