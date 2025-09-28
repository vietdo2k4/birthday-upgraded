import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import photos from '../data/photos'

export default function AlbumCarousel() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <div className="relative">
      {/* Đường dây trên cùng */}


      {/* Carousel ảnh */}
      <div className="carousel mt-10 select-none">
        {photos.map((p, i) => (
          <motion.div key={i} whileHover={{ y: -6 }} className="grid place-items-center">
            <div className="card-wrap">
              {/* Dây treo riêng cho từng ảnh */}
              <svg className="local-line" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden>
                <path d="M0,10 C25,7 75,13 100,10" vectorEffect="non-scaling-stroke" />
              </svg>

              <button
                onClick={() => setLightbox(p.src)}
                className="polaroid"
                style={{ transform: `rotate(${i % 2 ? -4 : 4}deg)` }}
              >
                <span className="pin" />
                <div className="polaroid-body">
                  <img src={p.src} alt={p.alt || 'photo'} className="w-full h-64 object-cover rounded-md" />
                </div>
                <span className="shadow-under" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox phóng to ảnh */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 bg-black/70 grid place-items-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox}
              className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
 