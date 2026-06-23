import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AlbumCarousel from './components/AlbumCarousel'
import AudioPlayer from './components/AudioPlayer'
import GiftCard from './components/GiftCard'
import AuroraBackground from './components/AuroraBackground'

/* ── Framer variants cho stagger section ── */
const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function App() {
  useEffect(() => {
    import('canvas-confetti').then(({ default: confetti }) => {
      const burst = () => confetti({ particleCount: 80, startVelocity: 40, spread: 360, origin: { x: Math.random(), y: Math.random() * 0.4 } })
      burst(); setTimeout(burst, 600); setTimeout(burst, 1200)
      const end = Date.now() + 1200
        ; (function fire() {
          confetti({ particleCount: 5, spread: 70, origin: { x: .15, y: .2 } })
          confetti({ particleCount: 5, spread: 70, origin: { x: .85, y: .2 } })
          if (Date.now() < end) requestAnimationFrame(fire)
        })()
    }).catch(() => { })
  }, [])

  return (
    <div className="min-h-screen bg-diagonal text-slate-800 overflow-x-hidden">
      {/* Aurora CSS background */}
      <AuroraBackground />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-0 relative z-10">
        <Hero />

        {/* Wave divider 1 */}
        <WaveDivider flip={false} />

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-3 pt-4"
        >
          <AlbumCarousel />
          <GiftCard />
        </motion.section>

        {/* Wave divider 2 */}
        <WaveDivider flip={true} />

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex justify-center pt-4 pb-12"
        >
          <div className="w-full max-w-xl">
            <div className="player-card mx-auto">
              <h3 className="flex justify-center items-center gap-2 text-lg font-semibold mb-4 text-violet-700">
                <span className="text-xl">🎵</span> Một chút nhạc cho chill nhé 😚
              </h3>
              <AudioPlayer />
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}

/* ── Wave SVG divider ── */
function WaveDivider({ flip }) {
  return (
    <div className={`wave-divider ${flip ? 'wave-divider--flip' : ''}`} aria-hidden>
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,80 L0,80 Z"
          fill="url(#waveGrad)"
        />
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(249,168,212,0.25)" />
            <stop offset="50%"  stopColor="rgba(196,181,253,0.30)" />
            <stop offset="100%" stopColor="rgba(147,197,253,0.25)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

/* ── Hero section ── */
function Hero() {
  const title = "🎉Happy Birthday🎂"
  const nameTarget = "Gigi"
  const [typed, setTyped] = useState("")
  const [done, setDone] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setTyped(nameTarget.slice(0, ++i))
      if (i >= nameTarget.length) { clearInterval(id); setDone(true) }
    }, 80)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && setOpen(false)
    const prev = document.body.style.overflow
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <section className="text-center pt-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}
        className="title-fancy font-black leading-none tracking-tight text-[62px] md:text-[110px]"
        style={{ fontFamily: 'Nunito, system-ui' }}
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .3, duration: .5 }}
        className="mt-3"
        style={{ fontFamily: "Dancing Script, cursive" }}
      >
        <span className="inline-block font-semibold text-transparent bg-clip-text
                         bg-gradient-to-r from-fuchsia-500 via-violet-600 to-blue-500
                         bg-[length:200%_100%] [animation:shimmer_5s_linear_infinite]
                         text-[60px] md:text-[96px] leading-tight">
          {typed}
        </span>
        {/* cursor glow nhấp nháy sau khi gõ xong */}
        {!done && <span className="cursor-glow" />}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: .55, duration: .6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 grid place-items-center"
      >
        <div className="mt-8 grid place-items-center">
          <CuteHeroFrame src="/assets/Gigi11.jpg" onClick={() => setOpen(true)} />
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md grid place-items-center p-4 cursor-pointer"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                className="cursor-default relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Sparkles count={30} />
                <div className="lightbox-frame">
                  <img src="/assets/Gigi4.jpg" className="max-w-[88vw] max-h-[84vh] rounded-2xl block" alt="preview" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

/* ── Sparkle dots ── */
function Sparkles({ count = 26 }) {
  const items = Array.from({ length: count }).map((_, i) => {
    const left = Math.random() * 100, top = Math.random() * 100
    const delay = (Math.random() * 2).toFixed(2) + 's'
    const cls = Math.random() < .25 ? 'spark spark--lg' : Math.random() < .5 ? 'spark' : 'spark spark--sm'
    return <span key={i} className={cls} style={{ left: `${left}%`, top: `${top}%`, animationDelay: delay }} />
  })
  return <div className="pointer-events-none absolute inset-0 overflow-hidden">{items}</div>
}

/* ── Hero frame với 3D tilt ── */
function CuteHeroFrame({ src, onClick }) {
  const frameRef = useRef(null)

  const handleMouseMove = (e) => {
    const el = frameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-4px)`
  }

  const handleMouseLeave = (e) => {
    const el = frameRef.current
    if (!el) return
    el.style.transform = ''
  }

  return (
    <button
      ref={frameRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="cute-frame floaty-slow focus:outline-none"
    >
      <span className="tape" />
      <span className="ribbon lt">🎀</span>
      <span className="ribbon rt">🎉</span>
      <span className="heart h1">💕</span>
      <span className="heart h2">💖</span>

      {/* hào quang glow pulse */}
      <div className="hero-glow" />

      <div className="cute-inner w-[380px] md:w-[600px] h-auto">
        <Sparkles count={22} />
        <img src={src} alt="hero" className="relative z-10 block w-full h-auto" />
      </div>
    </button>
  )
}
