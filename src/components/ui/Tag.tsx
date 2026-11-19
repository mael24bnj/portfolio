import type { ReactNode } from 'react'

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded border border-rule bg-cell-raised px-2 py-0.5 font-mono text-xs text-paper/90">
      {children}
    </span>
  )
}
