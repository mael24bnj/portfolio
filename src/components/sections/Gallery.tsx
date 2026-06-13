import { motion } from 'framer-motion'
import { useGallery } from '@/hooks/usePortfolio'
import { SectionHeading } from '@/components/ui'

export function Gallery() {
  const gallery = useGallery()

  return (
    <section id="gallery" className="section-container py-24 md:py-32">
      <SectionHeading label="Galerie" title="Moments & souvenirs" />

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {gallery.map((item, index) => (
          <motion.figure
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border-subtle bg-bg-card"
          >
            <div className="relative overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.altText}
                loading="lazy"
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-full p-4 text-sm text-text-primary transition-transform duration-300 group-hover:translate-y-0">
                {item.altText}
              </figcaption>
            </div>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
