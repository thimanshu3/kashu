'use client'

import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion'
import {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
  type SVGProps
} from 'react'

type DepthKey = '0.0m' | '15.0m' | '30.0m' | '45.0m'
type PatternName = 'sandstone' | 'shale' | 'igneous'
type OrnamentKind = 'flower' | 'heart'

type Stratum = {
  depth: DepthKey
  stratum: string
  title: string
  subtitle: string
  label: string
  date: string
  body: string
  pattern: PatternName
  photoLabel: string
  photoHint: string
  photoAlt: string
  tags: string[]
  src?: string
}

const depthMarkers: Array<{ depth: DepthKey; zone: string; note: string }> = [
  { depth: '0.0m', zone: 'Surface Contact', note: 'Foundation forming.' },
  { depth: '15.0m', zone: 'Layered Bond', note: 'Connection compacting.' },
  { depth: '30.0m', zone: 'Pressure Zone', note: 'Strength under heat.' },
  { depth: '45.0m', zone: 'Core Reveal', note: 'The proposal chamber.' }
]

const strata: Stratum[] = [
  {
    depth: '0.0m',
    stratum: 'Stratum I',
    title: 'Sandstone',
    subtitle: 'Unconsolidated Beginnings',
    label:
      'SAMPLE_01: SANDSTONE (Unconsolidated Beginnings) | DEPTH: 0.0m | March 15',
    date: 'March 15',
    body: "It started in Nathdwara at Bhua's house. We went to Trinetra circle, but my favorite memory is from that late night. We were supposed to be watching a movie, but I spent the entire time just watching you. Like loose grains of sand, our foundation started forming.",
    pattern: 'sandstone',
    photoLabel: 'Haanji aapki hi pooja karenge',
    photoHint: 'Drop your Nathdwara memory here',
    photoAlt: 'Placeholder for your Nathdwara couple photo',
    tags: ['Nathdwara', 'Trinetra circle', 'The first trace'],
    src: '/1.jpg'
  },
  {
    depth: '15.0m',
    stratum: 'Stratum II',
    title: 'Shale',
    subtitle: 'Fine Layers of Connection',
    label:
      'SAMPLE_02: SHALE (Fine Layers of Connection) | DEPTH: 15.0m | June 21',
    date: 'June 21',
    body: 'Jodhpur, Ajit Bhawan Palace. Our first real meet, our first hug, our first kiss. This was the era of fine layers, listening to you talk endlessly about the geology topics you were learning at your ONGC internship. Every conversation was a new layer of falling for you.',
    pattern: 'shale',
    photoLabel: 'aapki baat bhi saari maan lenge',
    photoHint: 'Add your Ajit Bhawan Palace photo',
    photoAlt: 'Placeholder for your Jodhpur couple photo',
    tags: ['Ajit Bhawan Palace', 'ONGC internship', 'Every layer mattered'],
    src: '/2.jpg'
  },
  {
    depth: '30.0m',
    stratum: 'Stratum III',
    title: 'Igneous',
    subtitle: 'Crystallized Under Pressure',
    label:
      'SAMPLE_03: IGNEOUS (Crystallized Under Pressure) | DEPTH: 30.0m | July 6',
    date: 'July 6',
    body: "Igneous rock is formed under intense heat and pressure. When things got tough, when your family wasn't sure about us, we didn't fracture. We held on tighter. From that pressure came beautiful days like our trip to Udaipur, praying at Bohra Ganesh Ji temple, and walking through Pot Garden. We became unbreakable.",
    pattern: 'igneous',
    photoLabel: 'Jo bhi chahiye, aapke sath hi chahiye',
    photoHint: 'Place your Udaipur photo here',
    photoAlt: 'Placeholder for your Udaipur couple photo',
    tags: ['Udaipur', 'Bohra Ganesh Ji', 'Pressure made us stronger'],
    src: '/3.jpg'
  }
]

const borniteGradient =
  'linear-gradient(135deg, #140d22 0%, #492477 18%, #1c557c 34%, #17809d 48%, #bb7c2b 66%, #4b2477 84%, #0f3246 100%)'

const geologicFloaters = [
  { top: '12%', left: '10%', size: '0.65rem', delay: 0.1 },
  { top: '18%', right: '16%', size: '0.45rem', delay: 0.45 },
  { top: '36%', left: '16%', size: '0.35rem', delay: 0.3 },
  { top: '58%', right: '11%', size: '0.55rem', delay: 0.62 },
  { bottom: '18%', left: '8%', size: '0.7rem', delay: 0.2 },
  { bottom: '12%', right: '23%', size: '0.5rem', delay: 0.54 }
]

const proposalOrnaments: Array<{
  type: OrnamentKind
  top?: string
  right?: string
  bottom?: string
  left?: string
  size: number
  delay: number
  rotate: number
}> = [
  { type: 'flower', top: '8%', left: '4%', size: 124, delay: 0.1, rotate: -18 },
  { type: 'heart', top: '15%', right: '8%', size: 72, delay: 0.35, rotate: 14 },
  {
    type: 'flower',
    bottom: '12%',
    left: '8%',
    size: 156,
    delay: 0.55,
    rotate: -10
  },
  {
    type: 'heart',
    bottom: '18%',
    right: '12%',
    size: 96,
    delay: 0.2,
    rotate: -12
  },
  {
    type: 'flower',
    top: '42%',
    right: '4%',
    size: 110,
    delay: 0.68,
    rotate: 22
  },
  { type: 'heart', top: '56%', left: '7%', size: 68, delay: 0.42, rotate: -20 }
]

const confettiColors = ['#B85D3D', '#43B3AE', '#D8CCFF', '#F7E6B2', '#F4F1EA']

const riddles = [
  {
    question:
      'I form from heat and pressure deep below, the kind that made us stronger, not letting go. What rock am I?',
    answer: 'igneous',
    hint: 'Think about Stratum III.'
  },
  {
    question:
      'Layer by layer, fine grains compact, holding every quiet moment intact. What rock am I?',
    answer: 'shale',
    hint: 'Think about our Jodhpur night.'
  },
  {
    question:
      'The city where we first traced our beginnings, loose and unshaped, like sand just settling. Name the city.',
    answer: 'nathdwara',
    hint: "Bhua's house, remember?"
  }
]

