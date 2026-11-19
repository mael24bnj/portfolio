import { AnimatePresence, motion } from 'framer-motion'
import { Cell } from '@/components/notebook/Cell'
import { useCellRun } from '@/components/notebook/cell-context'
import { itemVariants, listVariants, SPRING } from '@/components/notebook/motion'
import { NotebookSection } from '@/components/notebook/NotebookSection'
import { useMode } from '@/context/mode'
import { portfolio } from '@/hooks/usePortfolio'

export function Competences() {
  const { mode } = useMode()
  return (
    <NotebookSection id="competences" title="Compétences techniques">
      <Cell n={4} code={`competences["${mode}"].groupby("domaine").agg(list)`}>
        <SkillsTable />
      </Cell>
    </NotebookSection>
  )
}

/** Au changement de mode, les lignes se réordonnent et les outils entrent ou sortent avec un ressort. */
function SkillsTable() {
  const { mode } = useMode()
  const { finished, runId } = useCellRun()
  const groups = portfolio.skills[mode]

  return (
    <div className="overflow-hidden rounded-md border border-rule">
      <div
        aria-hidden="true"
        className="hidden grid-cols-[11rem_minmax(0,1fr)] border-b border-rule bg-cell px-4 py-2 font-mono text-xs text-prompt sm:grid"
      >
        <span>domaine</span>
        <span>outils</span>
      </div>
      <motion.dl key={runId} variants={listVariants} initial="hidden" animate={finished ? 'show' : 'hidden'}>
        {groups.map((group, i) => (
          <motion.div
            layout
            variants={itemVariants}
            transition={SPRING}
            key={group.domain}
            className={`grid gap-2 px-4 py-3.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-0 ${i > 0 ? 'border-t border-rule' : ''} ${
              i % 2 ? 'bg-cell/60' : ''
            }`}
          >
            <motion.dt layout="position" className="font-mono text-sm text-muted sm:pt-0.5">
              {group.domain}
            </motion.dt>
            <dd className="flex flex-wrap gap-1.5">
              <AnimatePresence mode="popLayout" initial={false}>
                {group.items.map((item) => (
                  <motion.span
                    layout
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={SPRING}
                    className="rounded border border-rule bg-cell-raised px-2 py-0.5 font-mono text-xs text-paper/90"
                  >
                    {item}
                  </motion.span>
                ))}
              </AnimatePresence>
            </dd>
          </motion.div>
        ))}
      </motion.dl>
    </div>
  )
}
