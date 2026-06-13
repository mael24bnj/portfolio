import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui'
import { useProjects } from '@/hooks/usePortfolio'

export function Projects() {
  const projects = useProjects()

  return (
    <section id="projects" className="section-container py-24 md:py-32">
      <SectionHeading label="Projets" title="Réalisations sélectionnées" />

      <div className="relative">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="sticky top-20 mb-8 md:top-24"
            style={{ zIndex: index + 1 }}
          >
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="card-dark overflow-hidden"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[4/3] overflow-hidden bg-bg-dark md:aspect-auto md:min-h-[320px]">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-card to-bg-dark">
                    <span className="text-6xl font-light text-text-muted/20">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  {project.highlight && (
                    <span className="absolute left-4 top-4 rounded-full bg-accent-gradient px-3 py-1 text-xs font-medium text-white">
                      En vedette
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-center p-6 md:p-10">
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-text-muted">
                    {project.year} · {project.role || 'N/A'}
                  </p>
                  <h3 className="mb-1 text-2xl font-medium text-text-primary md:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mb-4 text-sm text-text-muted">{project.subtitle}</p>
                  <p className="mb-6 text-sm leading-relaxed text-text-primary/80">
                    {project.description}
                  </p>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {(project.stack || []).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border-subtle px-2.5 py-0.5 text-xs text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-text-primary transition-colors hover:text-accent-purple"
                    >
                      Voir le projet
                      <ArrowUpRight size={16} />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm text-text-muted">
                      Lien non disponible
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          </div>
        ))}
      </div>
    </section>
  )
}