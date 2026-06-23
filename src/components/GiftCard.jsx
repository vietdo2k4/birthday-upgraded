import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ── Sparkle dots tĩnh (memo để không rerender) ── */
const SPARKS = Array.from({ length: 22 }).map(() => ({
  left: Math.random() * 100,
  top:  Math.random() * 100,
  delay: (Math.random() * 2.5).toFixed(2) + 's',
  cls: Math.random() < .3 ? 'spark spark--lg' : Math.random() < .6 ? 'spark' : 'spark spark--sm',
}))

function CardSparkles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]">
      {SPARKS.map((s, i) => (
        <span key={i} className={s.cls}
          style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: s.delay }} />
      ))}
    </div>
  )
}

/* ── Typewriter cursor ── */
function Cursor({ done }) {
  if (done) return null
  return <span className="card-cursor" />
}

export default function GiftCard() {
  const [open, setOpen]   = useState(false)
  const [typed, setTyped] = useState("")
  const [done, setDone]   = useState(false)
  const closeBtnRef = useRef(null)
  const btnRef      = useRef(null)
  const inView      = useInView(btnRef, { once: true, amount: 0.5 })

  const greeting = "Hello cốt iu =))))))"
  const body = `Gọi là có tí web chúc mừng sinh nhật em cơ bản thôi =)))))) cho có content á mà. 

Tuổi mới chúc em tiền nong rủng rỉnh, mọi dự định em muốn làm đều thành công, xinh đẹp thì khỏi phải bàn, anh duyệt 1000%. Tuổi mới là phải biết giữ gìn trân trọng sức khoẻ, giấc ngủ hơn nhé =))))). 
Wish you all the best, my bestie. Classic, respect.`
  const sign = "— Duckk —  "
  const fullMessage = `${greeting}\n\n${body}\n\n${sign}`

  // Typewriter — reset khi đóng
  useEffect(() => {
    if (!open) { setTyped(""); setDone(false); return }
    let i = 0
    const id = setInterval(() => {
      setTyped(fullMessage.slice(0, ++i))
      if (i >= fullMessage.length) { clearInterval(id); setDone(true) }
    }, 16)
    return () => clearInterval(id)
  }, [open])

  // Confetti + ESC + lock scroll
  useEffect(() => {
    if (!open) return
    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.25 }, colors: ['#f9a8d4','#c4b5fd','#93c5fd','#fde68a'] })
      const t = Date.now() + 1400
      ;(function loop() {
        confetti({ particleCount: 4, angle: 60,  spread: 55, origin: { x: 0 } })
        confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 } })
        if (Date.now() < t) requestAnimationFrame(loop)
      })()
    })
    const onKey = (e) => e.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    setTimeout(() => closeBtnRef.current?.focus(), 120)
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev }
  }, [open])

  return (
    <div className="mt-10 text-center">
      {/* Nút mở thiệp */}
      <motion.button
        ref={btnRef}
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, scale: 0.85, y: 12 }}
        animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
        whileHover={{ scale: 1.07, boxShadow: '0 0 28px rgba(192,132,252,.6)' }}
        whileTap={{ scale: 0.94 }}
        className="gift-btn"
        aria-haspopup="dialog"
      >
        <span className="gift-btn__shimmer" />
        💌 Mở thiệp
      </motion.button>
      <p className="text-sm mt-2 opacity-60 tracking-wide">Bấm thử đi 😚</p>

      {/* Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center p-4"
            style={{ background: 'rgba(30,10,50,.65)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              className="relative w-full max-w-xl cursor-default"
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sparkles */}
              <CardSparkles />

              {/* Viền gradient animated */}
              <div className="card-shell">
                {/* Nội dung trắng bên trong */}
                <div className="card-body">

                  {/* ── Ribbon tiêu đề ── */}
                  <div className="card-ribbon-wrap">
                    <div className="card-ribbon">
                      <span className="card-ribbon__text">🎂 Happy Birthday 🎂</span>
                    </div>
                    {/* Đuôi ribbon trái & phải */}
                    <div className="card-ribbon-tail card-ribbon-tail--l" />
                    <div className="card-ribbon-tail card-ribbon-tail--r" />
                  </div>

                  {/* ── Sub-title ── */}
                  <p className="card-subtitle">Gigi ✨</p>

                  {/* ── Divider hoa ── */}
                  <div className="card-divider">
                    <span />
                    <span className="card-divider__icon">🌸</span>
                    <span />
                  </div>

                  {/* ── Nội dung typewriter ── */}
                  <div className="card-message-wrap">
                    {/* Nền giấy nhẹ với đường kẻ mờ */}
                    <div className="card-paper">
                      <p className="card-message">
                        {typed}
                        <Cursor done={done} />
                      </p>
                    </div>
                  </div>

                  {/* ── Divider dưới ── */}
                  <div className="card-divider mt-4">
                    <span />
                    <span className="card-divider__icon">💫</span>
                    <span />
                  </div>

                  {/* ── Nút đóng ── */}
                  <div className="mt-5 flex justify-center">
                    <button
                      ref={closeBtnRef}
                      onClick={() => setOpen(false)}
                      className="card-close-btn"
                    >
                      <span className="gift-btn__shimmer" />
                      Đóng thiệp 💝
                    </button>
                  </div>

                </div>
              </div>

              {/* Sticker góc */}
              <span className="card-sticker card-sticker--tl">🎀</span>
              <span className="card-sticker card-sticker--tr">🎉</span>
              <span className="card-sticker card-sticker--bl">🌟</span>
              <span className="card-sticker card-sticker--br">🎈</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
