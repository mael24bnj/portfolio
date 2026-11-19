import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { SPRING } from '@/components/notebook/motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const STEPS = [
  { title: 'Collecter', body: 'Données publiques (INSEE, IRVE), données hospitalières, fichiers bruts.', tools: ['CSV', 'API REST', 'SQL'] },
  { title: 'Nettoyer et modéliser', body: 'Doublons, valeurs manquantes, formats incohérents ; schéma relationnel en 3FN, conforme au RGPD.', tools: ['PostgreSQL', 'MCD / MLD', 'RGPD'] },
  { title: 'Analyser et automatiser', body: 'Statistiques, analyse exploratoire, scripts reproductibles et agents IA connectés à des outils.', tools: ['Python (pandas)', 'R', 'Claude Code'] },
  { title: 'Restituer', body: 'Indicateurs lisibles dans des tableaux de bord, ou intégrés à une application web.', tools: ['Metabase', 'Tableau', 'React'] },
]

const MEDIA = {
  clip: '/media/reseau-neuronal.mp4',
  clipMobile: '/media/reseau-neuronal-mobile.mp4',
  poster: '/media/reseau-neuronal-poster.webp',
  posterMobile: '/media/reseau-neuronal-poster-mobile.webp',
  still: '/media/reseau-neuronal-still.webp',
}

type Presentation = 'scrub' | 'loop' | 'still'

/** Économie de données demandée par le navigateur (Chromium seulement). */
function prefersSavingData(): boolean {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return Boolean(conn?.saveData)
}

/**
 * Section « scroll-world » : une animation 3D de réseau neuronal avance au rythme du défilement.
 * Méthode du skill scroll-world : vidéo chargée en mémoire (Blob, toujours « seekable »),
 * une seule demande de position à la fois, image d'attente extraite de la vidéo encodée,
 * version légère en boucle sur mobile, image fixe si l'animation est réduite ou les données économisées.
 */
export function Pipeline() {
  const reduce = useReducedMotion()
  const small = useMediaQuery('(max-width: 860px), (hover: none) and (pointer: coarse)')
  const [saveData] = useState(prefersSavingData)
  const presentation: Presentation = reduce || saveData ? 'still' : small ? 'loop' : 'scrub'

  return presentation === 'scrub' ? <ScrubStage /> : <LightStage presentation={presentation} />
}

function Heading() {
  return (
    <>
      <h2 id="pipeline-titre" className="font-mono text-2xl font-bold tracking-tight text-paper sm:text-3xl">
        <span aria-hidden="true" className="mr-3 text-prompt">
          ##
        </span>
        Du brut à l'exploitable
      </h2>
      <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-muted">
        Le même réseau, de la donnée brute jusqu'à la restitution : c'est la chaîne que je tiens d'un bout à l'autre.
      </p>
    </>
  )
}

function ScrubStage() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const near = useInView(sectionRef, { margin: '150% 0px 150% 0px', once: true })
  const [src, setSrc] = useState<string | null>(null)
  const [painted, setPainted] = useState(false)
  const [active, setActive] = useState(0)
  const pending = useRef<number | null>(null)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  // Chargement paresseux de la vidéo en Blob quand la section approche.
  useEffect(() => {
    if (!near) return
    let url: string | null = null
    let cancelled = false
    fetch(MEDIA.clip)
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((blob) => {
        if (cancelled) return
        url = URL.createObjectURL(blob)
        setSrc(url)
      })
      .catch(() => {
        // Pas de vidéo : l'image d'attente reste affichée.
      })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [near])

  function seek(progress: number) {
    const v = videoRef.current
    if (!v || !v.duration || Number.isNaN(v.duration)) return
    const t = Math.min(v.duration - 0.04, Math.max(0, progress * v.duration))
    if (v.seeking) {
      pending.current = t // une seule demande à la fois : on garde la plus récente
      return
    }
    v.currentTime = t
  }

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    seek(p)
    setActive(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length * 0.999)))
  })

  function onSeeked() {
    setPainted(true)
    const v = videoRef.current
    if (v && pending.current !== null) {
      const t = pending.current
      pending.current = null
      v.currentTime = t
    }
  }

  return (
    <section ref={sectionRef} id="pipeline" aria-labelledby="pipeline-titre" className="relative h-[420vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <img src={MEDIA.poster} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        {src && (
          <video
            ref={videoRef}
            src={src}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            onLoadedMetadata={() => seek(scrollYProgress.get())}
            onSeeked={onSeeked}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${painted ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        {/* lisibilité du texte et raccord avec le fond de la page */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />

        <div className="relative mx-auto grid h-full max-w-5xl content-center px-4 sm:px-6 md:grid-cols-[5.5rem_minmax(0,1fr)] md:gap-x-4">
          <span aria-hidden="true" className="hidden md:block" />
          <div className="max-w-md border-l-2 border-transparent pl-3 sm:pl-5 md:pl-0">
            <Heading />

            <ol className="mt-10 space-y-1" aria-label="Étapes">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative">
                  <div className="flex items-center gap-3 font-mono text-sm">
                    <span className={`w-6 transition-colors ${i === active ? 'text-accent' : 'text-prompt'}`}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={`transition-colors ${i === active ? 'text-paper' : 'text-muted'}`}>{s.title}</span>
                  </div>
                  <AnimatePresence initial={false}>
                    {i === active && (
                      <motion.div
                        key="detail"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={SPRING}
                        className="overflow-hidden pl-9"
                      >
                        <p className="pt-2 text-[15px] leading-relaxed text-paper/90">{s.body}</p>
                        <p className="flex flex-wrap gap-1.5 pt-3 pb-4">
                          {s.tools.map((t) => (
                            <span key={t} className="rounded border border-rule bg-ink/70 px-2 py-0.5 font-mono text-xs text-paper/85">
                              {t}
                            </span>
                          ))}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-rule/60">
          <motion.div style={{ scaleX: barScale }} className="h-full origin-left bg-accent" />
        </div>
      </div>
    </section>
  )
}

/** Téléphones : la vidéo légère tourne en boucle ; animation réduite : une image fixe. */
function LightStage({ presentation }: { presentation: Exclude<Presentation, 'scrub'> }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { margin: '200px 0px' })
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (visible) v.play().catch(() => {})
    else v.pause()
  }, [visible])

  return (
    <section id="pipeline" aria-labelledby="pipeline-titre" className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <div className="border-l-2 border-transparent pl-3 sm:pl-5">
        <Heading />
      </div>
      <div ref={ref} className="relative mt-8 aspect-video overflow-hidden rounded-lg border border-rule bg-ink">
        {presentation === 'loop' ? (
          <video
            ref={videoRef}
            src={MEDIA.clipMobile}
            poster={MEDIA.posterMobile}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <img src={MEDIA.still} alt="" aria-hidden="true" loading="lazy" className="h-full w-full object-cover" />
        )}
      </div>
      <ol className="mt-8 grid gap-5 sm:grid-cols-2">
        {STEPS.map((s, i) => (
          <li key={s.title} className="border-l-2 border-rule pl-4">
            <p className="font-mono text-sm">
              <span className="mr-2 text-accent">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-paper">{s.title}</span>
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-paper/85">{s.body}</p>
            <p className="mt-2 font-mono text-xs text-prompt">{s.tools.join(' · ')}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
