import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import photos from '../data/photos'

/* SVG gradient dùng chung cho dây treo */
const WIRE_GRAD_ID = 'wireGrad'
const WireGradDef = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
    <defs>
      <linearGradient id={WIRE_GRAD_ID} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#f9a8d4" />
        <stop offset="30%"  stopColor="#c4b5fd" />
        <stop offset="60%"  stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#f9a8d4" />
      </linearGradient>
    </defs>
  </svg>
)

const ROTATIONS = [3, -3.5, 4, -2.5, 3.5, -4, 2, -3]

export default function AlbumCarousel() {
  const [lightbox, setLightbox] = useState(null)
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const carouselRef = useRef(null)

  const scroll = (dir) => {
    const el = carouselRef.current
    if (!el) return
    const cardW = el.querySelector('.card-wrap')?.offsetWidth ?? 320
    el.scrollBy({ left: dir * (cardW + 20), behavior: 'smooth' })
  }

  const openLightbox = (src, idx) => {
    setLightbox(src)
    setLightboxIdx(idx)
  }

  const navLightbox = (dir) => {
    const next = (lightboxIdx + dir + photos.length) % photos.length
    setLightbox(photos[next].src)
    setLightboxIdx(next)
  }

  return (
    <div className="carousel-shell">
      {/* SVG gradient def ẩn */}
      <WireGradDef />

      {/* Nút mũi tên trái */}
      <button className="carousel-arrow carousel-arrow--left" onClick={() => scroll(-1)} aria-label="Trước">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Carousel ảnh */}
      <div className="carousel mt-10 select-none" ref={carouselRef}>
        {photos.map((p, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -8, transition: { type: 'spring', stiffness: 260, damping: 18 } }}
            className="grid place-items-center"
          >
            <div className="card-wrap">
              {/* Dây treo gradient */}
              <svg
                className="local-line"
                viewBox="0 0 100 28"
                preserveAspectRatio="none"
                aria-hidden
              >
                {/* bóng mờ phía dưới */}
                <path className="wire-shadow" d="M0,16 C25,10 75,22 100,16" />
                {/* dây chính gradient */}
                <path className="wire-main" d="M0,16 C25,10 75,22 100,16" />
              </svg>

              <button
                onClick={() => openLightbox(p.src, i)}
                className="polaroid"
                style={{ transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)` }}
              >
                {/* lớp trong trắng ngà có sticker */}
                <div className="polaroid-inner">
                  <div className="polaroid-body">
                    <img src={p.src} alt={p.alt || 'photo'} />
                  </div>
                </div>

                <span className="shadow-under" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nút mũi tên phải */}
      <button className="carousel-arrow carousel-arrow--right" onClick={() => scroll(1)} aria-label="Tiếp">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Lightbox phóng to ảnh */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm grid place-items-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* viền gradient cho lightbox */}
              <div style={{
                padding: '3px',
                borderRadius: '22px',
                background: 'linear-gradient(135deg, #fde68a, #fbcfe8, #c4b5fd, #bfdbfe)',
                boxShadow: '0 20px 60px rgba(0,0,0,.5)'
              }}>
                <img
                  src={lightbox}
                  className="max-h-[82vh] max-w-[88vw] rounded-[18px] block"
                  alt="preview"
                />
              </div>

              {/* Nút điều hướng trong lightbox */}
              <button
                onClick={() => navLightbox(-1)}
                className="lightbox-nav lightbox-nav--left"
                aria-label="Ảnh trước"
              >‹</button>
              <button
                onClick={() => navLightbox(1)}
                className="lightbox-nav lightbox-nav--right"
                aria-label="Ảnh tiếp"
              >›</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}