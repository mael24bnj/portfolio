import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useProfile } from '@/hooks/usePortfolio'
import { SocialPills } from '@/components/ui'

export function Hero() {
  const profile = useProfile()

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-4 text-sm uppercase tracking-[0.3em] text-text-muted"
        >
          {profile.role}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-chrome-gradient text-5xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Hi, I&apos;m {profile.shortName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative my-10"
        >
          <div className="absolute -inset-1 rounded-full bg-accent-gradient opacity-40 blur-xl" />
          <img
            src={profile.avatarSvg}
            alt={profile.name}
            className="relative h-36 w-36 rounded-full border-2 border-border-subtle object-cover md:h-44 md:w-44"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mb-8 max-w-xl text-lg text-text-muted md:text-xl"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <SocialPills links={profile.social} />
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-text-muted transition-colors hover:text-text-primary"
        aria-label="Scroll to about section"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
        <ArrowDown size={18} className="animate-bounce" />
      </motion.a>
    </section>
  )
}
