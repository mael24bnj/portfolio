import { motion } from 'framer-motion'
import { Cell } from '@/components/notebook/Cell'
import { useCellRun } from '@/components/notebook/cell-context'
import { itemVariants, listVariants } from '@/components/notebook/motion'
import { NotebookSection } from '@/components/notebook/NotebookSection'
import { portfolio } from '@/hooks/usePortfolio'

export function Formation() {
  return (
    <NotebookSection id="formation" title="Formation">
      <Cell n={3} code={'formation.sort_values("annees", ascending=False)'}>
        <FormationTable />
      </Cell>
    </NotebookSection>
  )
}

function FormationTable() {
  const { finished, runId } = useCellRun()
  const { education } = portfolio

  return (
    <div className="overflow-hidden rounded-md border border-rule">
      <div
        aria-hidden="true"
        className="hidden grid-cols-[2.5rem_8rem_minmax(0,1fr)] border-b border-rule bg-cell px-4 py-2 font-mono text-xs text-prompt sm:grid"
      >
        <span />
        <span>annees</span>
        <span>formation</span>
      </div>
      <motion.ol key={runId} variants={listVariants} initial="hidden" animate={finished ? 'show' : 'hidden'}>
        {education.map((e, i) => (
          <motion.li
            variants={itemVariants}
            key={e.title}
            className={`grid gap-1 px-4 py-4 sm:grid-cols-[2.5rem_8rem_minmax(0,1fr)] sm:gap-0 ${i > 0 ? 'border-t border-rule' : ''} ${
              e.current ? 'bg-accent/[0.06]' : i % 2 ? 'bg-cell/60' : ''
            }`}
          >
            <span className="hidden font-mono text-xs text-prompt sm:block sm:pt-0.5">{i}</span>
            <span className={`font-mono text-sm ${e.current ? 'text-accent' : 'text-muted'}`}>{e.years}</span>
            <div className="min-w-0">
              <p className="font-medium text-paper">{e.title}</p>
              {e.school && <p className="text-sm text-muted">{e.school}</p>}
              {e.note && <p className={`mt-1.5 text-sm ${e.current ? 'text-accent' : 'text-paper/80'}`}>{e.note}</p>}
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  )
}
