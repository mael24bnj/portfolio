import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, LoaderCircle } from 'lucide-react'
import { Cell } from '@/components/notebook/Cell'
import { useCellRun } from '@/components/notebook/cell-context'
import { SPRING } from '@/components/notebook/motion'
import { NotebookSection } from '@/components/notebook/NotebookSection'
import { useMode } from '@/context/mode'
import { portfolio } from '@/hooks/usePortfolio'
import { matchesTab, TAG_LABELS } from '@/lib/tags'
import type { ProjectTag } from '@/types/portfolio'

export function Demo() {
  const { mode } = useMode()
  return (
    <NotebookSection
      id="demo"
      title="Démo interactive"
      lead={
        mode === 'dev_ia'
          ? "Posez une question à un agent qui appelle des outils pour lire les données de ce site. Choisir une question exécute la cellule ; « Exécuter » la relance."
          : 'Explorez les données de ce portfolio comme dans pandas : choisissez un regroupement et un filtre, la cellule se relance.'
      }
    >
      {mode === 'dev_ia' ? <AgentDemo /> : <DataDemo />}
    </NotebookSection>
  )
}

/* ------------------------------------------------------------------ Agent */

interface ToolCall {
  name: string
  args: string
  result: string
}

interface Question {
  id: string
  label: string
  prompt: string
  tools: ToolCall[]
  answer: string
}

function buildQuestions(): Question[] {
  const { profile, education, projects } = portfolio
  const iaProjects = projects.filter((p) => matchesTab(p, 'dev_ia'))
  const orchestration = projects.find((p) => p.id === 'orchestration')
  const dataProjects = projects.filter((p) => matchesTab(p, 'data'))

  return [
    {
      id: 'projets-ia',
      label: 'Quels projets en IA ?',
      prompt: 'Quels sont les projets de Maël en IA ?',
      tools: [
        { name: 'lire_profil', args: '', result: `1 profil, ${profile.roles.dev_ia}` },
        { name: 'chercher_projets', args: 'tag="dev_ia"', result: `${iaProjects.length} projets (hybrides compris)` },
      ],
      answer:
        `Maël a ${iaProjects.length} projets côté développement et IA : ${iaProjects.map((p) => `« ${p.title} »`).join(', ')}. ` +
        (orchestration?.metric
          ? `Le plus complet est « ${orchestration.title} » : Claude Code guidé par des skills, serveurs MCP et ${orchestration.metric.value} ${orchestration.metric.label}.`
          : ''),
    },
    {
      id: 'data',
      label: 'Et côté data ?',
      prompt: "Qu'a-t-il fait en analyse de données ?",
      tools: [
        { name: 'chercher_projets', args: 'tag="data"', result: `${dataProjects.length} projets (hybrides compris)` },
        { name: 'trier', args: 'par="mise_en_avant"', result: 'ok' },
      ],
      answer:
        `${dataProjects.length} projets touchent à la donnée. Les principaux : ` +
        dataProjects
          .filter((p) => p.featured)
          .map((p) => (p.metric ? `« ${p.title} » (${p.metric.value} ${p.metric.label})` : `« ${p.title} »`))
          .join(', ') +
        '.',
    },
    {
      id: 'formation',
      label: 'Quelle formation ?',
      prompt: 'Quelle formation suit-il ?',
      tools: [{ name: 'lire_formation', args: '', result: `${education.length} formations` }],
      answer: education.map((e) => `${e.title}${e.school ? `, ${e.school}` : ''} (${e.years})${e.note ? ` : ${e.note.toLowerCase()}` : ''}`).join('. ') + '.',
    },
    {
      id: 'dispo',
      label: 'Est-il disponible ?',
      prompt: 'Est-il disponible pour une alternance ?',
      tools: [
        { name: 'lire_profil', args: '', result: '1 profil' },
        { name: 'verifier_disponibilite', args: '', result: profile.availability },
      ],
      answer: `Oui : il cherche une ${profile.search.toLowerCase()}, disponibilité ${profile.availability}. Il est basé à ${profile.location}, mobilité ${profile.mobility}. Contact : ${profile.links.find((l) => l.kind === 'email')?.display ?? ''}.`,
    },
  ]
}

const QUESTIONS = buildQuestions()

