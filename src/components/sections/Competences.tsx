import { Cell } from '@/components/notebook/Cell'
import { NotebookSection } from '@/components/notebook/NotebookSection'
import { Tag } from '@/components/ui'
import { useMode } from '@/context/mode'
import { portfolio } from '@/hooks/usePortfolio'

export function Competences() {
  const { mode } = useMode()
  const groups = portfolio.skills[mode]

  return (
    <NotebookSection id="competences" title="Compétences techniques">
      <Cell n={4} code={`competences["${mode}"].groupby("domaine").agg(list)`}>
        <div className="overflow-hidden rounded-md border border-rule">
          <div
            aria-hidden="true"
            className="hidden grid-cols-[11rem_minmax(0,1fr)] border-b border-rule bg-cell px-4 py-2 font-mono text-xs text-prompt sm:grid"
          >
            <span>domaine</span>
            <span>outils</span>
          </div>
          <dl>
            {groups.map((group, i) => (
              <div
                key={group.domain}
                className={`grid gap-2 px-4 py-3.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-0 ${i > 0 ? 'border-t border-rule' : ''} ${
                  i % 2 ? 'bg-cell/60' : ''
                }`}
              >
                <dt className="font-mono text-sm text-muted sm:pt-0.5">{group.domain}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Cell>
    </NotebookSection>
  )
}
