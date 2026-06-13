import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui'

export function Objectifs() {
  return (
    <section className="py-24 md:py-32">
      <div className="section-container mb-12 md:mb-16">
        <SectionHeading label="Objectifs" title="Mes objectifs professionnels" className="mb-0" />
      </div>

      <div className="space-y-8">
        {/* Long terme */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="p-6 card-dark border-l-4 border-accent-purple"
        >
          <h3 className="mb-3 text-lg font-medium text-text-primary">
            Long terme
          </h3>
          <p className="text-text-muted">
            Travailler dans la DATA et l'IA.
          </p>
        </motion.div>

        {/* Moyen terme */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 card-dark border-l-4 border-accent-purple"
        >
          <h3 className="mb-3 text-lg font-medium text-text-primary">
            Moyen terme
          </h3>
          <p className="text-text-muted">
            Finir mes études de BUT Science des Données.
          </p>
        </motion.div>

        {/* Court terme */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="p-6 card-dark border-l-4 border-accent-purple"
        >
          <h3 className="mb-3 text-lg font-medium text-text-primary">
            Court terme
          </h3>
          <p className="text-text-muted">
            Enrichir mes compétences et devenir plus assidu au sein de la formation BUT SD.
          </p>
        </motion.div>
      </div>
    </section>
  )
}