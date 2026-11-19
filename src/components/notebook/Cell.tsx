import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Play, RotateCw } from 'lucide-react'
import { Code } from './Code'
import { CellRunContext } from './cell-context'

type RunState = 'idle' | 'typing' | 'running' | 'done'

interface CellProps {
  /** Numéro d'exécution affiché dans « In [n] ». */
  n: number
  code: string
  /** Tape le code caractère par caractère avant la première exécution (cellule d'accueil). */
  typing?: boolean
  /** Affiche le repère « Out [n] » devant la sortie. */
  showOut?: boolean
  /** Change de valeur pour relancer la cellule depuis l'extérieur (ex. un réglage modifié). */
  runSignal?: number
  /** Appelé quand le visiteur clique sur « Exécuter ». */
  onRun?: () => void
  /** Durée simulée de l'exécution. */
  runMs?: number
  children?: ReactNode
}

const TYPE_MS_PER_CHAR = 12

/**
 * Cellule de notebook : elle s'exécute la première fois qu'elle entre à l'écran
 * ([ ] → [*] → [n]) puis révèle sa sortie ; le bouton « Exécuter » la relance.
 * La hauteur de la sortie est réservée dès le départ pour que la page ne saute pas.
 */
export function Cell({ n, code, typing = false, showOut = true, runSignal = 0, onRun, runMs = 520, children }: CellProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  // « some » + marge : une très longue cellule (projets sur téléphone) se déclenche aussi.
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const selected = useInView(ref, { margin: '-35% 0px -60% 0px' })
  const [state, setState] = useState<RunState>('idle')
  const [typed, setTyped] = useState(0)
  const [runs, setRuns] = useState(0)
  const [hasRun, setHasRun] = useState(false)

  const finished = state === 'done' || (reduce === true && state === 'idle')

  const run = useCallback(() => {
    setState('running')
    setRuns((r) => r + 1)
  }, [])

  // Première exécution à l'arrivée dans l'écran.
  useEffect(() => {
    if (!inView || state !== 'idle') return
    const id = window.setTimeout(() => {
      if (reduce) {
        setRuns((r) => r + 1)
        setState('done')
      } else {
        setState(typing ? 'typing' : 'running')
      }
    }, 0)
    return () => window.clearTimeout(id)
  }, [inView, reduce, state, typing])

  // Relance demandée de l'extérieur.
  const lastSignal = useRef(runSignal)
  useEffect(() => {
    if (runSignal === lastSignal.current) return
    lastSignal.current = runSignal
    const id = window.setTimeout(run, 0)
    return () => window.clearTimeout(id)
  }, [runSignal, run])

  // La frappe suit l'horloge : un onglet en arrière-plan rattrape son retard d'un coup.
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
    const id = window.setTimeout(
      () => {
        setState('done')
        setHasRun(true)
        setRuns((r) => (r === 0 ? 1 : r))
      },
      reduce ? 0 : runMs,
    )
    return () => window.clearTimeout(id)
  }, [state, runMs, reduce])

  const busy = state === 'running' || state === 'typing'
  const shownCode = typing && state === 'typing' ? code.slice(0, typed) : code
  const marker = finished ? String(n + Math.max(0, runs - 1)) : busy ? '*' : ' '
  const context = useMemo(() => ({ finished, runId: runs }), [finished, runs])
  const outputOpacity = finished ? 1 : hasRun ? 0.35 : 0

  return (
    <div
      ref={ref}
      className={`relative border-l-2 pl-3 transition-colors duration-300 sm:pl-5 ${selected ? 'border-accent' : 'border-transparent'}`}
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-x-4 gap-y-2 md:grid-cols-[5.5rem_minmax(0,1fr)]">
        <span className="pt-2.5 font-mono text-xs text-prompt md:text-right" aria-hidden="true">
          <span className={busy ? 'text-accent' : ''}>In [{marker}]:</span>
        </span>
        <div className="group/cell relative min-w-0 rounded-md border border-rule bg-cell px-4 py-2 pr-12 sm:pr-28">
          <span className="sr-only">Code : </span>
          <Code code={shownCode} caret={state === 'typing'} />
          <button
            type="button"
            onClick={() => {
              run()
              onRun?.()
            }}
            disabled={busy}
            aria-label={`Exécuter la cellule ${n}`}
            className="absolute top-1.5 right-1.5 inline-flex items-center gap-1.5 rounded border border-rule bg-cell-raised px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:cursor-progress disabled:opacity-70"
          >
            {busy ? (
              <RotateCw size={12} aria-hidden="true" className="animate-spin" />
            ) : (
              <Play size={12} aria-hidden="true" className="fill-current" />
            )}
            <span className="hidden sm:inline">{busy ? 'Exécution' : 'Exécuter'}</span>
          </button>
        </div>

        {children && (
          <>
            <span className="hidden pt-1 font-mono text-xs text-prompt md:block md:text-right" aria-hidden="true">
              {showOut && finished ? `Out[${n + Math.max(0, runs - 1)}]:` : ''}
            </span>
            <motion.div
              initial={false}
              animate={{ opacity: outputOpacity, y: finished || hasRun ? 0 : 10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0 pt-2"
              aria-busy={busy}
            >
              <CellRunContext.Provider value={context}>{children}</CellRunContext.Provider>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
