import { TAG_LABELS } from '@/lib/tags'
import type { ProjectTag } from '@/types/portfolio'

const STYLES: Record<ProjectTag, string> = {
  data: 'border-amber/40 bg-amber/10 text-amber',
  dev_ia: 'border-green/40 bg-green/10 text-green',
  hybride: 'border-paper/25 bg-paper/5 text-paper',
}

/** Badge de domaine : vert pour Dev & IA, ambre pour Data, les deux pour Hybride. */
export function TagBadge({ tag }: { tag: ProjectTag }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[11px] ${STYLES[tag]}`}>
      <span aria-hidden="true" className="flex gap-0.5">
        {tag !== 'data' && <span className="size-1.5 rounded-full bg-green" />}
        {tag !== 'dev_ia' && <span className="size-1.5 rounded-full bg-amber" />}
      </span>
      {TAG_LABELS[tag]}
    </span>
  )
}
