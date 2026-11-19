import { portfolio } from '@/hooks/usePortfolio'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 font-mono text-xs text-prompt sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>
          © {year} {portfolio.profile.name}
        </span>
        <span>Fait avec React, TypeScript et Framer Motion</span>
      </div>
    </footer>
  )
}
