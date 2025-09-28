import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AlbumCarousel from './components/AlbumCarousel'
import AudioPlayer from './components/AudioPlayer'
import GiftCard from './components/GiftCard'
import BackgroundLite from "./components/BackgroundLite";

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
    <div className="min-h-screen bg-diagonal text-slate-800 ">
      {/* Nền trang trí (z-index thấp, không chặn click) */}
      <BackgroundLite count={12} />
      {/* Nội dung chính luôn nằm trên */}
      <main className=" max-w-5xl mx-auto px-4 py-10 space-y-12 relative z-10">
        <Hero />

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-bold text-violet-700"></h2>
          <AlbumCarousel />
          <GiftCard />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="w-full max-w-xl">
            <div className="glass rounded-3xl p-5 shadow-soft mx-auto">
              <h3 className="flex justify-center text-lg font-semibold mb-2">
                Một chút nhạc cho chill nhé 😚
              </h3>
              <AudioPlayer />
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}

function Hero() {
  const title = "🎉Happy Birthday🎂";
  const nameTarget = "Nhun Nhun";
  const [typed, setTyped] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let i = 0; const id = setInterval(() => {
      setTyped(nameTarget.slice(0, ++i));
      if (i >= nameTarget.length) clearInterval(id);
    }, 70);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <section className="text-center pt-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}
        className="title-fancy font-black leading-none tracking-tight text-[68px] md:text-[120px]"
        style={{ fontFamily: 'Nunito, system-ui' }}
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .5 }}
        className="mt-3" style={{ fontFamily: "Dancing Script, cursive" }}
      >
        <span
          className="inline-block font-semibold text-transparent bg-clip-text
                     bg-gradient-to-r from-fuchsia-500 via-violet-600 to-blue-500
                     bg-[length:200%_100%] [animation:shimmer_5s_linear_infinite]
                     text-[66px] md:text-[100px] leading-tight"
        >
          {typed}
        </span>
      </motion.p>

      <div className="mt-8 grid place-items-center">
        <div className="mt-8 grid place-items-center">
          <CuteHeroFrame src="/assets/Nhun4.jpg" onClick={() => setOpen(true)} />
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4 cursor-pointer"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                className="cursor-default"
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Sparkles count={30} />
                <img src="/assets/Nhun4.jpg" className="max-w-[92vw] max-h-[88vh] rounded-2xl shadow-2xl" alt="preview" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Sparkles({ count = 26 }) {
  const items = Array.from({ length: count }).map((_, i) => {
    const left = Math.random() * 100, top = Math.random() * 100, delay = (Math.random() * 2).toFixed(2) + 's';
    const cls = Math.random() < .25 ? 'spark spark--lg' : Math.random() < .5 ? 'spark' : 'spark spark--sm';
    return <span key={i} className={cls} style={{ left: `${left}%`, top: `${top}%`, animationDelay: delay }} />
  });
  return <div className="pointer-events-none absolute inset-0 overflow-hidden">{items}</div>;
}

function CuteHeroFrame({ src, onClick }) {
  return (
    <button onClick={onClick} className="cute-frame floaty-slow focus:outline-none">
      <span className="tape" />
      <span className="ribbon lt">🎀</span>
      <span className="ribbon rt">🎉</span>
      <span className="heart h1">💕</span>
      <span className="heart h2">💖</span>

      <div className="cute-inner w-[320px] h-[320px] md:w-[520px] md:h-[520px]">
        <Sparkles count={28} />
        <img src={src} alt="hero" className="relative z-10 block w-full h-full object-cover" />
        <div className="cute-hint"></div>
      </div>
    </button>
  );
}
