import { useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Cell } from '@/components/notebook/Cell'
import { SPRING } from '@/components/notebook/motion'
import { NotebookSection } from '@/components/notebook/NotebookSection'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectModal } from '@/components/projects/ProjectModal'
import { useMode } from '@/context/mode'
import { portfolio } from '@/hooks/usePortfolio'
import { matchesTab } from '@/lib/tags'
import type { ProfileMode, Project } from '@/types/portfolio'

type Tab = ProfileMode | 'tout'

const TABS: { id: Tab; label: string; code: string }[] = [
  { id: 'data', label: 'Data', code: 'projets[projets.tag.isin(["data", "hybride"])]' },
  { id: 'dev_ia', label: 'Dev & IA', code: 'projets[projets.tag.isin(["dev_ia", "hybride"])]' },
  { id: 'tout', label: 'Tout', code: 'projets' },
]

export function Projets() {
  const { mode } = useMode()
  // L'onglet suit le profil choisi, sauf si le visiteur en a choisi un autre depuis.
  const [override, setOverride] = useState<{ mode: ProfileMode; tab: Tab } | null>(null)
  const tab: Tab = override?.mode === mode ? override.tab : mode
  const [open, setOpen] = useState<Project | null>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)

  const projects = portfolio.projects
  const visible = projects
    .filter((p) => matchesTab(p, tab))
    // en « Tout », les projets du profil affiché passent devant
    .sort((a, b) => (tab === 'tout' ? Number(matchesTab(b, mode)) - Number(matchesTab(a, mode)) : 0))
  const featured = visible.filter((p) => p.featured)
  const others = visible.filter((p) => !p.featured)
  const current = TABS.find((t) => t.id === tab) ?? TABS[2]

  function openProject(p: Project, el: HTMLButtonElement) {
    trigger.current = el
    setOpen(p)
  }

  function closeProject() {
    setOpen(null)
    window.setTimeout(() => trigger.current?.focus(), 0)
  }

  return (
    <NotebookSection
      id="projets"
      title="Projets techniques & réalisations clés"
      lead="Les projets hybrides apparaissent dans les deux onglets. Chaque carte s'ouvre sur le détail et les visuels."
    >
      <Cell n={5} code={current.code}>
        <div role="group" aria-label="Filtrer les projets" className="mb-6 inline-flex rounded-md border border-rule bg-cell p-1">
          {TABS.map((t) => {
            const count = projects.filter((p) => matchesTab(p, t.id)).length
            const active = t.id === tab
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={active}
                onClick={() => setOverride({ mode, tab: t.id })}
                className={`relative rounded px-3 py-1.5 font-mono text-sm whitespace-nowrap transition-colors sm:px-3.5 ${active ? 'text-ink' : 'text-muted hover:text-paper'}`}
              >
                {active && <motion.span layoutId="projets-onglet" transition={SPRING} className="absolute inset-0 rounded bg-accent" />}
                <span className="relative">
                  {t.label} <span className={active ? 'text-ink/70' : 'text-prompt'}>({count})</span>
                </span>
              </button>
            )
          })}
        </div>

        <LayoutGroup>
          <motion.div layout className="grid gap-5 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {featured.map((p) => (
                <ProjectCard key={p.id} project={p} onOpen={openProject} />
              ))}
            </AnimatePresence>
          </motion.div>

          {others.length > 0 && (
            <motion.div layout transition={SPRING}>
              <h3 className="mt-10 mb-4 font-mono text-base font-bold text-paper">
                <span aria-hidden="true" className="mr-2 text-prompt">
                  ###
                </span>
                Autres projets et travaux du BUT
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {others.map((p) => (
                    <ProjectCard key={p.id} project={p} onOpen={openProject} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </LayoutGroup>
      </Cell>

      <AnimatePresence>{open && <ProjectModal key={open.id} project={open} onClose={closeProject} />}</AnimatePresence>
    </NotebookSection>
  )
}
