import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import tracks from "../data/tracks";

const IconPrev = () => (<svg width="26" height="26" viewBox="0 0 24 24"><path fill="currentColor" d="M6 6h2v12H6zM20 6v12L10 12z"/></svg>);
const IconNext = () => (<svg width="26" height="26" viewBox="0 0 24 24"><path fill="currentColor" d="M16 6h2v12h-2zM4 6v12l10-6z"/></svg>);
const IconPlay = () => (<svg width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>);
const IconPause = () => (<svg width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>);

export default function AudioPlayer() {
  const [i, setI] = useState(() => Math.floor(Math.random() * tracks.length));
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const a = useRef(null);
  const wasPlaying = useRef(false);
  const fadeRAF = useRef(null);
  const t = tracks[i];

  // helper fade volume
  const fadeTo = (target = 1, ms = 1200) => {
    const el = a.current;
    if (!el) return;
    if (fadeRAF.current) cancelAnimationFrame(fadeRAF.current);
    const start = performance.now();
    const v0 = el.volume;
    const step = (now) => {
      const p = Math.min(1, (now - start) / ms);
      el.volume = v0 + (target - v0) * p;
      if (p < 1) fadeRAF.current = requestAnimationFrame(step);
      else fadeRAF.current = null;
    };
    fadeRAF.current = requestAnimationFrame(step);
  };

  // đổi bài
  useEffect(() => {
    const el = a.current; if (!el) return;
    wasPlaying.current = playing;
    setProgress(0);
    el.pause();
    el.src = t.src;

    const onLoaded = () => {
      el.currentTime = 0;
      if (wasPlaying.current) {
        el.volume = 0;
        el.play()
          .then(() => { setPlaying(true); fadeTo(1, 1200); })
          .catch(() => setPlaying(false));
      }
    };
    el.addEventListener("loadedmetadata", onLoaded, { once: true });
    el.load();
    return () => el.removeEventListener("loadedmetadata", onLoaded);
  }, [i]); // eslint-disable-line

  // tự phát khi vào web + fallback
  useEffect(() => {
    const el = a.current; if (!el) return;
    const okBefore = localStorage.getItem("music_autoplay_ok") === "1";

    const tryPlay = () => {
      el.volume = 0;
      el.play()
        .then(() => {
          setPlaying(true);
          localStorage.setItem("music_autoplay_ok", "1");
          fadeTo(1, 1200);
        })
        .catch(() => { /* chờ tương tác */ });
    };

    if (okBefore) tryPlay();
    else tryPlay();

    const resume = () => { if (el.paused) tryPlay(); };
    window.addEventListener("pointerdown", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });
    window.addEventListener("scroll", resume, { once: true });
    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
      window.removeEventListener("scroll", resume);
    };
  }, []); // eslint-disable-line

  const togglePlay = async () => {
    const el = a.current; if (!el) return;
    if (el.paused) {
      try {
        el.volume = 0;
        await el.play();
        setPlaying(true);
        fadeTo(1, 1200); // fade-in
      } catch { setPlaying(false); }
    } else {
      fadeTo(0, 300);   // fade-out nhanh
      setTimeout(() => { el.pause(); setPlaying(false); }, 320);
    }
  };

  const onTime = () => {
    const el = a.current; if (!el?.duration) return;
    setProgress((el.currentTime / el.duration) * 100);
  };

  const next = () => setI((x) => (x + 1) % tracks.length);
  const prev = () => setI((x) => (x - 1 + tracks.length) % tracks.length);

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-md rounded-3xl border-2 border-violet-300/70 p-5 bg-white/70 shadow-soft">
        <span className="absolute -top-3 -left-3 text-2xl">🎀</span>
        <span className="absolute -top-3 -right-3 text-2xl">🎉</span>
        <span className="absolute -bottom-3 left-6 text-2xl">🎂</span>
        <span className="absolute -bottom-3 right-6 text-2xl">🎈</span>

        <div className="mx-auto rounded-2xl border-2 border-violet-400/80 overflow-hidden w-40 h-40 md:w-48 md:h-48">
          <img src={t.cover} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="mt-4 text-center">
          <div className="font-bold text-lg">{t.title}</div>
          <div className="text-sm text-violet-700/70">{t.artist}</div>
        </div>

        <div className="mt-3 h-1.5 bg-violet-200 rounded">
          <div className="h-full bg-violet-600 rounded" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-4 flex justify-center items-center gap-8">
          <motion.button whileHover={{ scale: 1.2, rotate: -8 }} whileTap={{ scale: 0.9 }}
            className="appearance-none w-12 h-12 grid place-items-center rounded-full hover:bg-black/5"
            onClick={prev}><IconPrev /></motion.button>

          <motion.button whileHover={{ scale: 1.25 }} whileTap={{ scale: 0.9 }}
            animate={{ scale: playing ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="appearance-none w-14 h-14 grid place-items-center rounded-full hover:bg-black/5 shadow"
            onClick={togglePlay}>{playing ? <IconPause /> : <IconPlay />}</motion.button>

          <motion.button whileHover={{ scale: 1.2, rotate: 8 }} whileTap={{ scale: 0.9 }}
            className="appearance-none w-12 h-12 grid place-items-center rounded-full hover:bg-black/5"
            onClick={next}><IconNext /></motion.button>
        </div>

        <audio ref={a} preload="metadata" onTimeUpdate={onTime} onEnded={next} />
      </div>
    </div>
  );
}
