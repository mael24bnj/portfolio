import type { ReactNode } from 'react'

interface SectionHeadingProps {
  label: string
  title: string
  className?: string
  children?: ReactNode
}

export function SectionHeading({
  label,
  title,
  className = '',
  children,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 md:mb-16 ${className}`}>
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-text-muted">
        {label}
      </p>
      <h2 className="text-chrome-gradient text-4xl font-semibold leading-tight md:text-5xl">
        {title}
      </h2>
      {children}
    </div>
  )
}
