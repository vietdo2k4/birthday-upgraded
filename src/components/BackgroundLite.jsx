import { useEffect, useMemo, useRef } from "react";

const EMOJIS = ["🎈", "✨", "💖", "🎉", "🎀", "💝", "🌸", "🎂"];

export default function BackgroundLite({ emojiCount = 10 }) {
    const canvasRef = useRef(null);

    // Aura pastel rất nhẹ bằng canvas
    useEffect(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d", { alpha: true });

        let w = (cvs.width = window.innerWidth);
        let h = (cvs.height = window.innerHeight);

        const bubbles = Array.from({ length: 8 }).map(() => ({
            x: Math.random() * w,
            y: h + Math.random() * h,
            r: 60 + Math.random() * 110,
            sp: 0.25 + Math.random() * 0.4,
            hue: 240 + Math.random() * 120, // tông pastel mát
        }));

        let raf;
        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            for (const b of bubbles) {
                b.y -= b.sp;
                if (b.y + b.r < 0) b.y = h + b.r;

                const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
                g.addColorStop(0, `hsla(${b.hue}, 90%, 85%, .33)`);
                g.addColorStop(1, "transparent");

                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        };
        draw();

        const onResize = () => {
            w = cvs.width = window.innerWidth;
            h = cvs.height = window.innerHeight;
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    // Emoji bay lên (nhanh hơn, easing mượt & lắc 2D)
    const emojiNodes = useMemo(() => {
        return Array.from({ length: emojiCount }).map((_, i) => {
            const left = 5 + Math.random() * 90; // vw
            const delay = (Math.random() * 4).toFixed(2) + "s";
            const dur = (3.8 + Math.random() * 1.6).toFixed(2) + "s";   // nhanh hơn
            const sway = (5.5 + Math.random() * 1.7).toFixed(2) + "s"; // lắc nhanh hơn
            const amp = (12 + Math.random() * 22).toFixed(0) + "px";   // biên độ lắc

            const cls = ["sm", "md", "lg"][Math.floor(Math.random() * 3)];
            const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

            return (
                <span
                    key={i}
                    className={`d-emoji ${cls}`}
                    style={{
                        left: `${left}vw`,
                        ["--delay"]: delay,
                        ["--dur"]: dur,
                        ["--sway"]: sway,
                        ["--amp"]: amp
                    }}
                >
                    <span className="d-emoji__inner">{emoji}</span>
                </span>
            );
        });
    }, [emojiCount]);

    return (
        <div className="decor-lite" aria-hidden="true">
            <canvas ref={canvasRef} className="decor-canvas" />
            {emojiNodes}
        </div>
    );
}
