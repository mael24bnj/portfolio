import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui'
import data from '../../data/portfolio.json'

export function PourquoiSD() {
  const pourquoiSD = data.pourquoiSD

  return (
    <section id="pourquoi-sd" className="section-container py-24 md:py-32">
      <div className="section-container mb-12 md:mb-16">
        <SectionHeading label="Pourquoi SD" title={pourquoiSD.title} className="mb-0" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="prose prose-lg max-w-none text-text-primary/90"
      >
        {pourquoiSD.content}
      </motion.div>
    </section>
  )
}