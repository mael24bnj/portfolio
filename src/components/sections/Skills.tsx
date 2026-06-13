import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui'
import data from '../../data/portfolio.json'

export function Skills() {
  const categories = data.skills?.categories || []

  return (
    <section id="skills" className="section-container py-24 md:py-32">
      <SectionHeading label="Compétences" title="Outils & technologies" />

      <div className="grid gap-6 sm:grid-cols-2">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="card-dark p-6 md:p-8"
          >
            <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.15em] text-text-muted">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(category.items || []).map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border-subtle px-3 py-1 text-sm text-text-primary/90"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}