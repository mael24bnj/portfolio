import type { Transition, Variants } from 'framer-motion'

/** Ressort commun : rapide, sans rebond exagéré. */
export const SPRING: Transition = { type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }
export const SOFT_SPRING: Transition = { type: 'spring', stiffness: 220, damping: 26 }

/** Liste dont les éléments apparaissent l'un après l'autre quand la cellule a fini de s'exécuter. */
export const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: SPRING },
}
