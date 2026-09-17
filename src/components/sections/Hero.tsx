import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion'
import { useProfile } from '@/hooks/usePortfolio'
import { SocialPills } from '@/components/ui'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE },
  },
}

export function Hero() {
  const profile = useProfile()

  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 500], [0, 80])
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] flex-col items-center justify-between px-6 pt-32 pb-10"
    >
      {/* Halo centré dédié à la mise en valeur de l'avatar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-[100px]"
      />

      {/* ── Contenu central ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 my-auto flex w-full max-w-4xl flex-col items-center text-center"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Badge statut */}
          <motion.div
            variants={item}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">
              {profile.role}
            </span>
          </motion.div>

          {/* Titre */}
          <motion.h1
            variants={item}
            className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            <span className="block text-zinc-400">Salut, je suis</span>
            <span className="mt-2 block bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              {profile.shortName}
            </span>
          </motion.h1>

          {/* Avatar flottant */}
          <motion.div variants={item} className="relative my-8 md:my-10">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.05 }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 opacity-50 blur-xl" />
              <motion.div
                aria-hidden="true"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,transparent_0%,rgba(168,85,247,0.8)_25%,transparent_50%,rgba(6,182,212,0.8)_75%,transparent_100%)] p-1"
              />
              <img
                src={profile.avatarSvg}
                alt={profile.name}
                className="relative h-36 w-36 rounded-full border-2 border-white/20 bg-zinc-900 object-cover shadow-2xl md:h-44 md:w-44"
              />
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={item}
            className="mb-8 max-w-xl text-base leading-relaxed text-zinc-300 md:text-lg"
          >
            {profile.tagline}
          </motion.p>

          {/* Séparateur */}
          <motion.div
            variants={item}
            className="mb-8 h-px w-24 bg-gradient-to-r from-transparent via-zinc-600 to-transparent"
          />

          {/* Boutons GitHub / Email */}
          <motion.div variants={item} className="z-20">
            <SocialPills links={profile.social} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Indicateur scroll (bien séparé sous les boutons) ── */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="group z-10 mt-12 flex flex-col items-center gap-2 text-zinc-400 transition-colors hover:text-white"
        aria-label="Faire défiler"
      >
        <span className="text-[10px] font-medium tracking-[0.25em] uppercase">Défiler</span>
        <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-white/20 bg-white/[0.03] p-1 backdrop-blur-sm transition-colors group-hover:border-white/40">
          <motion.span
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="h-1.5 w-1 rounded-full bg-white"
          />
        </span>
      </motion.a>
    </section>
  )
}