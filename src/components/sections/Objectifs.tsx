import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui'
import data from '@/data/portfolio.json'

export function Objectifs() {
  const objectives = data.objectives || []

  return (
    <section className="py-24 md:py-32">
      <div className="section-container mb-12 md:mb-16">
        <SectionHeading label="Objectifs" title="Mes objectifs professionnels" className="mb-0" />
      </div>

      <div className="space-y-8">
        {objectives.map((obj, index) => {
          const parts = obj.split(' : ')
          const label = parts[0]
          const description = parts[1] ?? ''

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              className="p-6 card-dark border-l-4 border-accent-purple"
            >
              <h3 className="mb-3 text-lg font-medium text-text-primary">
                {label}
              </h3>
              <p className="text-text-muted">
                {description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}