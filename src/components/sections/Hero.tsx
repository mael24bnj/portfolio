import { AnimatePresence, motion } from 'framer-motion'
import { Cell } from '@/components/notebook/Cell'
import { BrandIcon, ModeSwitch } from '@/components/ui'
import { useMode } from '@/context/mode'
import { portfolio } from '@/hooks/usePortfolio'

export function Hero() {
  const { mode } = useMode()
  const { profile } = portfolio
  const code = `from candidats import Candidat\n\nmael = Candidat("${profile.name}")\nmael.profil(mode="${mode}")`
  const facts = [
    { key: 'recherche', value: profile.search },
    { key: 'disponibilité', value: profile.availability },
    { key: 'lieu', value: profile.location },
    { key: 'mobilité', value: profile.mobility },
  ]

  return (
    <section id="accueil" aria-labelledby="accueil-titre" className="mx-auto w-full max-w-5xl px-4 pt-28 pb-16 sm:px-6 md:pt-36 md:pb-24">
      <Cell n={1} code={code} typing>
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_13rem] md:gap-10">
          <div className="min-w-0">
            <h1 id="accueil-titre" className="font-mono text-[2.6rem] leading-[1.05] font-bold tracking-tight text-paper sm:text-6xl lg:text-7xl">
              {profile.name}
            </h1>

            <div className="mt-4 min-h-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={mode}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-xl text-accent sm:text-2xl"
                >
                  {profile.roles[mode]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted">Voir le profil</span>
              <ModeSwitch layoutId="mode-hero" />
            </div>

            <dl className="mt-8 grid max-w-xl grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2 font-mono text-sm">
              {facts.map((f) => (
                <div key={f.key} className="contents">
                  <dt className="text-prompt">{f.key}</dt>
                  <dd className="text-paper">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#projets"
                className="rounded-md bg-accent px-5 py-2.5 font-mono text-sm font-medium text-ink transition-[filter] hover:brightness-110"
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
            </div>
          </div>

          <figure className="order-first w-32 self-start overflow-hidden rounded-md border border-rule bg-cell sm:w-40 md:order-none md:w-full">
            <img
              src={profile.photo}
              alt={`Portrait de ${profile.name}`}
              width={489}
              height={652}
              className="aspect-[3/4] w-full object-cover"
            />
          </figure>
        </div>
      </Cell>
    </section>
  )
}
