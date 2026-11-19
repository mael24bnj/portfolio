import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ModeSwitch } from '@/components/ui'
import { portfolio } from '@/hooks/usePortfolio'
import { NAV_ITEMS } from '@/lib/constants'

/** Barre d'outils du notebook : nom du fichier, sections, profil affiché. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? 'border-rule bg-ink/90 backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
    >
      <nav aria-label="Navigation principale" className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 md:h-16">
        <a href="#accueil" className="flex min-w-0 items-center gap-2 font-mono text-sm text-paper" onClick={() => setOpen(false)}>
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-accent" />
          <span className="truncate">
            {portfolio.profile.handle}
            <span className="text-prompt">.ipynb</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded px-2.5 py-1.5 font-mono text-[13px] text-muted transition-colors hover:bg-cell hover:text-paper"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ModeSwitch size="sm" layoutId="mode-nav" />
          </div>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-md text-paper lg:hidden"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-rule bg-ink lg:hidden"
          >
            <ul className="mx-auto flex max-w-5xl flex-col px-4 py-3 sm:px-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="block py-2.5 font-mono text-sm text-paper" onClick={() => setOpen(false)}>
                    <span className="mr-2 text-prompt">##</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mx-auto max-w-5xl px-4 pb-4 sm:hidden">
              <ModeSwitch layoutId="mode-menu" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
