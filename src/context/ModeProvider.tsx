import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ProfileMode } from '@/types/portfolio'
import { ModeContext } from './mode'

const STORAGE_KEY = 'portfolio-mode'

function readStoredMode(): ProfileMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'data' ? 'data' : 'dev_ia'
  } catch {
    return 'dev_ia'
  }
}

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ProfileMode>(readStoredMode)

  useEffect(() => {
    document.documentElement.dataset.mode = mode
    try {
      window.localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // Stockage indisponible (navigation privée) : le choix reste en mémoire.
    }
  }, [mode])

  const value = useMemo(() => ({ mode, setMode }), [mode])
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}
