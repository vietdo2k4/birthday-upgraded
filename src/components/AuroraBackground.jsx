/* Pure CSS aurora blobs — zero JS animation, GPU only */
export default function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden="true">
      <div className="aurora-blob aurora-blob--1" />
      <div className="aurora-blob aurora-blob--2" />
      <div className="aurora-blob aurora-blob--3" />
      <div className="aurora-blob aurora-blob--4" />
      {/* floating emoji particles — CSS only */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="aurora-particle"
          style={{
            left: p.left,
            animationDuration: p.dur,
            animationDelay: p.delay,
            fontSize: p.size,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}

const PARTICLES = [
  { emoji: '🌸', left: '8%',  dur: '7s',  delay: '0s',    size: '18px' },
  { emoji: '✨', left: '18%', dur: '9s',  delay: '1.2s',  size: '14px' },
  { emoji: '💖', left: '30%', dur: '8s',  delay: '0.5s',  size: '16px' },
  { emoji: '🎀', left: '45%', dur: '11s', delay: '2s',    size: '20px' },
  { emoji: '🌸', left: '60%', dur: '7.5s',delay: '0.8s',  size: '15px' },
  { emoji: '💝', left: '72%', dur: '9.5s',delay: '1.7s',  size: '18px' },
  { emoji: '✨', left: '84%', dur: '8.5s',delay: '0.3s',  size: '13px' },
  { emoji: '🎉', left: '92%', dur: '6.8s',delay: '1s',    size: '17px' },
  { emoji: '💫', left: '50%', dur: '10s', delay: '3s',    size: '14px' },
  { emoji: '🌟', left: '25%', dur: '8.2s',delay: '2.5s',  size: '16px' },
  { emoji: '🎈', left: '70%', dur: '9.2s',delay: '0.1s',  size: '19px' },
  { emoji: '💕', left: '12%', dur: '7.8s',delay: '4s',    size: '15px' },
]
