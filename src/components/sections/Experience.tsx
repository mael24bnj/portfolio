import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui'
import data from '../../data/portfolio.json'

export function Experience() {
  const experience = data.experience || []

  return (
    <section className="section-container py-24 md:py-32">
      <SectionHeading label="Expérience" title="Où j'ai travaillé" />

      <div className="space-y-0">
        {experience.map((item, index) => {
          const num = String(index + 1).padStart(2, '0')
          return (
            <motion.article
              key={`${item.company}-${item.period}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="grid gap-6 border-t border-border-subtle py-10 md:grid-cols-[120px_1fr] md:gap-10"
            >
              <div className="text-chrome-gradient text-5xl font-light md:text-6xl">
                {num}
              </div>

              <div>
                <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-xl font-medium text-text-primary">
                    {item.role}
                  </h3>
                  <span className="text-sm text-text-muted">{item.period}</span>
                </div>

                <p className="mb-1 text-sm text-text-muted">
                  {item.company} · {item.location}
                </p>
                <p className="mb-4 text-text-primary/80">{item.summary}</p>

                <ul className="space-y-2">
                  {item.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-3 text-sm text-text-muted before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-accent-purple before:content-['']"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}