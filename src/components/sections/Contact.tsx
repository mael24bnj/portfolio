import { motion } from 'framer-motion'
import { useProfile } from '@/hooks/usePortfolio'
import { GradientButton, SectionHeading, SocialPills } from '@/components/ui'

export function Contact() {
  const profile = useProfile()
  const emailLink = profile.social.find((s) => s.platform === 'email')

  return (
    <section id="contact" className="section-container py-24 md:py-32">
      <SectionHeading label="Contact" title="Connectons-nous" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="card-dark mx-auto max-w-2xl p-8 text-center md:p-12"
      >
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-text-muted">
          Ouvert aux opportunités
        </p>
        <p className="mb-6 text-lg text-text-primary/90">
          Intéressé à collaborer sur des projets de science des données, d'IA ou de développement full-stack ?
          Contactez-moi — j'aimerais avoir de vos nouvelles.
        </p>

        {emailLink && (
          <GradientButton as="a" href={emailLink.url} className="mb-8">
            Envoyer un email
          </GradientButton>
        )}

        <SocialPills links={profile.social} />
      </motion.div>
    </section>
  )
}
