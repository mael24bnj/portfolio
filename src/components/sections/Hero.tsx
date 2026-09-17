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
  hidden: { opacity: 0, y: 32, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE },
  },
}

export function Hero() {
  const profile = useProfile()

  // Parallaxe au scroll
  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 600], [0, 100])
  const contentOpacity = useTransform(scrollY, [0, 450], [1, 0])
  const orbY = useTransform(scrollY, [0, 600], [0, -60])

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16"
    >
      {/* ── Décor 1 : Halos lumineux animés (Violet / Indigo / Cyan) ── */}
      <motion.div
        aria-hidden
        style={{ y: orbY }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 50, -20, 0],
            scale: [1, 1.1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-cyan-500/20 blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 left-1/3 h-[400px] w-[400px] rounded-full bg-fuchsia-600/15 blur-[140px]"
        />
      </motion.div>

      {/* ── Décor 2 : Grille technique texturée ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_45%,black_20%,transparent_80%)]"
      />

      {/* ── Contenu central ── */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          {/* Badge statut avec halo */}
          <motion.div
            variants={item}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">
              {profile.role}
            </span>
          </motion.div>

          {/* Titre avec dégradé texte */}
          <motion.h1
            variants={item}
            className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            <span className="block text-zinc-400">Salut, je suis</span>
            <span className="mt-2 block bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              {profile.shortName}
            </span>
          </motion.h1>

          {/* Avatar flottant avec anneau lumineux */}
          <motion.div variants={item} className="relative my-8 md:my-10">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.05 }}
              className="relative flex items-center justify-center"
            >
              {/* Lueur arrière */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 opacity-40 blur-xl" />

              {/* Anneau rotatif */}
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,transparent_0%,rgba(168,85,247,0.8)_25%,transparent_50%,rgba(6,182,212,0.8)_75%,transparent_100%)] p-1"
              />

              {/* Image avatar */}
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

          {/* Ligne séparatrice stylisée */}
          <motion.div
            variants={item}
            className="mb-8 h-px w-28 bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent"
          />

          {/* Boutons réseaux / contact */}
          <motion.div variants={item}>
            <SocialPills links={profile.social} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Indicateur scroll souris ── */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="group absolute bottom-6 z-10 flex flex-col items-center gap-2 text-zinc-400 transition-colors hover:text-white"
        aria-label="Faire défiler jusqu'à la section À propos"
      >
        <span className="text-[10px] font-medium tracking-[0.25em] uppercase">Défiler</span>
        <span className="relative flex h-10 w-6 items-start justify-center rounded-full border border-white/15 bg-white/[0.02] p-1 backdrop-blur-sm transition-colors group-hover:border-white/30">
          <motion.span
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-2 w-1 rounded-full bg-white"
          />
        </span>
      </motion.a>
    </section>
  )
}