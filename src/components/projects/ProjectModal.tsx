import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { SOFT_SPRING, SPRING } from '@/components/notebook/motion'
import { Tag, TagBadge } from '@/components/ui'
import type { Project } from '@/types/portfolio'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Garde le focus clavier à l'intérieur d'un conteneur. */
function trapTab(e: KeyboardEvent<HTMLElement>) {
  if (e.key !== 'Tab') return
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE))
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

export function ProjectModal({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const [zoom, setZoom] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const images = p.images ?? []
  const titleId = `modal-${p.id}-titre`

  useEffect(() => {
    closeRef.current?.focus()
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [])

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      if (zoom !== null) setZoom(null)
      else onClose()
      return
    }
    if (zoom !== null && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      const step = e.key === 'ArrowRight' ? 1 : -1
      setZoom((z) => (z === null ? z : (z + step + images.length) % images.length))
      return
    }
    trapTab(e)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={onKeyDown}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={SOFT_SPRING}
        className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-xl border border-rule bg-cell shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] sm:rounded-xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-rule bg-cell/95 px-5 py-3 backdrop-blur">
          <span className="flex min-w-0 items-center gap-3">
            <span className="truncate font-mono text-xs text-prompt">{p.file}</span>
            <TagBadge tag={p.tag} />
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fermer le détail du projet"
            className="grid size-9 shrink-0 place-items-center rounded-md border border-rule text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-5 pt-5 pb-7 sm:px-7">
          <h2 id={titleId} className="text-2xl font-semibold text-paper">
            {p.title}
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            {p.context} <span className="font-mono text-prompt">({p.year})</span>
          </p>

          {p.metric && (
            <p className="mt-4 font-mono">
              <span className="text-2xl font-bold text-accent">{p.metric.value}</span>{' '}
              <span className="text-sm text-prompt">{p.metric.label}</span>
            </p>
          )}

          {images.length > 0 && (
            <ul className={`mt-6 grid gap-2 ${images.length === 1 ? '' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
              {images.map((img, i) => (
                <li key={img.src} className={images.length > 2 && i === 0 ? 'col-span-2 sm:col-span-3' : ''}>
                  <button
                    type="button"
                    onClick={() => setZoom(i)}
                    aria-label={`Agrandir : ${img.alt}`}
                    className="group relative block w-full overflow-hidden rounded-md border border-rule bg-ink"
                  >
                    <img
                      src={i === 0 && images.length > 2 ? img.src : img.thumb}
                      alt={img.alt}
                      loading="lazy"
                      className={`w-full transition-transform duration-500 group-hover:scale-[1.04] ${
                        images.length === 1 ? 'max-h-[26rem] object-contain' : 'aspect-[16/10] object-cover'
                      }`}
                    />
                    <span className="absolute top-2 right-2 grid size-7 place-items-center rounded bg-ink/80 text-paper opacity-0 transition-opacity group-hover:opacity-100">
                      <ZoomIn size={14} aria-hidden="true" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <ul className="mt-6 space-y-2.5 text-[15px] leading-relaxed text-paper/90">
            {p.points.map((pt, i) => (
              <motion.li
                key={pt}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...SPRING, delay: 0.1 + i * 0.05 }}
                className="grid grid-cols-[1.1rem_minmax(0,1fr)]"
              >
                <span aria-hidden="true" className="font-mono text-accent">
                  ›
                </span>
                <span>{pt}</span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>

          {p.links && (
            <div className="mt-6 flex flex-wrap gap-2">
              {p.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-rule px-3.5 py-2 font-mono text-sm text-paper transition-colors hover:border-accent hover:text-accent"
                >
                  {l.label}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}

          {p.credit && <p className="mt-6 border-t border-rule pt-4 text-xs leading-relaxed text-prompt">{p.credit}</p>}
        </div>
      </motion.div>

      <AnimatePresence>
        {zoom !== null && images[zoom] && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-black/92"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setZoom(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Visuel agrandi"
          >
            <div className="flex items-center justify-between px-4 py-3 font-mono text-xs text-muted">
              <span>
                {zoom + 1} / {images.length}
              </span>
              <button
                type="button"
                autoFocus
                onClick={() => setZoom(null)}
                aria-label="Fermer le visuel"
                className="grid size-9 place-items-center rounded-md border border-rule text-paper hover:border-accent hover:text-accent"
              >
                <X size={17} />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-3 sm:px-16">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={images[zoom].src}
                  src={images[zoom].src}
                  alt={images[zoom].alt}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={SOFT_SPRING}
                  className="max-h-full max-w-full rounded-md object-contain"
                />
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setZoom((zoom - 1 + images.length) % images.length)}
                    aria-label="Visuel précédent"
                    className="absolute left-2 grid size-10 place-items-center rounded-full border border-rule bg-ink/80 text-paper hover:border-accent hover:text-accent sm:left-4"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom((zoom + 1) % images.length)}
                    aria-label="Visuel suivant"
                    className="absolute right-2 grid size-10 place-items-center rounded-full border border-rule bg-ink/80 text-paper hover:border-accent hover:text-accent sm:right-4"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            <p className="px-4 pb-4 text-center text-sm text-muted">{images[zoom].alt}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