function svgDataUri(svg: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

function imagePlaceholder(label: string, hint: string) {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <rect width="1200" height="900" fill="#F4F1EA"/>
      <rect x="40" y="40" width="1120" height="820" rx="36" fill="none" stroke="#4A3B32" stroke-width="4" stroke-dasharray="18 18" opacity="0.72"/>
      <line x1="120" y1="150" x2="1080" y2="150" stroke="#4A3B32" stroke-width="2" opacity="0.15"/>
      <line x1="120" y1="740" x2="1080" y2="740" stroke="#4A3B32" stroke-width="2" opacity="0.15"/>
      <text x="600" y="390" text-anchor="middle" fill="#4A3B32" font-family="Georgia, serif" font-size="72">${label}</text>
      <text x="600" y="490" text-anchor="middle" fill="#B85D3D" font-family="Courier New, monospace" font-size="28" letter-spacing="5">${hint}</text>
      <text x="600" y="620" text-anchor="middle" fill="#43B3AE" font-family="Courier New, monospace" font-size="22" letter-spacing="6">REPLACE_SRC_WITH_YOUR_PHOTO</text>
    </svg>
  `)}`
}

const draftingPaperStyle: CSSProperties = {
  backgroundImage: [
    'radial-gradient(circle at top, rgba(255,255,255,0.88), transparent 42%)',
    'linear-gradient(rgba(74,59,50,0.05) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(74,59,50,0.05) 1px, transparent 1px)'
  ].join(', '),
  backgroundSize: '100% 100%, 36px 36px, 36px 36px'
}

const contourStyle: CSSProperties = {
  backgroundImage: svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900" fill="none">
      <path d="M0 150C120 90 200 90 310 150C440 220 520 220 650 160C810 85 910 90 1030 168C1150 246 1240 252 1400 180" stroke="rgba(74,59,50,0.14)" stroke-width="2.2"/>
      <path d="M0 300C120 240 220 242 340 304C452 362 560 364 676 308C828 232 944 236 1088 316C1208 384 1286 390 1400 342" stroke="rgba(184,93,61,0.14)" stroke-width="2"/>
      <path d="M0 470C132 412 240 416 352 476C470 540 578 544 700 486C832 422 944 426 1072 492C1192 554 1280 560 1400 518" stroke="rgba(74,59,50,0.12)" stroke-width="2"/>
      <path d="M0 646C138 586 252 590 372 650C488 710 592 712 726 654C862 594 980 596 1118 660C1246 718 1324 720 1400 694" stroke="rgba(67,179,174,0.12)" stroke-width="2"/>
    </svg>
  `),
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}

const fieldNoteStyle: CSSProperties = {
  backgroundImage: [
    'linear-gradient(rgba(74,59,50,0.06) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(74,59,50,0.04) 1px, transparent 1px)'
  ].join(', '),
  backgroundSize: '28px 28px, 28px 28px'
}

const sectionBackgroundStyles: Record<PatternName, CSSProperties> = {
  sandstone: {
    backgroundImage: [
      'linear-gradient(180deg, #fbf6ec 0%, #f3e4c5 28%, #e1c293 60%, #9d6b43 100%)',
      'radial-gradient(circle at 20% 16%, rgba(255,255,255,0.55), transparent 20%)',
      'radial-gradient(circle at 78% 80%, rgba(184,93,61,0.18), transparent 28%)'
    ].join(', ')
  },
  shale: {
    backgroundImage: [
      'linear-gradient(180deg, #f6efe3 0%, #d9c7b3 18%, #b89680 40%, #7d6455 72%, #4f4038 100%)',
      'repeating-linear-gradient(180deg, rgba(255,255,255,0.14) 0 2px, transparent 2px 18px, rgba(74,59,50,0.15) 18px 20px, transparent 20px 38px)',
      'radial-gradient(circle at 82% 24%, rgba(67,179,174,0.08), transparent 22%)'
    ].join(', ')
  },
  igneous: {
    backgroundImage: [
      'linear-gradient(180deg, #4b3d35 0%, #261f1c 46%, #101010 100%)',
      'radial-gradient(circle at 22% 74%, rgba(184,93,61,0.24), transparent 24%)',
      'radial-gradient(circle at 74% 18%, rgba(67,179,174,0.16), transparent 18%)',
      'radial-gradient(circle at 50% 48%, rgba(255,255,255,0.05), transparent 18%)'
    ].join(', ')
  }
}

const patternStyles: Record<PatternName, CSSProperties> = {
  sandstone: {
    backgroundImage: [
      'radial-gradient(circle at 24px 24px, rgba(184,93,61,0.24) 0 2px, transparent 2px)',
      'radial-gradient(circle at 10px 10px, rgba(74,59,50,0.12) 0 1.5px, transparent 1.5px)',
      'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))'
    ].join(', '),
    backgroundSize: '34px 34px, 18px 18px, 100% 100%'
  },
  shale: {
    backgroundImage: [
      svgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 180" fill="none">
          <path d="M0 30C20 20 52 20 80 30C110 40 142 40 170 30C198 20 230 20 262 30C292 40 318 40 340 28" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
          <path d="M0 72C22 62 52 62 82 72C110 82 142 82 172 72C200 62 234 62 264 72C292 82 318 82 340 70" stroke="rgba(74,59,50,0.22)" stroke-width="2"/>
          <path d="M0 112C22 102 52 102 82 112C110 122 142 122 172 112C200 102 234 102 264 112C292 122 318 122 340 110" stroke="rgba(184,93,61,0.22)" stroke-width="2"/>
          <path d="M0 154C20 144 52 144 82 154C110 164 142 164 172 154C200 144 234 144 264 154C292 164 318 164 340 152" stroke="rgba(67,179,174,0.18)" stroke-width="2"/>
        </svg>
      `),
      'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))'
    ].join(', '),
    backgroundSize: '340px 180px, 100% 100%'
  },
  igneous: {
    backgroundImage: [
      svgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280" fill="none">
          <path d="M0 26L254 280" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
          <path d="M30 0L280 250" stroke="rgba(184,93,61,0.18)" stroke-width="2"/>
          <path d="M0 112L170 280" stroke="rgba(67,179,174,0.16)" stroke-width="2"/>
          <path d="M208 0L280 72" stroke="rgba(67,179,174,0.2)" stroke-width="2"/>
          <path d="M82 60L118 96L88 134L52 92Z" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
          <path d="M170 126L212 154L184 194L142 166Z" stroke="rgba(184,93,61,0.2)" stroke-width="2"/>
        </svg>
      `),
      'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))'
    ].join(', '),
    backgroundSize: '280px 280px, 100% 100%'
  }
}

const rockMassStyles: Record<PatternName, CSSProperties> = {
  sandstone: {
    backgroundImage: [
      'linear-gradient(180deg, rgba(255,245,228,0.08), rgba(255,245,228,0.02))',
      'linear-gradient(180deg, #d0a874 0%, #b67c47 54%, #7d4e2e 100%)'
    ].join(', '),
    clipPath:
      'polygon(0 24%, 16% 18%, 34% 22%, 52% 10%, 70% 16%, 86% 8%, 100% 14%, 100% 100%, 0 100%)'
  },
  shale: {
    backgroundImage: [
      'linear-gradient(180deg, rgba(255,255,255,0.06), transparent 18%)',
      'repeating-linear-gradient(180deg, #7f6758 0 14px, #6f594d 14px 22px, #927563 22px 34px, #58473f 34px 48px)'
    ].join(', '),
    clipPath:
      'polygon(0 18%, 14% 16%, 32% 22%, 46% 14%, 62% 18%, 80% 10%, 100% 14%, 100% 100%, 0 100%)'
  },
  igneous: {
    backgroundImage: [
      'radial-gradient(circle at 24% 34%, rgba(184,93,61,0.24), transparent 18%)',
      'radial-gradient(circle at 76% 26%, rgba(67,179,174,0.18), transparent 16%)',
      'linear-gradient(180deg, #241d1a 0%, #140f0e 48%, #080808 100%)'
    ].join(', '),
    clipPath:
      'polygon(0 20%, 12% 8%, 26% 16%, 40% 6%, 52% 20%, 68% 10%, 82% 18%, 100% 12%, 100% 100%, 0 100%)'
  }
}

const romanticLavender = '#D8CCFF'
const romanticLavenderDeep = '#B9A7F7'

function FlowerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 160" fill="none" aria-hidden="true" {...props}>
      <g transform="translate(80 76)">
        {Array.from({ length: 6 }).map((_, index) => (
          <ellipse
            key={index}
            rx="18"
            ry="34"
            transform={`rotate(${index * 60}) translate(0 -36)`}
            fill={romanticLavender}
            fillOpacity="0.8"
            stroke="#F7E6B2"
            strokeOpacity="0.48"
            strokeWidth="2.5"
          />
        ))}
        <circle r="17" fill="#F7E6B2" fillOpacity="0.92" />
        <circle r="8" fill="#B85D3D" fillOpacity="0.55" />
      </g>
      <path
        d="M82 96C72 114 76 128 92 146"
        stroke={romanticLavenderDeep}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.84"
      />
      <path
        d="M95 122C106 118 114 126 118 134"
        stroke="#7BD6D1"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.74"
      />
    </svg>
  )
}

function HeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 110" fill="none" aria-hidden="true" {...props}>
      <path
        d="M60 100C18 74 6 54 6 31C6 15 18 4 33 4C45 4 55 11 60 21C65 11 75 4 87 4C102 4 114 15 114 31C114 54 102 74 60 100Z"
        fill={romanticLavender}
        fillOpacity="0.9"
        stroke="#F7E6B2"
        strokeWidth="4"
      />
      <path
        d="M44 30C48 24 53 22 58 22"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ProposalOrnaments({
  active,
  celebrate
}: {
  active: boolean
  celebrate: boolean
}) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {proposalOrnaments.map((item, index) => {
        const Icon = item.type === 'flower' ? FlowerIcon : HeartIcon
        return (
          <motion.div
            key={`${item.type}-${index}`}
            className="absolute"
            style={{
              top: item.top,
              right: item.right,
              bottom: item.bottom,
              left: item.left,
              width: item.size,
              height: item.size
            }}
            animate={{
              opacity: celebrate
                ? [0.2, 0.82, 0.26]
                : active
                  ? [0.1, 0.56, 0.16]
                  : [0.04, 0.16, 0.04],
              y: celebrate ? [0, -20, 0] : [0, -10, 0],
              rotate: [item.rotate, item.rotate + 6, item.rotate],
              scale: celebrate ? [0.92, 1.12, 0.96] : [0.95, 1.04, 0.95]
            }}
            transition={{
              delay: item.delay,
              duration: 4.6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Icon className="h-full w-full drop-shadow-[0_0_22px_rgba(216,204,255,0.25)]" />
          </motion.div>
        )
      })}
    </div>
  )
}

function GeologicFloaters({
  primary,
  secondary
}: {
  primary: string
  secondary: string
}) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {geologicFloaters.map((particle, index) => (
        <motion.span
          key={`${particle.size}-${index}`}
          className="absolute rounded-full blur-[0.5px]"
          style={{
            top: particle.top,
            right: particle.right,
            bottom: particle.bottom,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            backgroundColor: index % 2 === 0 ? primary : secondary
          }}
          animate={{
            y: [0, -16, 0],
            x: [0, index % 2 === 0 ? 8 : -8, 0],
            opacity: [0.08, 0.28, 0.08],
            scale: [0.8, 1.14, 0.8]
          }}
          transition={{
            delay: particle.delay,
            duration: 3.6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

/* ---------- GLOBAL ROMANTIC ATMOSPHERE ---------- */

function FloatingHeartsField() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: `${(i * 7.3) % 100}%`,
        size: 10 + ((i * 5) % 18),
        duration: 14 + (i % 6) * 3,
        delay: (i % 7) * 1.4
      })),
    []
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden opacity-70">
      {hearts.map(h => (
        <motion.div
          key={h.id}
          className="absolute bottom-[-8%]"
          style={{ left: h.left, width: h.size, height: h.size }}
          animate={{
            y: ['0vh', '-115vh'],
            opacity: [0, 0.5, 0.5, 0],
            x: [0, 10, -10, 0]
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <HeartIcon className="h-full w-full opacity-60" />
        </motion.div>
      ))}
    </div>
  )
}

function CoreScanLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 2200
    let frame: number
    function tick(now: number) {
      const pct = Math.min(1, (now - start) / duration)
      setProgress(pct)
      if (pct < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        window.setTimeout(onComplete, 300)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#111111] text-[#F4F1EA]"
    >
      <motion.div
        animate={{ scale: [0.9, 1.06, 0.9] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <HeartIcon className="mb-6 h-10 w-10 opacity-80" />
      </motion.div>
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-[#43B3AE]">
        Extracting core sample
      </p>
      <div className="mt-6 h-[2px] w-64 overflow-hidden rounded bg-white/10">
        <motion.div
          className="h-full bg-[#B85D3D]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <motion.p
        className="mt-4 font-mono text-[0.65rem] tracking-[0.3em] text-white/50"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        {Math.round(progress * 45)}.0m / 45.0m
      </motion.p>
    </motion.div>
  )
}

function MineralDustTrail() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number }[]
  >([])
  const idRef = useRef(0)

  useEffect(() => {
    let last = 0
    function handleMove(e: MouseEvent | TouchEvent) {
      const now = performance.now()
      if (now - last < 60) return
      last = now
      const point = 'touches' in e ? e.touches[0] : (e as MouseEvent)
      if (!point) return
      idRef.current += 1
      const id = idRef.current
      setParticles(prev => [
        ...prev.slice(-18),
        { id, x: point.clientX, y: point.clientY }
      ])
      window.setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id))
      }, 900)
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchmove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <AnimatePresence>
        {particles.map(p => (
          <motion.span
            key={p.id}
            initial={{ opacity: 0.75, scale: 0.4, x: p.x, y: p.y }}
            animate={{ opacity: 0, scale: 1.6, y: p.y - 30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute h-2 w-2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, #F7E6B2 0%, #D8CCFF 60%, transparent 100%)',
              boxShadow: '0 0 8px rgba(216,204,255,0.8)'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ConfettiBurst({ show }: { show: boolean }) {
  const [pieces, setPieces] = useState<
    Array<{
      id: number
      x: number
      rotate: number
      color: string
      delay: number
      size: number
      fall: number
    }>
  >([])

  useEffect(() => {
    if (!show) return
    setPieces(
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 900,
        rotate: Math.random() * 360,
        color: confettiColors[i % confettiColors.length],
        delay: Math.random() * 0.5,
        size: 6 + Math.random() * 8,
        fall: 700 + Math.random() * 400
      }))
    )
  }, [show])

  if (!show) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-[80] overflow-hidden">
      {pieces.map(p => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: -40, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.fall, opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{
            duration: 2.6 + Math.random(),
            delay: p.delay,
            ease: 'easeIn'
          }}
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: p.size,
            height: p.size * 1.6,
            backgroundColor: p.color,
            borderRadius: 2
          }}
        />
      ))}
    </div>
  )
}

function RingReveal({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 12,
            delay: 0.15
          }}
          className="relative mx-auto mt-6 flex h-24 w-24 items-center justify-center"
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, #F7E6B2, #D8CCFF, #43B3AE, #F7E6B2)'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-[6px] rounded-full bg-[#1B1526]" />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="relative h-5 w-5 rounded-sm"
            style={{
              background:
                'radial-gradient(circle, #ffffff 0%, #D8CCFF 60%, transparent 100%)',
              boxShadow: '0 0 24px 6px rgba(247,230,178,0.65)'
            }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function AmbientAudioToggle({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  function toggle() {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.volume = 0.35
      audioRef.current.play().catch(() => {})
    }
    setPlaying(!playing)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[70]">
      <audio ref={audioRef} src={src} loop />
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.9 }}
        animate={playing ? { scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 2, repeat: playing ? Infinity : 0 }}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-[#F4F1EA] backdrop-blur-md"
        aria-label={playing ? 'Pause ambient music' : 'Play ambient music'}
      >
        {playing ? '\u266A' : '\u266B'}
      </motion.button>
    </div>
  )
}

function Typewriter({ text, speed = 28 }: { text: string; speed?: number }) {
  const [shown, setShown] = useState('')

  useEffect(() => {
    setShown('')
    let i = 0
    const interval = window.setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) window.clearInterval(interval)
    }, speed)
    return () => window.clearInterval(interval)
  }, [text, speed])

  return (
    <span>
      {shown}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1 inline-block h-[1.1em] w-[2px] translate-y-[2px] bg-current"
      />
    </span>
  )
}

function LoveCounter({ since }: { since: Date }) {
  const [elapsed, setElapsed] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    function update() {
      const now = new Date()
      let diff = Math.max(0, now.getTime() - since.getTime())
      const d = Math.floor(diff / 86400000)
      diff -= d * 86400000
      const h = Math.floor(diff / 3600000)
      diff -= h * 3600000
      const m = Math.floor(diff / 60000)
      diff -= m * 60000
      const s = Math.floor(diff / 1000)
      setElapsed({ d, h, m, s })
    }
    update()
    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [since])

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.24em] text-[#B85D3D] sm:justify-start">
      {[
        { label: 'Days', value: elapsed.d },
        { label: 'Hours', value: elapsed.h },
        { label: 'Min', value: elapsed.m },
        { label: 'Sec', value: elapsed.s }
      ].map(item => (
        <div
          key={item.label}
          className="rounded-xl border border-[#4A3B32]/18 bg-white/50 px-3 py-2 text-center backdrop-blur-sm"
        >
          <p className="text-xl font-semibold text-[#4A3B32] tabular-nums">
            {String(item.value).padStart(2, '0')}
          </p>
          <p className="text-[0.6rem] text-[#4A3B32]/60">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

function DodgeButton({ label }: { label: string }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dodges, setDodges] = useState(0)

  function handleTrigger() {
    const maxX = 90
    const maxY = 46
    setPos({
      x: (Math.random() - 0.5) * maxX * 2,
      y: (Math.random() - 0.5) * maxY * 2
    })
    setDodges(d => d + 1)
  }

  const text =
    dodges === 0
      ? label
      : dodges < 3
        ? 'Nice try'
        : dodges < 6
          ? "You can't escape this one"
          : 'It only ends one way, Jaani'

  return (
    <motion.button
      type="button"
      onMouseEnter={handleTrigger}
      onTouchStart={handleTrigger}
      onClick={handleTrigger}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 14 }}
      className="rounded-full border border-white/16 bg-white/6 px-6 py-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/60"
    >
      {text}
    </motion.button>
  )
}

function RiddleGate({ onUnlock }: { onUnlock: () => void }) {
  const [step, setStep] = useState(0)
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)
  const [showHint, setShowHint] = useState(false)

  function submit() {
    const current = riddles[step]
    const normalized = value.trim().toLowerCase()
    if (normalized === current.answer) {
      setValue('')
      setShowHint(false)
      if (step === riddles.length - 1) {
        onUnlock()
      } else {
        setStep(step + 1)
      }
    } else {
      setShake(true)
      window.setTimeout(() => setShake(false), 420)
    }
  }

  const current = riddles[step]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 w-full max-w-xl rounded-[2rem] border border-[#F7E6B2]/20 bg-[#1B1526]/70 p-6 text-center backdrop-blur-md sm:p-8"
    >
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-[#7BD6D1]">
        Field Puzzle {step + 1} / {riddles.length}
      </p>
      <motion.p
        animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="mt-4 text-lg leading-8 text-white/88 md:text-xl"
      >
        {current.question}
      </motion.p>
      <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') submit()
          }}
          placeholder="Your answer, geologist"
          className="w-full max-w-xs rounded-full border border-white/16 bg-white/8 px-4 py-2.5 text-center text-sm text-white outline-none placeholder:text-white/30 focus:border-[#F7E6B2]/50"
        />
        <button
          type="button"
          onClick={submit}
          className="rounded-full bg-[#F7E6B2] px-6 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#111111] transition hover:bg-white"
        >
          Submit
        </button>
      </div>
      <button
        type="button"
        onClick={() => setShowHint(true)}
        className="mt-4 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-white/40 underline-offset-4 hover:underline"
      >
        Need a hint?
      </button>
      <AnimatePresence>
        {showHint ? (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-sm text-[#7BD6D1]/80"
          >
            {current.hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}

/* ---------- STRATUM SECTION ---------- */

function StratumSection({
  containerRef,
  index,
  sectionRef,
  stratum
}: {
  containerRef: RefObject<HTMLDivElement | null>
  index: number
  sectionRef: RefObject<HTMLElement | null>
  stratum: Stratum
}) {
  const reversed = index % 2 === 1
  const isDark = stratum.pattern === 'igneous'
  const { scrollYProgress: rawProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 60,
    damping: 22,
    mass: 0.5
  })

  const backgroundY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -80])
  const backgroundScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.08, 1, 1.04]
  )
  const contentY = useTransform(scrollYProgress, [0, 0.45, 1], [90, 0, -50])
  const contentX = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [reversed ? 30 : -30, 0, 0]
  )
  const photoY = useTransform(scrollYProgress, [0, 0.5, 1], [120, 0, -70])
  const photoRotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [reversed ? -2.6 : 2.6, 0, reversed ? 1.2 : -1.2]
  )
  const massScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.06])
  const glowOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.45, 1],
    [0.16, 0.34, 0.12]
  )
  const watermarkOpacity = useTransform(
    scrollYProgress,
    [0, 0.38, 0.74, 1],
    [0.02, 0.12, 0.08, 0.02]
  )

  const panelClassName = isDark
    ? 'border-white/12 bg-[#181312]/42 shadow-[0_45px_130px_rgba(0,0,0,0.45)] text-[#F4F1EA]'
    : 'border-[#4A3B32]/18 bg-[#fff9ef]/34 shadow-[0_45px_120px_rgba(74,59,50,0.14)] text-[#4A3B32]'
  const frameClassName = isDark
    ? 'border-white/12 bg-black/24 shadow-[0_40px_100px_rgba(0,0,0,0.48)]'
    : 'border-[#4A3B32]/16 bg-[#fff8ee]/40 shadow-[0_40px_100px_rgba(74,59,50,0.16)]'
  const tagClassName = isDark
    ? 'border-white/14 bg-white/6 text-white/78'
    : 'border-[#4A3B32]/18 bg-[#4A3B32]/6 text-[#4A3B32]/76'
  const bodyClassName = isDark ? 'text-white/82' : 'text-[#4A3B32]/88'
  const subtextClassName = isDark ? 'text-white/64' : 'text-[#4A3B32]/64'
  const floatPrimary = isDark ? 'rgba(216,204,255,0.75)' : 'rgba(184,93,61,0.4)'
  const floatSecondary = isDark
    ? 'rgba(67,179,174,0.75)'
    : 'rgba(74,59,50,0.22)'

  return (
    <section
      ref={sectionRef}
      data-depth={stratum.depth}
      className={`relative min-h-screen snap-start overflow-hidden ${isDark ? 'text-[#F4F1EA]' : 'text-[#4A3B32]'}`}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          ...sectionBackgroundStyles[stratum.pattern],
          y: backgroundY,
          scale: backgroundScale
        }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-multiply"
        style={{ ...patternStyles[stratum.pattern], y: backgroundY }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[56%] opacity-90"
        style={{ ...rockMassStyles[stratum.pattern], scale: massScale }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: glowOpacity,
          backgroundImage: isDark
            ? 'radial-gradient(circle at 18% 26%, rgba(184,93,61,0.8), transparent 20%), radial-gradient(circle at 84% 18%, rgba(67,179,174,0.8), transparent 18%), radial-gradient(circle at 50% 46%, rgba(216,204,255,0.5), transparent 22%)'
            : 'radial-gradient(circle at 18% 24%, rgba(255,255,255,0.7), transparent 22%), radial-gradient(circle at 80% 22%, rgba(184,93,61,0.38), transparent 18%), radial-gradient(circle at 54% 72%, rgba(67,179,174,0.24), transparent 20%)'
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/8 to-transparent" />
      <motion.p
        className={`pointer-events-none absolute right-[3%] top-[5%] font-mono text-[20vw] leading-none tracking-[-0.08em] ${isDark ? 'text-white/8' : 'text-[#4A3B32]/10'}`}
        style={{ opacity: watermarkOpacity }}
      >
        {stratum.depth}
      </motion.p>
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-white/10 xl:block" />
      <GeologicFloaters primary={floatPrimary} secondary={floatSecondary} />

      <div className="relative grid min-h-screen items-center gap-8 px-5 py-14 sm:px-7 lg:px-12 xl:grid-cols-[1.02fr_0.98fr] xl:px-16">
        <motion.div
          style={{ y: contentY, x: contentX }}
          className={reversed ? 'xl:order-2' : ''}
        >
          <div
            className={`relative overflow-hidden rounded-[2rem] border p-6 backdrop-blur-[10px] sm:p-8 lg:p-10 ${panelClassName}`}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={fieldNoteStyle}
            />
            <div className="absolute inset-x-0 top-0 h-px bg-white/16" />
            <div className="relative">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.34em] text-[#43B3AE]">
                {stratum.stratum} // Full Screen Layer
              </p>
              <p className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[#B85D3D]">
                {stratum.label}
              </p>

              <div className="mt-8">
                <h2 className="text-5xl leading-none md:text-7xl xl:text-[6rem]">
                  {stratum.title}
                </h2>
                <p
                  className={`mt-3 text-xl italic md:text-2xl ${subtextClassName}`}
                >
                  {stratum.subtitle}
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-3 font-mono text-[0.72rem] uppercase tracking-[0.28em]">
                <span
                  className={`rounded-full border px-3 py-1.5 ${tagClassName}`}
                >
                  Depth // {stratum.depth}
                </span>
                <span
                  className={`rounded-full border px-3 py-1.5 ${tagClassName}`}
                >
                  Timestamp // {stratum.date}
                </span>
              </div>

              <p
                className={`mt-8 max-w-2xl text-lg leading-8 md:text-[1.12rem] ${bodyClassName}`}
              >
                {stratum.body}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {stratum.tags.map(tag => (
                  <span
                    key={tag}
                    className={`rounded-full border px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.24em] ${tagClassName}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.figure
          style={{ y: photoY, rotate: photoRotate }}
          className={reversed ? 'xl:order-1' : ''}
        >
          <div
            className={`relative overflow-hidden rounded-[2.25rem] border p-4 backdrop-blur-sm ${frameClassName}`}
          >
            <div className="absolute -left-10 top-12 h-32 w-32 rounded-full bg-[#D8CCFF]/18 blur-3xl" />
            <div className="absolute -right-8 bottom-10 h-40 w-40 rounded-full bg-[#43B3AE]/16 blur-3xl" />
            <div className="absolute inset-4 rounded-[1.75rem] border border-white/10" />
            <img
              src={
                stratum.src ||
                imagePlaceholder(stratum.photoLabel, stratum.photoHint)
              }
              alt={stratum.photoAlt}
              className="relative h-[52vh] min-h-[22rem] w-full rounded-[1.75rem] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-b-[1.75rem] bg-gradient-to-t from-black/78 via-black/26 to-transparent p-5">
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.28em] text-[#F4F1EA]">
                {stratum.photoLabel}
              </p>
            </div>
          </div>
          <figcaption
            className={`mt-4 font-mono text-[0.72rem] uppercase tracking-[0.32em] ${isDark ? 'text-white/62' : 'text-[#4A3B32]/62'}`}
          >
            Field timestamp // {stratum.date}
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}

