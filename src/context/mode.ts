import { createContext, useContext } from 'react'
import type { ProfileMode } from '@/types/portfolio'

export interface ModeState {
  mode: ProfileMode
  setMode: (mode: ProfileMode) => void
}

export const ModeContext = createContext<ModeState | null>(null)

export const MODE_LABELS: Record<ProfileMode, string> = {
  dev_ia: 'Dev IA',
  data: 'Data',
}

export function useMode(): ModeState {
  const state = useContext(ModeContext)
  if (!state) throw new Error('useMode doit être utilisé dans <ModeProvider>')
  return state
}
