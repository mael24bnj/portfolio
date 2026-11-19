import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { Cell } from '@/components/notebook/Cell'
import { NotebookSection } from '@/components/notebook/NotebookSection'
import { BrandIcon } from '@/components/ui'
import { portfolio } from '@/hooks/usePortfolio'

export function Contact() {
  const { links, availability } = portfolio.profile
  const email = links.find((l) => l.kind === 'email')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2200)
    return () => window.clearTimeout(id)
  }, [copied])

  async function copyEmail() {
    if (!email) return
    try {
      await navigator.clipboard.writeText(email.display)
      setCopied(true)
    } catch {
      window.location.href = email.url
    }
  }

  return (
    <NotebookSection id="contact" title="Contact" lead={`Disponibilité : ${availability}.`}>
      <Cell n={7} code={'mael.contacter()'}>
        <div className="max-w-2xl">
          {email && (
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={email.url}
                className="rounded-md bg-accent px-5 py-2.5 font-mono text-sm font-medium text-ink transition-[filter] hover:brightness-110"
              >
                Écrire un e-mail
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-md border border-rule px-4 py-2.5 font-mono text-sm text-paper transition-colors hover:border-accent hover:text-accent"
              >
                {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                {copied ? 'Adresse copiée' : "Copier l'adresse"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? 'Adresse e-mail copiée' : ''}
              </span>
            </div>
          )}

          <ul className="mt-8 divide-y divide-rule overflow-hidden rounded-md border border-rule">
            {links.map((l) => (
              <li key={l.kind}>
                <a
                  href={l.url}
                  {...(l.kind === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-cell"
                >
                  <span className="text-muted">
                    <BrandIcon kind={l.kind} size={18} />
                  </span>
                  <span className="hidden w-20 shrink-0 font-mono text-xs text-prompt sm:inline">{l.label}</span>
                  <span className="min-w-0 truncate font-mono text-sm text-paper">{l.display}</span>
                </a>
              </li>
            ))}
          </ul>

          <AnimatePresence>
            {copied && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 font-mono text-xs text-accent"
                aria-hidden="true"
              >
                {"'"}
                {email?.display}
                {"' copiée dans le presse-papiers"}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Cell>
    </NotebookSection>
  )
}
