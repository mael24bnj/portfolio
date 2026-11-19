import type { ReactNode } from 'react'

interface NotebookSectionProps {
  id: string
  title: string
  /** Courte phrase sous le titre, comme le texte d'une cellule Markdown. */
  lead?: string
  children: ReactNode
}

/** Une cellule Markdown (le titre) suivie des cellules de code de la section. */
export function NotebookSection({ id, title, lead, children }: NotebookSectionProps) {
  const headingId = `${id}-titre`
  return (
    <section id={id} aria-labelledby={headingId} className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 md:py-20">
      <div className="mb-8 border-l-2 border-transparent pl-3 sm:pl-5 md:grid md:grid-cols-[5.5rem_minmax(0,1fr)] md:gap-x-4">
        <span aria-hidden="true" />
        <div>
          <h2 id={headingId} className="font-mono text-2xl font-bold tracking-tight text-paper sm:text-3xl">
            <span aria-hidden="true" className="mr-3 text-prompt">
              ##
            </span>
            {title}
          </h2>
          {lead && <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-muted">{lead}</p>}
        </div>
      </div>
      <div className="space-y-10">{children}</div>
    </section>
  )
}
