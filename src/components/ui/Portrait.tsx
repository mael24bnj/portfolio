import type { PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { SOFT_SPRING } from '@/components/notebook/motion'

/** Photo encadrée d'un anneau tournant et d'un halo aux couleurs du mode actif ; s'incline vers le pointeur. */
export function Portrait({ src, alt }: { src: string; alt: string }) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [9, -9]), { stiffness: 180, damping: 18 })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 180, damping: 18 })

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  function onLeave() {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.figure
      className="group relative [perspective:900px]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...SOFT_SPRING, delay: 0.1 }}
    >
      <div
        aria-hidden="true"
        className="portrait-halo absolute -inset-5 rounded-[2.25rem] opacity-35 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
      />
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY }}
        whileHover={reduce ? undefined : { scale: 1.035 }}
        transition={SOFT_SPRING}
        className="portrait-ring relative rounded-[1.6rem] p-[2px] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]"
      >
        <img
          src={src}
          alt={alt}
          width={640}
          height={640}
          fetchPriority="high"
          className="block aspect-square w-full rounded-[1.5rem] bg-paper object-cover"
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-[2px] rounded-[1.5rem] ring-1 ring-white/10 ring-inset" />
      </motion.div>
    </motion.figure>
  )
}
