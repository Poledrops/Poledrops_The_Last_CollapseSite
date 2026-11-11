import { useEffect, useRef } from 'react'

// Yağmur çizgileri + kızıl kıvılcımlar. Ekran dışındayken durur.
export default function Particles({ density = 1 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0, visible = true, last = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const rainN = Math.round((w < 700 ? 60 : 130) * density)
    const emberN = Math.round((w < 700 ? 22 : 46) * density)
    const rain = Array.from({ length: rainN }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      l: 10 + Math.random() * 26, v: 380 + Math.random() * 520,
      a: 0.08 + Math.random() * 0.2, hue: Math.random() < 0.7 ? 200 : 300,
    }))
    const embers = Array.from({ length: emberN }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: 0.6 + Math.random() * 1.8, v: 14 + Math.random() * 34,
      p: Math.random() * 6.28, a: 0.25 + Math.random() * 0.6,
    }))

    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      if (!visible) return
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016)
      last = now
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1
      for (const d of rain) {
        d.y += d.v * dt; d.x -= d.v * dt * 0.18
        if (d.y > h + 40) { d.y = -40; d.x = Math.random() * (w + 200) }
        ctx.strokeStyle = `hsla(${d.hue},100%,75%,${d.a})`
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x + d.l * 0.18, d.y - d.l)
        ctx.stroke()
      }
      for (const e of embers) {
        e.y -= e.v * dt; e.p += dt * 1.4
        e.x += Math.sin(e.p) * 14 * dt
        if (e.y < -10) { e.y = h + 10; e.x = Math.random() * w }
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 5)
        g.addColorStop(0, `rgba(255,90,110,${e.a})`)
        g.addColorStop(1, 'rgba(255,40,80,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 5, 0, 6.283); ctx.fill()
      }
    }
    if (reduce) { draw(0); cancelAnimationFrame(raf) } else raf = requestAnimationFrame(draw)

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting }, { threshold: 0 })
    io.observe(canvas)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', resize) }
  }, [density])

  return <canvas ref={ref} className="particles" aria-hidden="true" />
}
