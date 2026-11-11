import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useLang, asset } from '../lang.jsx'
import Particles from '../Particles.jsx'

function Sprite() {
  const [f, setF] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setF((n) => (n + 1) % 11), 110)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="hero-sprite" aria-hidden="true">
      <img src={asset(`sprite/idle_${String(f).padStart(2, '0')}.png`)} alt="" width="256" height="256" />
      <span className="sprite-shadow" />
    </div>
  )
}

export default function Hero() {
  const { t } = useLang()
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const fgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const [m, setM] = useState({ x: 0, y: 0 })

  const onMove = (e) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    setM({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 })
  }

  return (
    <section id="top" className="hero" ref={ref} onPointerMove={onMove}>
      <motion.div className="hero-bg" style={{ y: bgY }}>
        <div
          className="hero-bg-img"
          style={{ backgroundImage: `url(${asset('ui/title_bg.webp')})`, transform: `translate3d(${m.x * -18}px, ${m.y * -10}px, 0) scale(1.08)` }}
        />
      </motion.div>
      <div className="hero-vignette" aria-hidden="true" />
      <Particles />
      <div className="scan" aria-hidden="true" />

      <motion.div className="hero-inner" style={{ y: textY, opacity: fgOpacity }}>
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
          <i className="live" /> {t.hero.eyebrow}
        </motion.p>

        <h1 className="title" aria-label="Poledrops: The Last Collapse">
          <motion.span
            className="title-main glitch"
            data-text="POLEDROPS"
            initial={{ opacity: 0, letterSpacing: '0.5em', filter: 'blur(14px)' }}
            animate={{ opacity: 1, letterSpacing: '0.06em', filter: 'blur(0px)' }}
            transition={{ delay: 0.35, duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
          >POLEDROPS</motion.span>
          <motion.span
            className="title-sub"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 1 }}
          >
            <i />{t.hero.sub}<i />
          </motion.span>
        </h1>

        <motion.p className="hero-tag" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.9 }}>
          {t.hero.tag}
        </motion.p>

        <motion.div className="hero-cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.55, duration: 0.9 }}>
          <a className="btn btn-primary" href="#story">{t.hero.cta1}<span aria-hidden="true">↓</span></a>
          <a className="btn btn-ghost" href="#levels">{t.hero.cta2}<span aria-hidden="true">↓</span></a>
        </motion.div>

        <motion.ul className="hero-chips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 1 }}>
          {t.hero.chips.map((c) => (<li key={c}>{c}</li>))}
        </motion.ul>
      </motion.div>

      <Sprite />

      <div className="hud hud-tl" aria-hidden="true"><span>SYS.LOG</span><b>{t.hero.date}</b></div>
      <div className="hud hud-tr" aria-hidden="true"><span>A-01</span><b>HP ▮▮▮▮▮▮▯▯</b></div>
      <a className="scroll-cue" href="#story" aria-label={t.hero.scroll}>
        <span>{t.hero.scroll}</span><i />
      </a>
    </section>
  )
}