function AgentDemo() {
  const questions = QUESTIONS
  const [qid, setQid] = useState(questions[0].id)
  const [signal, setSignal] = useState(0)
  const q = questions.find((x) => x.id === qid) ?? questions[0]
  const code = `reponse = agent.run(\n    "${q.prompt}",\n    outils=[${[...new Set(q.tools.map((t) => t.name))].join(', ')}],\n)\nprint(reponse)`

  return (
    <Cell n={6} code={code} runSignal={signal} runMs={300}>
      <div role="group" aria-label="Question posée à l'agent" className="mb-5 flex flex-wrap gap-2">
        {questions.map((x) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={x.id === qid}
            onClick={() => {
              setQid(x.id)
              setSignal((s) => s + 1)
            }}
            className={`rounded-md border px-3 py-1.5 font-mono text-sm transition-colors ${
              x.id === qid ? 'border-accent bg-accent/10 text-accent' : 'border-rule text-muted hover:text-paper'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <AgentTrace question={q} />
      <p className="mt-4 text-xs text-prompt">
        Simulation dans le navigateur : aucun appel réseau, l'agent lit uniquement les données de ce site.
      </p>
    </Cell>
  )
}

function AgentTrace({ question }: { question: Question }) {
  const { finished, runId } = useCellRun()
  return <AgentRun key={`${runId}-${question.id}`} question={question} active={finished} />
}

const TOOL_MS = 520
const CHAR_MS = 14

function AgentRun({ question, active }: { question: Question; active: boolean }) {
  const [step, setStep] = useState(0) // nombre d'outils terminés
  const [chars, setChars] = useState(0)
  const [durations] = useState(() => question.tools.map(() => 90 + Math.round(Math.random() * 260)))
  const toolsDone = step >= question.tools.length

  useEffect(() => {
    if (!active || toolsDone) return
    const id = window.setTimeout(() => setStep((s) => s + 1), TOOL_MS)
    return () => window.clearTimeout(id)
  }, [active, step, toolsDone])

  useEffect(() => {
    if (!active || !toolsDone) return
    const start = performance.now()
    const total = question.answer.length
    let id = 0
    const tick = () => {
      const n = Math.min(total, Math.floor((performance.now() - start) / CHAR_MS))
      setChars(n)
      if (n < total) id = window.setTimeout(tick, 30)
    }
    tick()
    return () => window.clearTimeout(id)
  }, [active, toolsDone, question.answer])

  const streaming = toolsDone && chars < question.answer.length

  return (
    <div className="overflow-hidden rounded-md border border-rule bg-ink/60 font-mono text-[13px]" aria-live="polite">
      <ol className="divide-y divide-rule/60">
        {question.tools.map((t, i) => {
          const done = i < step
          const running = active && i === step
          if (!done && !running) return null
          return (
            <motion.li
              key={`${t.name}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={SPRING}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5"
            >
              {done ? (
                <Check size={14} aria-hidden="true" className="text-accent" />
              ) : (
                <LoaderCircle size={14} aria-hidden="true" className="animate-spin text-accent-2" />
              )}
              <span className="text-paper">
                <span className="tok-fn">{t.name}</span>({t.args && <span className="tok-str">{t.args}</span>})
              </span>
              <span className="text-prompt">{done ? `→ ${t.result} · ${durations[i]} ms` : 'appel en cours…'}</span>
            </motion.li>
          )
        })}
      </ol>
      {toolsDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-rule bg-cell/70 px-4 py-4 font-sans text-[15px] leading-relaxed text-paper"
        >
          {question.answer.slice(0, chars)}
          {streaming && <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-accent" />}
        </motion.div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ Data */

type GroupBy = 'outils' | 'tag' | 'annee'
type Filter = 'tout' | ProjectTag

const GROUPS: { id: GroupBy; label: string }[] = [
  { id: 'outils', label: 'Outils' },
  { id: 'tag', label: 'Domaine' },
  { id: 'annee', label: 'Année' },
]
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'tout', label: 'Tous' },
  { id: 'data', label: TAG_LABELS.data },
  { id: 'dev_ia', label: TAG_LABELS.dev_ia },
  { id: 'hybride', label: TAG_LABELS.hybride },
]

function DataDemo() {
  const [by, setBy] = useState<GroupBy>('outils')
  const [filter, setFilter] = useState<Filter>('tout')
  const [signal, setSignal] = useState(0)

  const base = filter === 'tout' ? 'projets' : `projets[projets.tag == "${filter}"]`
  const code =
    by === 'outils'
      ? `(${base}\n    .explode("outils")\n    .groupby("outils").size()\n    .nlargest(8))`
      : `${base}.groupby("${by}").size().sort_values(ascending=False)`

  function choose<T>(setter: (v: T) => void, v: T) {
    setter(v)
    setSignal((s) => s + 1)
  }

  return (
    <Cell n={6} code={code} runSignal={signal} runMs={380}>
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Segmented label="Regrouper par" options={GROUPS} value={by} onChange={(v) => choose(setBy, v)} />
        <Segmented label="Filtrer" options={FILTERS} value={filter} onChange={(v) => choose(setFilter, v)} />
      </div>
      <DataResult by={by} filter={filter} />
    </Cell>
  )
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-xs text-prompt">{label}</span>
      <div role="group" aria-label={label} className="inline-flex rounded-md border border-rule bg-cell p-0.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={o.id === value}
            onClick={() => onChange(o.id)}
            className={`rounded px-2.5 py-1 font-mono text-xs transition-colors ${
              o.id === value ? 'bg-accent text-ink' : 'text-muted hover:text-paper'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function DataResult({ by, filter }: { by: GroupBy; filter: Filter }) {
  const { finished, runId } = useCellRun()
  const rows = portfolio.projects.filter((p) => filter === 'tout' || p.tag === filter)

  const counts = new Map<string, number>()
  for (const p of rows) {
    const keys = by === 'outils' ? p.stack : by === 'tag' ? [TAG_LABELS[p.tag]] : [p.year]
    for (const k of keys) counts.set(k, (counts.get(k) ?? 0) + 1)
  }
  const series = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'fr')).slice(0, 8)
  const max = Math.max(1, ...series.map(([, n]) => n))

  return (
    <div className="rounded-md border border-rule bg-ink/60 p-4 font-mono text-[13px]">
      <ul key={runId} className="space-y-2">
        {series.map(([k, n], i) => (
          <li key={k} className="grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)_2rem] items-center gap-3">
            <span className="truncate text-paper/90" title={k}>
              {k}
            </span>
            <span className="h-4 overflow-hidden rounded-sm bg-cell-raised">
              <motion.span
                className="block h-full rounded-sm bg-accent"
                initial={{ width: 0 }}
                animate={{ width: finished ? `${(n / max) * 100}%` : 0 }}
                transition={{ ...SPRING, delay: finished ? i * 0.05 : 0 }}
              />
            </span>
            <span className="text-right text-accent">{n}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-prompt">
        Name: count, dtype: int64 · {rows.length} projets lus, {counts.size} groupes
        {series.length < counts.size ? ` (les ${series.length} premiers)` : ''}
      </p>
    </div>
  )
}
