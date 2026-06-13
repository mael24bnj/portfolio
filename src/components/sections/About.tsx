import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui'
import data from '../../data/portfolio.json'

export function About() {
  const profile = data.profile || {}

  return (
    <section id="about" className="section-container py-24 md:py-32">
      <SectionHeading label="À propos" title="Qui je suis" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="grid gap-10 md:grid-cols-[1fr_1.2fr]"
      >
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-text-muted">
            {profile.specialization}
          </p>
          <p className="text-chrome-gradient text-3xl font-medium md:text-4xl">
            {profile.location}
          </p>
          <p className="text-text-muted">
            {profile.yearsOfExperience}+ ans d'expérience avec les données
          </p>
        </div>

        <p
          className="text-lg leading-relaxed text-text-primary/90 md:text-xl"
          style={{ wordBreak: 'normal' }}
        >
          {profile.bio}
        </p>
      </motion.div>
    </section>
  )
}