import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GiftCard() {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef(null);

  const message = `Hello Nhun Nhun - Người xinh đẹp nhất vũ trụ =)))))

Mình làm một cái web xinh xinh tặng cho người đẹp nhân dịp sinh nhật "12+" đây. Tuổi mới chúc bạn an khang thịnh vượng, vạn sự như ý, bình yên hạnh phúc nhé hẹ hẹ hẹ. Writting tiếng Việt 4.0 nên viết được tí xíu thôi 😙. Xem được web này xong nhắn mình nha.

--   Duckk - Sinh viên IT --`;

  // Typewriter
  const [typed, setTyped] = useState("");
  useEffect(() => {
    if (!open) return;
    let i = 0;
    const id = setInterval(() => {
      setTyped(message.slice(0, ++i));
      if (i >= message.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [open]);

  // Confetti + focus + ESC + lock scroll
  useEffect(() => {
    if (!open) return;
    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.3 } });
      const t = Date.now() + 1200;
      (function loop() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < t) requestAnimationFrame(loop);
      })();
    });
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => closeBtnRef.current?.focus(), 120);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="mt-8 text-center">
      {/* Nút mở thiệp */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-lg hover:shadow-xl active:scale-[.98] transition"
        aria-haspopup="dialog"
      >
        💌 Mở thiệp
      </button>
      <p className="text-sm mt-2 opacity-70">Bấm thử đi 😚</p>

      {/* Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              className="relative w-full max-w-2xl cursor-default"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Viền gradient kiểu glass */}
              <div className="rounded-[28px] p-[2px] bg-gradient-to-br from-pink-300/70 via-violet-300/70 to-sky-300/70">
                <div className="rounded-[28px] bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_rgba(124,58,237,.25)] p-6 md:p-8">
                  {/* Banner pastel sau tiêu đề */}
                  <div className="relative grid place-items-center mb-4">
                    <span className="card-banner" aria-hidden="true" />
                    <h3 className="font-cardTitle text-5xl md:text-6xl bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(192,132,252,.55)]">
                      Happy Birthday
                    </h3>
                    <p className="mt-1 text-sm text-slate-500/80">For Nhun Nhun </p>
                  </div>

                  {/* Sticker nhẹ */}
                  <span className="tape" />
                  <span className="heart h1">🎈</span>
                  <span className="heart h2">✨</span>

                  {/* Nội dung thiệp (font riêng) */}
                  <p className="font-cardBody whitespace-pre-wrap leading-7 md:leading-8 text-slate-700/90">
                    {typed}
                  </p>

                  {/* Nút đóng */}
                  <div className="mt-6 flex justify-end">
                    <button
                      ref={closeBtnRef}
                      onClick={() => setOpen(false)}
                      className="px-3 py-1.5 rounded-xl border border-violet-200 text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>

              {/* Lấp lánh nổi trên thiệp */}
              <div className="pointer-events-none absolute inset-0">
                {Array.from({ length: 18 }).map((_, i) => {
                  const left = Math.random() * 100;
                  const top = Math.random() * 100;
                  const delay = (Math.random() * 2).toFixed(2) + "s";
                  const cls =
                    Math.random() < 0.33
                      ? "spark spark--lg"
                      : Math.random() < 0.66
                        ? "spark"
                        : "spark spark--sm";
                  return (
                    <span
                      key={i}
                      className={cls}
                      style={{ left: `${left}%`, top: `${top}%`, animationDelay: delay }}
                    />
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
