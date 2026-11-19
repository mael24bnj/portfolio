import { motion } from 'framer-motion'
import { MODE_LABELS, useMode } from '@/context/mode'
import type { ProfileMode } from '@/types/portfolio'

const MODES: ProfileMode[] = ['dev_ia', 'data']

/** Bascule entre le profil « Dev Python & IA » et le profil « Data Analyst ». */
export function ModeSwitch({ size = 'md', layoutId }: { size?: 'sm' | 'md'; layoutId: string }) {
  const { mode, setMode } = useMode()
  const pad = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'

  return (
    <div role="radiogroup" aria-label="Profil affiché" className="inline-flex rounded-md border border-rule bg-cell p-0.5 font-mono">
      {MODES.map((m) => {
        const active = m === mode
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setMode(m)}
            className={`relative rounded-[5px] ${pad} transition-colors ${active ? 'text-ink' : 'text-muted hover:text-paper'}`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-[5px] bg-accent"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative">{MODE_LABELS[m]}</span>
          </button>
        )
      })}
    </div>
  )
}
