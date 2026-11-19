import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { Cell } from '@/components/notebook/Cell'
import { NotebookSection } from '@/components/notebook/NotebookSection'
import { Tag } from '@/components/ui'
import { useMode } from '@/context/mode'
import { portfolio } from '@/hooks/usePortfolio'
import type { ProfileMode, Project } from '@/types/portfolio'

type Filter = ProfileMode | 'tout'

const FILTERS: { id: Filter; label: string; code: string }[] = [
  { id: 'data', label: 'Data, Python et BI', code: 'projets[projets.domaine == "data"]' },
  { id: 'dev_ia', label: 'Web et IA', code: 'projets[projets.domaine == "dev_ia"]' },
  { id: 'tout', label: 'Tout', code: 'projets' },
]

export function Projets() {
  const { mode } = useMode()
  // Le filtre suit le profil choisi, sauf si le visiteur en a choisi un autre depuis.
  const [override, setOverride] = useState<{ mode: ProfileMode; filter: Filter } | null>(null)
  const filter: Filter = override?.mode === mode ? override.filter : mode

  const projects = portfolio.projects
  const visible: Project[] =
    filter === 'tout'
      ? [...projects].sort((a, b) => Number(b.domain === mode) - Number(a.domain === mode))
      : projects.filter((p) => p.domain === filter)
  const current = FILTERS.find((f) => f.id === filter) ?? FILTERS[2]

  return (
    <NotebookSection id="projets" title="Projets techniques & réalisations clés">
      <Cell n={5} code={current.code}>
        <div role="group" aria-label="Domaine des projets" className="mb-5 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const count = f.id === 'tout' ? projects.length : projects.filter((p) => p.domain === f.id).length
            const active = f.id === filter
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setOverride({ mode, filter: f.id })}
                className={`rounded-md border px-3 py-1.5 font-mono text-sm transition-colors ${
                  active ? 'border-accent bg-accent/10 text-accent' : 'border-rule text-muted hover:text-paper'
                }`}
              >
                {f.label} <span className="text-prompt">({count})</span>
              </button>
            )
          })}
        </div>

        <ul className="overflow-hidden rounded-md border border-rule">
          {visible.map((p, i) => (
            <ProjectRow key={`${filter}-${p.id}`} project={p} index={i} defaultOpen={i === 0} />
          ))}
        </ul>
      </Cell>
    </NotebookSection>
  )
}

function ProjectRow({ project: p, index, defaultOpen }: { project: Project; index: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = `projet-${p.id}`

  return (
    <li className={index > 0 ? 'border-t border-rule' : ''}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className={`group grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-4 px-4 py-4 text-left transition-colors sm:px-5 ${
            open ? 'bg-cell' : 'hover:bg-cell/60'
          }`}
        >
          <span className="min-w-0">
            <span className="block font-mono text-xs text-prompt">{p.file}</span>
            <span className="mt-1 block text-lg font-semibold text-paper group-hover:text-accent">{p.title}</span>
            <span className="mt-1 block max-w-[65ch] text-sm leading-relaxed text-muted">{p.context}</span>
          </span>
          <span className="flex items-center gap-4">
            {p.metric && (
              <span className="hidden text-right sm:block">
                <span className="block font-mono text-xl font-bold text-accent">{p.metric.value}</span>
                <span className="block font-mono text-[11px] text-prompt">{p.metric.label}</span>
              </span>
            )}
            <ChevronDown
              size={18}
              aria-hidden="true"
              className={`text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-cell"
          >
            <div className="px-4 pb-6 sm:px-5">
              {p.metric && (
                <p className="font-mono text-sm sm:hidden">
                  <span className="font-bold text-accent">{p.metric.value}</span>{' '}
                  <span className="text-prompt">{p.metric.label}</span>
                </p>
              )}
              <ul className="mt-2 max-w-[70ch] space-y-2 text-sm leading-relaxed text-paper/90">
                {p.points.map((pt) => (
                  <li key={pt} className="grid grid-cols-[1rem_minmax(0,1fr)]">
                    <span aria-hidden="true" className="font-mono text-prompt">
                      -
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
              {p.links && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-rule px-3.5 py-2 font-mono text-sm text-paper transition-colors hover:border-accent hover:text-accent"
                    >
                      {l.label}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
