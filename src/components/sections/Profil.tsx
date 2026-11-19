import { Cell } from '@/components/notebook/Cell'
import { NotebookSection } from '@/components/notebook/NotebookSection'
import { useMode } from '@/context/mode'
import { portfolio } from '@/hooks/usePortfolio'

export function Profil() {
  const { mode } = useMode()
  const { summaries, qualities } = portfolio.profile
  const list = qualities[mode]

  return (
    <NotebookSection id="profil" title="Profil professionnel">
      <Cell n={2} code={'print(mael.profil_professionnel)\nmael.qualites'}>
        <p className="max-w-[68ch] text-base leading-relaxed text-paper/90 sm:text-lg">{summaries[mode]}</p>
        <p className="mt-6 font-mono text-sm leading-7 text-paper">
          <span className="text-prompt">[</span>
          {list.map((q, i) => (
            <span key={q}>
              <span className="tok-str">'{q}'</span>
              {i < list.length - 1 && <span className="text-prompt">, </span>}
            </span>
          ))}
          <span className="text-prompt">]</span>
        </p>
      </Cell>
    </NotebookSection>
  )
}
