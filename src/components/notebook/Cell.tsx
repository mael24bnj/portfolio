import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Code } from './Code'

type RunState = 'idle' | 'typing' | 'running' | 'done'

interface CellProps {
  /** Numéro d'exécution affiché dans « In [n] ». */
  n: number
  code: string
  /** Tape le code caractère par caractère avant de l'exécuter (cellule d'accueil). */
  typing?: boolean
  /** Affiche le repère « Out [n] » devant la sortie. */
  showOut?: boolean
  children?: ReactNode
}

const RUN_MS = 520
const TYPE_MS_PER_CHAR = 12

/**
 * Cellule de notebook : elle s'exécute la première fois qu'elle entre à l'écran
 * ([ ] → [*] → [n]) puis révèle sa sortie. La hauteur de la sortie est réservée
 * dès le départ pour que la page ne saute pas pendant le défilement.
 */
export function Cell({ n, code, typing = false, showOut = true, children }: CellProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const selected = useInView(ref, { margin: '-35% 0px -60% 0px' })
  const [state, setState] = useState<RunState>('idle')
  const [typed, setTyped] = useState(0)

  const finished = reduce || state === 'done'

  useEffect(() => {
    if (!inView || reduce || state !== 'idle') return
    const id = window.setTimeout(() => setState(typing ? 'typing' : 'running'), 0)
    return () => window.clearTimeout(id)
  }, [inView, reduce, state, typing])

  // La frappe suit l'horloge, pas le nombre de minuteurs : un onglet ouvert en
  // arrière-plan (minuteurs ralentis par le navigateur) rattrape son retard d'un coup.
  useEffect(() => {
    if (state !== 'typing') return
    const start = performance.now()
    const total = code.length
    let id = 0
    const tick = () => {
      const chars = Math.min(total, Math.floor((performance.now() - start) / TYPE_MS_PER_CHAR))
      setTyped(chars)
      if (chars >= total) id = window.setTimeout(() => setState('running'), 160)
      else id = window.setTimeout(tick, TYPE_MS_PER_CHAR)
    }
    tick()
    return () => window.clearTimeout(id)
  }, [state, code.length])

  useEffect(() => {
    if (state !== 'running') return
    const id = window.setTimeout(() => setState('done'), RUN_MS)
    return () => window.clearTimeout(id)
  }, [state])

  const shownCode = typing && !finished && state !== 'running' ? code.slice(0, typed) : code
  const marker = finished ? String(n) : state === 'running' || state === 'typing' ? '*' : ' '

  return (
    <div
      ref={ref}
      className={`relative border-l-2 pl-3 transition-colors duration-300 sm:pl-5 ${
        selected ? 'border-accent' : 'border-transparent'
      }`}
    >
      <div className="grid gap-x-4 gap-y-2 md:grid-cols-[5.5rem_minmax(0,1fr)]">
        <span className="pt-2.5 font-mono text-xs text-prompt md:text-right" aria-hidden="true">
          <span className={state === 'running' || state === 'typing' ? 'text-accent' : ''}>In [{marker}]:</span>
        </span>
        <div className="rounded-md border border-rule bg-cell px-4 py-2">
          <span className="sr-only">Code exécuté : </span>
          <Code code={shownCode} caret={state === 'typing'} />
        </div>

        {children && (
          <>
            <span className="hidden pt-1 font-mono text-xs text-prompt md:block md:text-right" aria-hidden="true">
              {showOut && finished ? `Out[${n}]:` : ''}
            </span>
            <motion.div
              initial={false}
              animate={finished ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0 pt-2"
            >
              {children}
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