/* ---------- MAIN PAGE ---------- */

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLElement>(null)
  const sandstoneRef = useRef<HTMLElement>(null)
  const shaleRef = useRef<HTMLElement>(null)
  const igneousRef = useRef<HTMLElement>(null)
  const proposalRef = useRef<HTMLElement>(null)
  const [activeDepth, setActiveDepth] = useState<DepthKey>('0.0m')
  const [riddlesSolved, setRiddlesSolved] = useState(false)
  const [isCracked, setIsCracked] = useState(false)
  const [acceptedAnswer, setAcceptedAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const { scrollY: rawScrollY, scrollYProgress: rawScrollYProgress } =
    useScroll({ container: pageRef })
  const scrollY = useSpring(rawScrollY, {
    stiffness: 55,
    damping: 20,
    mass: 0.6
  })
  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 55,
    damping: 20,
    mass: 0.6
  })

  const paperOpacity = useTransform(
    scrollYProgress,
    [0, 0.54, 0.82, 1],
    [0.95, 0.82, 0.22, 0.02]
  )
  const darkFade = useTransform(scrollYProgress, [0.68, 0.86, 1], [0, 0.5, 1])
  const introLift = useTransform(scrollYProgress, [0, 0.14], [0, -90])
  const introFade = useTransform(
    scrollYProgress,
    [0, 0.12, 0.2],
    [1, 0.9, 0.42]
  )

  useEffect(() => {
    if (loading) return
    const container = pageRef.current
    const sections: Array<{ depth: DepthKey; element: HTMLElement | null }> = [
      { depth: '0.0m', element: sandstoneRef.current },
      { depth: '15.0m', element: shaleRef.current },
      { depth: '30.0m', element: igneousRef.current },
      { depth: '45.0m', element: proposalRef.current }
    ]

    if (!container || typeof IntersectionObserver === 'undefined') return

    const ratios = new Map<DepthKey, number>()

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const depth = (entry.target as HTMLElement).dataset.depth as
            | DepthKey
            | undefined
          if (depth) {
            ratios.set(depth, entry.intersectionRatio)
          }
        })

        let bestDepth: DepthKey = activeDepth
        let bestRatio = -1
        ratios.forEach((ratio, depth) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestDepth = depth
          }
        })

        if (bestRatio >= 0) {
          startTransition(() => setActiveDepth(bestDepth))
        }
      },
      { root: container, threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1] }
    )

    sections.forEach(({ depth, element }) => {
      if (element) {
        element.dataset.depth = depth
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  return (
    <>
      <AnimatePresence>
        {loading ? (
          <CoreScanLoader onComplete={() => setLoading(false)} />
        ) : null}
      </AnimatePresence>

      {!loading ? (
        <div
          ref={pageRef}
          className="relative h-screen snap-y snap-mandatory overflow-y-auto overflow-x-clip overscroll-y-contain bg-[#F4F1EA] text-[#4A3B32] [scrollbar-width:none]"
        >
          <MineralDustTrail />
          <FloatingHeartsField />
          <AmbientAudioToggle src="/song.mp3" />

          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ ...draftingPaperStyle, opacity: paperOpacity }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={contourStyle}
          />
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[130vh] bg-[linear-gradient(180deg,transparent_0%,rgba(17,17,17,0.08)_18%,rgba(40,28,60,0.32)_52%,#111111_100%)]"
            style={{ opacity: darkFade }}
          />

          <div className="relative mx-auto grid min-h-full max-w-[1750px] lg:grid-cols-[17rem_minmax(0,1fr)]">
            <aside className="sticky top-0 z-40 border-b border-[#4A3B32]/12 bg-[#F4F1EA]/88 backdrop-blur-md lg:h-screen lg:border-b-0 lg:border-r">
              <div className="flex h-full flex-col px-4 py-4 sm:px-6 lg:px-5 lg:py-6">
                <div>
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.34em] text-[#43B3AE]">
                    Depth Ruler
                  </p>
                  <h2 className="mt-2 text-xl leading-tight lg:text-2xl">
                    Stratigraphic Column
                  </h2>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#4A3B32]/72">
                    Each full-screen layer opens like a real field cut. The
                    active depth moves deeper as the story reaches the proposal
                    chamber.
                  </p>
                </div>

                <div className="relative mt-5 lg:mt-10 lg:flex-1">
                  <div className="absolute left-0 right-0 top-2 h-px bg-[#4A3B32]/16 lg:left-[0.72rem] lg:right-auto lg:top-0 lg:h-full lg:w-px" />
                  <motion.div
                    className="absolute left-0 right-0 top-2 h-px origin-left bg-[#B85D3D] lg:hidden"
                    style={{ scaleX: scrollYProgress }}
                  />
                  <motion.div
                    className="absolute left-[0.72rem] top-0 hidden h-full w-px origin-top bg-[#B85D3D] lg:block"
                    style={{ scaleY: scrollYProgress }}
                  />

                  <div className="grid grid-cols-2 gap-4 pt-5 sm:grid-cols-4 lg:grid-cols-1 lg:gap-7 lg:pt-1">
                    {depthMarkers.map(marker => {
                      const isActive = marker.depth === activeDepth
                      return (
                        <motion.div
                          key={marker.depth}
                          animate={{
                            opacity: isActive ? 1 : 0.5,
                            scale: isActive ? 1.02 : 1
                          }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          className="relative flex flex-col items-start gap-3 lg:grid lg:grid-cols-[1.4rem_1fr] lg:items-center lg:gap-4"
                        >
                          <motion.span
                            animate={{
                              backgroundColor: isActive
                                ? '#B85D3D'
                                : 'rgba(74,59,50,0.1)',
                              borderColor: isActive
                                ? '#B85D3D'
                                : 'rgba(74,59,50,0.24)',
                              boxShadow: isActive
                                ? '0 0 0 8px rgba(184,93,61,0.14)'
                                : '0 0 0 0 rgba(184,93,61,0)'
                            }}
                            transition={{
                              duration: 0.35,
                              ease: [0.22, 1, 0.36, 1]
                            }}
                            className="relative z-10 h-4 w-4 rounded-full border"
                          />
                          <div>
                            <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#B85D3D]">
                              {marker.depth}
                            </p>
                            <p className="mt-1 text-base">{marker.zone}</p>
                            <p className="mt-1 text-sm text-[#4A3B32]/68">
                              {marker.note}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-5 border-t border-[#4A3B32]/12 pt-4">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-[#43B3AE]">
                    Active depth // {activeDepth}
                  </p>
                </div>
              </div>
            </aside>

            <main className="min-w-0">
              <section
                ref={introRef}
                data-depth="0.0m"
                className="relative min-h-screen snap-start overflow-hidden bg-[#F4F1EA]"
              >
                <motion.div
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{ y: introLift, opacity: introFade }}
                >
                  <div className="absolute inset-0" style={contourStyle} />
                </motion.div>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,93,61,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(216,204,255,0.28),transparent_32%)]" />

                <div className="relative grid min-h-screen items-center gap-12 px-5 py-14 sm:px-7 lg:px-12 xl:grid-cols-[1.06fr_0.94fr] xl:px-16">
                  <motion.div style={{ y: introLift, opacity: introFade }}>
                    <p className="font-mono text-[0.74rem] uppercase tracking-[0.36em] text-[#43B3AE]">
                      Field Report // The Stratigraphy of Kashu
                    </p>
                    <h1 className="mt-6 max-w-5xl text-5xl leading-[0.94] md:text-7xl xl:text-[6.8rem]">
                      Field Report:
                      <br />
                      The Stratigraphy
                      <br />
                      of Kashu.
                    </h1>
                    <p className="mt-6 font-mono text-[0.78rem] uppercase tracking-[0.3em] text-[#B85D3D]">
                      Lead Researcher: Chiku | Subject: Jaani
                    </p>
                    <p className="mt-8 max-w-2xl text-lg leading-8 text-[#4A3B32]/84 md:text-[1.15rem]">
                      <Typewriter text="Some people find a place they love and stay forever. I found you, and every version of my future stayed near you too. This is everything you have quietly built in me, written the only way I know how, in the language of rocks and time." />
                    </p>

                    <LoveCounter since={new Date('2026-03-15T00:00:00')} />

                    <motion.p
                      animate={{ opacity: [0.35, 1, 0.35], y: [0, 6, 0] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="mt-10 font-mono text-[0.74rem] uppercase tracking-[0.34em] text-[#43B3AE]"
                    >
                      [ Scroll to begin excavation ]
                    </motion.p>
                  </motion.div>

                  <motion.div
                    style={{ y: introLift, opacity: introFade }}
                    className="relative flex min-h-[26rem] items-center justify-center lg:min-h-[34rem]"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,204,255,0.34),transparent_38%)]" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 24,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                      className="absolute h-[18rem] w-[18rem] rounded-full border border-[#4A3B32]/18 lg:h-[26rem] lg:w-[26rem]"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 34,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                      className="absolute h-[14rem] w-[14rem] rounded-full border border-dashed border-[#B85D3D]/28 lg:h-[20rem] lg:w-[20rem]"
                    />
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 4.8,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="relative flex h-[14rem] w-[14rem] items-center justify-center rounded-full border border-[#4A3B32]/20 bg-white/54 shadow-[0_34px_90px_rgba(74,59,50,0.16)] backdrop-blur-sm lg:h-[18rem] lg:w-[18rem]"
                    >
                      <div className="absolute inset-6 rounded-full border border-[#43B3AE]/28" />
                      <div className="absolute h-px w-[68%] bg-[#4A3B32]/22" />
                      <div className="absolute h-[68%] w-px bg-[#4A3B32]/22" />
                      <div className="text-center">
                        <p className="font-mono text-[0.72rem] uppercase tracking-[0.34em] text-[#43B3AE]">
                          Core ID
                        </p>
                        <p className="mt-3 text-4xl leading-none lg:text-5xl">
                          JAANI
                        </p>
                        <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#B85D3D]">
                          Site of greatest discovery
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      animate={{ rotate: [-12, -3, -12], y: [0, -8, 0] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="absolute -left-2 bottom-0 h-28 w-28 opacity-70 lg:h-40 lg:w-40"
                    >
                      <FlowerIcon className="h-full w-full" />
                    </motion.div>
                  </motion.div>
                </div>
              </section>

              <StratumSection
                containerRef={pageRef}
                index={0}
                sectionRef={sandstoneRef}
                stratum={strata[0]}
              />
              <StratumSection
                containerRef={pageRef}
                index={1}
                sectionRef={shaleRef}
                stratum={strata[1]}
              />
              <StratumSection
                containerRef={pageRef}
                index={2}
                sectionRef={igneousRef}
                stratum={strata[2]}
              />

              <section
                ref={proposalRef}
                data-depth="45.0m"
                className="relative min-h-screen snap-start overflow-hidden bg-[#111111] text-[#F4F1EA]"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(67,179,174,0.18),transparent_28%),radial-gradient(circle_at_bottom,rgba(184,93,61,0.2),transparent_26%),radial-gradient(circle_at_center,rgba(216,204,255,0.18),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0)_28%)]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#F4F1EA] via-[#2B2521] to-transparent opacity-70" />
                <ProposalOrnaments
                  active={isCracked}
                  celebrate={Boolean(acceptedAnswer)}
                />
                <ConfettiBurst show={Boolean(acceptedAnswer)} />

                <div className="relative flex min-h-screen items-center justify-center px-5 py-14 sm:px-8 lg:px-12 xl:px-16">
                  <div className="relative flex w-full max-w-[1200px] flex-col items-center text-center">
                    <p className="font-mono text-[0.74rem] uppercase tracking-[0.34em] text-[#43B3AE]">
                      SAMPLE_04: BORNITE GEODE (Final Reveal) | DEPTH: 45.0m |
                      Present
                    </p>

                    <AnimatePresence mode="wait">
                      {!riddlesSolved ? (
                        <motion.div
                          key="riddle-gate"
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.6 }}
                          className="mt-6 flex w-full flex-col items-center"
                        >
                          <h2 className="max-w-3xl text-3xl leading-tight text-[#F7E6B2] md:text-5xl">
                            Before the core opens, prove you know our field
                            notes.
                          </h2>
                          <p className="mt-3 max-w-xl text-white/70">
                            Answer these to unlock the deepest layer of the
                            report.
                          </p>
                          <RiddleGate onUnlock={() => setRiddlesSolved(true)} />
                        </motion.div>
                      ) : !isCracked ? (
                        <motion.div
                          key="geode-shell"
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{
                            duration: 0.65,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          className="mt-6 flex w-full flex-col items-center"
                        >
                          <h2 className="max-w-4xl text-4xl leading-tight text-[#F7E6B2] md:text-6xl">
                            Every layer in the report points here.
                          </h2>
                          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/74">
                            The field notes are done. The core is ready. Tap the
                            geode and let the proposal chamber open.
                          </p>

                          <div className="relative mt-10 flex h-[23rem] w-full max-w-[36rem] items-center justify-center sm:h-[26rem]">
                            <motion.div
                              className="absolute h-[15rem] w-[15rem] rounded-full bg-[radial-gradient(circle,#FFE8A5_0%,rgba(247,196,90,0.95)_22%,rgba(247,196,90,0.28)_52%,transparent_76%)] blur-xl"
                              animate={{
                                scale: [0.62, 0.84, 0.62],
                                opacity: [0.18, 0.44, 0.18]
                              }}
                              transition={{
                                duration: 2.8,
                                repeat: Infinity,
                                ease: 'easeInOut'
                              }}
                            />

                            <motion.button
                              type="button"
                              onClick={() => {
                                setAcceptedAnswer(null)
                                setIsCracked(true)
                              }}
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.94 }}
                              aria-expanded={isCracked}
                              aria-label="Tap to crack the geode"
                              className="group relative flex h-[18rem] w-[18rem] items-center justify-center outline-none sm:h-[22rem] sm:w-[22rem]"
                            >
                              <motion.div
                                className="absolute inset-0 rounded-full border border-white/10"
                                animate={{
                                  scale: [0.94, 1.06, 0.94],
                                  opacity: [0.14, 0.34, 0.14]
                                }}
                                transition={{
                                  duration: 2.6,
                                  repeat: Infinity,
                                  ease: 'easeInOut'
                                }}
                              />

                              <motion.div
                                className="absolute left-1/2 top-1/2 h-[13rem] w-[7rem] -translate-x-full -translate-y-1/2 border border-white/16 sm:h-[16rem] sm:w-[8.5rem]"
                                style={{
                                  backgroundImage: borniteGradient,
                                  borderRadius:
                                    '52% 18% 18% 52% / 58% 18% 18% 58%',
                                  clipPath:
                                    'polygon(0 6%, 86% 0, 100% 18%, 94% 50%, 100% 82%, 86% 100%, 0 94%)'
                                }}
                                animate={{
                                  x: -10,
                                  rotate: [-4, -2, -4],
                                  filter:
                                    'drop-shadow(0 0 28px rgba(73,36,119,0.34)) drop-shadow(0 0 16px rgba(216,204,255,0.16))'
                                }}
                                whileHover={{ x: -18 }}
                                transition={{
                                  duration: 2.4,
                                  repeat: Infinity,
                                  ease: 'easeInOut'
                                }}
                              >
                                <div className="absolute inset-[10px] bg-[radial-gradient(circle_at_24%_16%,rgba(255,255,255,0.44),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.14),transparent_55%)]" />
                              </motion.div>

                              <motion.div
                                className="absolute left-1/2 top-1/2 h-[13rem] w-[7rem] -translate-y-1/2 border border-white/16 sm:h-[16rem] sm:w-[8.5rem]"
                                style={{
                                  backgroundImage: borniteGradient,
                                  borderRadius:
                                    '18% 52% 52% 18% / 18% 58% 58% 18%',
                                  clipPath:
                                    'polygon(14% 0, 100% 6%, 100% 94%, 14% 100%, 0 82%, 6% 50%, 0 18%)'
                                }}
                                animate={{
                                  x: 10,
                                  rotate: [4, 2, 4],
                                  filter:
                                    'drop-shadow(0 0 28px rgba(22,73,108,0.34)) drop-shadow(0 0 16px rgba(216,204,255,0.16))'
                                }}
                                whileHover={{ x: 18 }}
                                transition={{
                                  duration: 2.4,
                                  repeat: Infinity,
                                  ease: 'easeInOut'
                                }}
                              >
                                <div className="absolute inset-[10px] bg-[radial-gradient(circle_at_74%_16%,rgba(255,255,255,0.44),transparent_34%),linear-gradient(225deg,rgba(255,255,255,0.14),transparent_55%)]" />
                              </motion.div>

                              <motion.div
                                className="absolute left-1/2 top-1/2 h-[11rem] w-px -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(180deg,transparent,#F7E6B2,transparent)]"
                                animate={{
                                  opacity: [0.42, 0.95, 0.42],
                                  scaleY: [0.88, 1.12, 0.88]
                                }}
                                transition={{
                                  duration: 1.8,
                                  repeat: Infinity,
                                  ease: 'easeInOut'
                                }}
                              />
                            </motion.button>
                          </div>

                          <motion.p
                            animate={{ opacity: [0.35, 1, 0.35], y: [0, 5, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut'
                            }}
                            className="mt-2 font-mono text-[0.78rem] uppercase tracking-[0.36em] text-[#F7E6B2]"
                          >
                            [ Tap to crack the geode ]
                          </motion.p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="proposal-chamber"
                          initial={{ opacity: 0, y: 24, scale: 0.92 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{
                            duration: 0.75,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          className="relative mt-8 flex w-full items-center justify-center"
                        >
                          <motion.div
                            className="pointer-events-none absolute left-[4%] top-1/2 hidden h-[13rem] w-[7rem] -translate-y-1/2 border border-white/10 opacity-40 xl:block"
                            style={{
                              backgroundImage: borniteGradient,
                              borderRadius: '52% 18% 18% 52% / 58% 18% 18% 58%',
                              clipPath:
                                'polygon(0 6%, 86% 0, 100% 18%, 94% 50%, 100% 82%, 86% 100%, 0 94%)'
                            }}
                            animate={{
                              x: [-6, -14, -6],
                              rotate: [-20, -24, -20]
                            }}
                            transition={{
                              duration: 5.2,
                              repeat: Infinity,
                              ease: 'easeInOut'
                            }}
                          />
                          <motion.div
                            className="pointer-events-none absolute right-[4%] top-1/2 hidden h-[13rem] w-[7rem] -translate-y-1/2 border border-white/10 opacity-40 xl:block"
                            style={{
                              backgroundImage: borniteGradient,
                              borderRadius: '18% 52% 52% 18% / 18% 58% 58% 18%',
                              clipPath:
                                'polygon(14% 0, 100% 6%, 100% 94%, 14% 100%, 0 82%, 6% 50%, 0 18%)'
                            }}
                            animate={{ x: [6, 14, 6], rotate: [20, 24, 20] }}
                            transition={{
                              duration: 5.2,
                              repeat: Infinity,
                              ease: 'easeInOut'
                            }}
                          />

                          <div className="relative w-full max-w-[880px] overflow-hidden rounded-[2.5rem] border border-[#F7E6B2]/16 bg-[#1B1526]/80 px-6 py-10 shadow-[0_50px_150px_rgba(0,0,0,0.58)] backdrop-blur-md sm:px-8 md:px-12 md:py-14">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(216,204,255,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(67,179,174,0.16),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_36%,rgba(247,230,178,0.04)_100%)]" />
                            <div className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full bg-[#D8CCFF]/20 blur-3xl" />
                            <div className="pointer-events-none absolute -right-12 bottom-8 h-52 w-52 rounded-full bg-[#F7E6B2]/10 blur-3xl" />

                            <div className="relative">
                              <motion.div
                                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[radial-gradient(circle,#FFE9AA_0%,rgba(247,196,90,0.92)_28%,rgba(216,204,255,0.34)_62%,transparent_82%)]"
                                animate={{ scale: [0.96, 1.08, 0.96] }}
                                transition={{
                                  duration: 2.8,
                                  repeat: Infinity,
                                  ease: 'easeInOut'
                                }}
                              >
                                <HeartIcon className="h-16 w-16 drop-shadow-[0_0_18px_rgba(216,204,255,0.4)]" />
                              </motion.div>

                              <div className="mt-6 flex items-center justify-center gap-4">
                                <FlowerIcon className="hidden h-[4.5rem] w-[4.5rem] opacity-90 md:block" />
                                <p className="font-mono text-[0.74rem] uppercase tracking-[0.34em] text-[#CFC1FF]">
                                  Proposal Chamber // core fully exposed
                                </p>
                                <FlowerIcon className="hidden h-[4.5rem] w-[4.5rem] opacity-90 md:block" />
                              </div>

                              <AnimatePresence mode="wait">
                                {!acceptedAnswer ? (
                                  <motion.div
                                    key="ask"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0, y: -12 }}
                                  >
                                    <h3 className="mt-6 text-3xl leading-tight text-white md:text-5xl">
                                      My precious Pari. You are a goddess who
                                      came to earth just to uplift me. Jaani,
                                      you are my core.
                                    </h3>
                                    <p className="mt-5 text-3xl leading-tight text-[#F7E6B2] md:text-6xl">
                                      Will you marry me?
                                    </p>

                                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                      <motion.button
                                        type="button"
                                        onClick={() => setAcceptedAnswer('Yes')}
                                        whileHover={{ y: -3, scale: 1.05 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="rounded-full border border-[#E6DAFF]/34 bg-[#D8CCFF]/18 px-9 py-3.5 font-mono text-[0.78rem] uppercase tracking-[0.22em] text-[#F7E6B2] shadow-[0_18px_40px_rgba(216,204,255,0.16)] transition-colors hover:bg-[#F7E6B2] hover:text-[#111111]"
                                      >
                                        Yes, forever
                                      </motion.button>
                                      <DodgeButton label="Give me a second" />
                                    </div>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="accepted"
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15, duration: 0.6 }}
                                    className="mt-6"
                                  >
                                    <h3 className="text-3xl leading-tight text-[#F7E6B2] md:text-5xl">
                                      She said {acceptedAnswer}.
                                    </h3>
                                    <p className="mt-4 text-lg text-white/82">
                                      Every stratum led here. From sandstone to
                                      shale to fire, and now, forever fused.
                                    </p>
                                    <RingReveal
                                      show={Boolean(acceptedAnswer)}
                                    />
                                    <p className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[#7BD6D1]">
                                      Field status updated // Engagement horizon
                                      confirmed
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      ) : null}
    </>
  )
}
