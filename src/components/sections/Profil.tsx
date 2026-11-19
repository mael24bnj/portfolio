import { AnimatePresence, motion } from 'framer-motion'
import { Cell } from '@/components/notebook/Cell'
import { useCellRun } from '@/components/notebook/cell-context'
import { SPRING } from '@/components/notebook/motion'
import { NotebookSection } from '@/components/notebook/NotebookSection'
import { useMode } from '@/context/mode'
import { portfolio } from '@/hooks/usePortfolio'

export function Profil() {
  return (
    <NotebookSection id="profil" title="Profil professionnel">
      <Cell n={2} code={'print(mael.profil_professionnel)\nmael.qualites'}>
        <ProfilOutput />
      </Cell>
    </NotebookSection>
  )
}

function ProfilOutput() {
  const { mode } = useMode()
  const { runId } = useCellRun()
  const { summaries, qualities } = portfolio.profile
  const list = qualities[mode]

  return (
    <div key={runId}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={SPRING}
        >
          <p className="max-w-[68ch] text-base leading-relaxed text-paper/90 sm:text-lg">{summaries[mode]}</p>
          <p className="mt-6 font-mono text-sm leading-7 text-paper">
            <span className="text-prompt">[</span>
            {list.map((q, i) => (
              <motion.span
                key={q}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.12 }}
              >
                <span className="tok-str">'{q}'</span>
                {i < list.length - 1 && <span className="text-prompt">, </span>}
              </motion.span>
            ))}
            <span className="text-prompt">]</span>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
