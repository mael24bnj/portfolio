import { createContext, useContext } from 'react'

export interface CellRun {
  /** La sortie de la cellule est affichée (exécution terminée). */
  finished: boolean
  /** Augmente à chaque exécution : sert de clé pour rejouer les animations de sortie. */
  runId: number
}

export const CellRunContext = createContext<CellRun>({ finished: true, runId: 0 })

export function useCellRun(): CellRun {
  return useContext(CellRunContext)
}
