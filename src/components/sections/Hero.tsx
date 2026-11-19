import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { Cell } from '@/components/notebook/Cell'
import { useCellRun } from '@/components/notebook/cell-context'
import { SPRING } from '@/components/notebook/motion'
import { BrandIcon, ModeSwitch, Portrait } from '@/components/ui'
import { useMode } from '@/context/mode'
import { portfolio } from '@/hooks/usePortfolio'

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const rise: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: SPRING } }

export function Hero() {
  const { mode } = useMode()
  const code = `from candidats import Candidat\n\nmael = Candidat("${portfolio.profile.name}")\nmael.profil(mode="${mode}")`

  return (
    <section id="accueil" aria-labelledby="accueil-titre" className="mx-auto w-full max-w-5xl px-4 pt-28 pb-16 sm:px-6 md:pt-36 md:pb-24">
      <Cell n={1} code={code} typing>
        <HeroOutput />
      </Cell>
    </section>
  )
}

function HeroOutput() {
  const { mode } = useMode()
  const { finished, runId } = useCellRun()
  const { profile } = portfolio
  const facts = [
    { key: 'recherche', value: profile.search },
    { key: 'disponibilité', value: profile.availability },
    { key: 'lieu', value: profile.location },
    { key: 'mobilité', value: profile.mobility },
  ]

  return (
    <motion.div
      key={runId}
      variants={stagger}
      initial="hidden"
      animate={finished ? 'show' : 'hidden'}
      className="grid gap-10 md:grid-cols-[minmax(0,1fr)_15rem] md:gap-12"
    >
      <div className="min-w-0">
        <motion.h1
          variants={rise}
          id="accueil-titre"
          className="font-mono text-[2.6rem] leading-[1.05] font-bold tracking-tight text-paper sm:text-6xl lg:text-7xl"
        >
          {profile.name}
        </motion.h1>

        <motion.div variants={rise} className="mt-4 min-h-8 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={mode}
              initial={{ opacity: 0, y: 26, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -26, filter: 'blur(4px)' }}
              transition={SPRING}
              className="font-mono text-xl text-accent sm:text-2xl"
            >
              {profile.roles[mode]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div variants={rise} className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted">Voir le profil</span>
          <ModeSwitch layoutId="mode-hero" />
        </motion.div>

        <motion.dl variants={rise} className="mt-8 grid max-w-xl grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2 font-mono text-sm">
          {facts.map((f) => (
            <div key={f.key} className="contents">
              <dt className="text-prompt">{f.key}</dt>
              <dd className="text-paper">{f.value}</dd>
            </div>
          ))}
        </motion.dl>

        <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#projets"
            className="rounded-md bg-accent px-5 py-2.5 font-mono text-sm font-medium text-ink transition-[filter,transform] hover:brightness-110 active:scale-[0.97]"
          >
            Voir les projets
          </a>
          <a
            href="#contact"
            className="rounded-md border border-rule px-5 py-2.5 font-mono text-sm text-paper transition-colors hover:border-accent hover:text-accent"
          >
            Me contacter
          </a>
          {profile.links
            .filter((l) => l.kind !== 'email')
            .map((l) => (
              <a
                key={l.kind}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={l.label}
                className="grid size-10 place-items-center rounded-md border border-rule text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <BrandIcon kind={l.kind} size={17} />
              </a>
            ))}
        </motion.div>
      </div>

      <motion.div variants={rise} className="order-first w-40 self-start sm:w-48 md:order-none md:w-full">
        <Portrait src={profile.photo} alt={`Photo de ${profile.name}`} />
      </motion.div>
    </motion.div>
  )
}
