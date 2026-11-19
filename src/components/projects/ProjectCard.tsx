import { forwardRef, type PointerEvent } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { Images, Maximize2 } from 'lucide-react'
import { SPRING } from '@/components/notebook/motion'
import { TagBadge } from '@/components/ui'
import type { Project } from '@/types/portfolio'

interface ProjectCardProps {
  project: Project
  onOpen: (project: Project, trigger: HTMLButtonElement) => void
}

/**
 * Carte de projet : projecteur qui suit le pointeur et légère inclinaison 3D au survol
 * (coupés si le système demande moins d'animations). Un clic ouvre le détail.
 */
export const ProjectCard = forwardRef<HTMLElement, ProjectCardProps>(function ProjectCard({ project: p, onOpen }, ref) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(-400)
  const my = useMotionValue(-400)
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)
  const rotateX = useSpring(useTransform(ny, [-0.5, 0.5], [5, -5]), { stiffness: 220, damping: 20 })
  const rotateY = useSpring(useTransform(nx, [-0.5, 0.5], [-6, 6]), { stiffness: 220, damping: 20 })
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, color-mix(in srgb, var(--accent) 17%, transparent), transparent 65%)`
  const cover = p.featured ? p.images?.[0] : undefined

  function onMove(e: PointerEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
    if (!reduce && e.pointerType === 'mouse') {
      nx.set((e.clientX - r.left) / r.width - 0.5)
      ny.set((e.clientY - r.top) / r.height - 0.5)
    }
  }

  function onLeave() {
    nx.set(0)
    ny.set(0)
  }

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
      transition={SPRING}
      className="[perspective:1000px]"
    >
      <motion.button
        type="button"
        onClick={(e) => onOpen(p, e.currentTarget)}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY }}
        whileTap={{ scale: 0.985 }}
        aria-haspopup="dialog"
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-rule bg-cell text-left transition-colors duration-300 hover:border-accent/60"
      >
        <motion.span
          aria-hidden="true"
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {cover && (
          <span className="relative block aspect-[16/9] overflow-hidden border-b border-rule bg-ink">
            <img
              src={cover.thumb}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            {p.images && p.images.length > 1 && (
              <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded bg-ink/80 px-2 py-0.5 font-mono text-[11px] text-paper backdrop-blur">
                <Images size={12} aria-hidden="true" />
                {p.images.length} visuels
              </span>
            )}
          </span>
        )}

        <span className={`flex flex-1 flex-col ${p.featured ? 'p-5' : 'p-4'}`}>
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-xs text-prompt">{p.file}</span>
            <TagBadge tag={p.tag} />
          </span>
          <span className={`mt-2 block font-semibold text-paper transition-colors group-hover:text-accent ${p.featured ? 'text-lg' : 'text-base'}`}>
            {p.title}
          </span>
          <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-muted">{p.context}</span>

          {p.metric && (
            <span className="mt-3 flex items-baseline gap-2 font-mono">
              <span className="text-xl font-bold text-accent">{p.metric.value}</span>
              <span className="text-xs text-prompt">{p.metric.label}</span>
            </span>
          )}

          <span className="mt-auto flex items-end justify-between gap-3 pt-4">
            <span className="flex flex-wrap gap-1.5">
              {p.stack.slice(0, p.featured ? 5 : 3).map((s) => (
                <span key={s} className="rounded border border-rule bg-cell-raised px-1.5 py-0.5 font-mono text-[11px] text-paper/85">
                  {s}
                </span>
              ))}
            </span>
            <Maximize2
              size={15}
              aria-hidden="true"
              className="shrink-0 text-prompt transition-[color,transform] duration-300 group-hover:scale-110 group-hover:text-accent"
            />
          </span>
        </span>
      </motion.button>
    </motion.article>
  )
})
