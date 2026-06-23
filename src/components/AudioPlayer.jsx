import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import tracks from "../data/tracks";

const IconPrev = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zM20 6v12L10 12z" />
  </svg>
)
const IconNext = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 6h2v12h-2zM4 6v12l10-6z" />
  </svg>
)
const IconPlay = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
)
const IconPause = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
  </svg>
)

/* ── EQ bars: 5 thanh nhảy CSS animation ── */
const EQ_DELAYS = ['0s','0.15s','0.3s','0.1s','0.25s']
function EqBars({ active }) {
  return (
    <div className={`eq-bars ${active ? 'eq-bars--active' : ''}`}>
      {EQ_DELAYS.map((d, i) => (
        <span key={i} className="eq-bar" style={{ animationDelay: d }} />
      ))}
    </div>
  )
}

/* ── Progress bar interactive ── */
function ProgressBar({ progress, audioRef }) {
  const barRef = useRef(null)
  const seek = (e) => {
    const el = audioRef.current
    if (!el?.duration) return
    const rect = barRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    el.currentTime = ratio * el.duration
  }
  return (
    <div
      ref={barRef}
      onClick={seek}
      className="progress-bar-track"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
    >
      <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
        <div className="progress-bar-thumb" />
      </div>
    </div>
  )
}

export default function AudioPlayer() {
  const [i, setI] = useState(() => Math.floor(Math.random() * tracks.length))
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const a = useRef(null)
  const fadeRAF = useRef(null)
  const shouldResumeRef = useRef(false)
  const t = tracks[i]

  const clearFade = () => {
    if (fadeRAF.current) cancelAnimationFrame(fadeRAF.current)
    fadeRAF.current = null
  }

  const fadeTo = (target = 1, ms = 1200) => {
    const el = a.current; if (!el) return
    clearFade()
    const start = performance.now()
    const v0 = el.volume ?? 1
    const step = (now) => {
      const p = Math.min(1, (now - start) / ms)
      el.volume = v0 + (target - v0) * p
      if (p < 1) fadeRAF.current = requestAnimationFrame(step)
      else fadeRAF.current = null
    }
    fadeRAF.current = requestAnimationFrame(step)
  }

  const tryPlay = () => {
    const el = a.current; if (!el) return
    el.muted = false; el.volume = 0
    return el.play().then(() => {
      setPlaying(true); fadeTo(1, 1000)
      localStorage.setItem("music_autoplay_ok", "1")
    }).catch(() => {
      setPlaying(false)
      const resume = () => { window.removeEventListener("pointerdown", resume); tryPlay() }
      window.addEventListener("pointerdown", resume, { once: true })
    })
  }

  useEffect(() => {
    const el = a.current; if (!el) return
    clearFade(); setProgress(0)
    shouldResumeRef.current = playing
    el.pause(); el.src = t.src; el.currentTime = 0
    const onCanPlay = () => {
      if (shouldResumeRef.current) tryPlay(); else setPlaying(false)
    }
    el.addEventListener("canplay", onCanPlay, { once: true })
    el.load()
    return () => el.removeEventListener("canplay", onCanPlay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i])

  useEffect(() => {
    const el = a.current; if (!el) return
    el.setAttribute("playsinline", "")
    tryPlay()
    const first = () => { if (el.paused) tryPlay() }
    window.addEventListener("pointerdown", first, { once: true })
    return () => clearFade()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const togglePlay = async () => {
    const el = a.current; if (!el) return
    if (el.paused) {
      el.volume = 0
      try { await el.play(); setPlaying(true); fadeTo(1, 800) } catch { setPlaying(false) }
    } else {
      fadeTo(0, 250); setTimeout(() => { el.pause(); setPlaying(false) }, 260)
    }
  }

  const onTime = () => {
    const el = a.current; if (!el?.duration) return
    setProgress((el.currentTime / el.duration) * 100)
  }

  const next = () => setI((x) => (x + 1) % tracks.length)
  const prev = () => setI((x) => (x - 1 + tracks.length) % tracks.length)

  return (
    <div className="flex justify-center">
      <div className="player-inner">

        {/* Album art + EQ glow */}
        <div className="album-art-wrap">
          <motion.div
            animate={playing ? { boxShadow: ['0 0 20px rgba(167,139,250,.5)','0 0 40px rgba(249,168,212,.6)','0 0 20px rgba(167,139,250,.5)'] } : { boxShadow: '0 0 0px transparent' }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="album-art-glow"
          >
            <motion.img
              key={t.cover}
              src={t.cover}
              alt=""
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="album-art-img"
            />
          </motion.div>
          <EqBars active={playing} />
        </div>

        {/* Track info */}
        <div className="mt-4 text-center">
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-bold text-base text-slate-800"
          >
            {t.title}
          </motion.div>
          <div className="text-sm text-violet-500/80 mt-0.5">{t.artist}</div>
        </div>

        {/* Progress */}
        <div className="mt-3 px-1">
          <ProgressBar progress={progress} audioRef={a} />
        </div>

        {/* Controls */}
        <div className="mt-5 flex justify-center items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.2, rotate: -8 }}
            whileTap={{ scale: 0.88 }}
            className="ctrl-btn"
            onClick={prev}
          >
            <IconPrev />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            animate={playing ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={playing ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : {}}
            className="ctrl-btn ctrl-btn--play"
            onClick={togglePlay}
          >
            {playing ? <IconPause /> : <IconPlay />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.2, rotate: 8 }}
            whileTap={{ scale: 0.88 }}
            className="ctrl-btn"
            onClick={next}
          >
            <IconNext />
          </motion.button>
        </div>

        {/* Sticker corners */}
        <span className="absolute -top-3 -left-3 text-2xl select-none">🎀</span>
        <span className="absolute -top-3 -right-3 text-2xl select-none">🎉</span>
        <span className="absolute -bottom-3 left-6 text-2xl select-none">🎂</span>
        <span className="absolute -bottom-3 right-6 text-2xl select-none">🎈</span>

        <audio ref={a} preload="metadata" onTimeUpdate={onTime} onEnded={next} playsInline />
      </div>
    </div>
  )
}
