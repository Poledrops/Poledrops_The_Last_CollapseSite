import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../lang.jsx'
import { KEYS } from '../content.js'
import { SectionHead, Reveal } from '../fx.jsx'

const ICONS = {
  sword: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 52 46 18" /><path d="M46 18l6-8-8 6" /><path d="M10 54l4-4" /><path d="M16 44l6 6" />
      <path className="sl" d="M18 12c14 2 26 14 30 30" opacity=".5" /><path className="sl" d="M24 8c16 4 30 18 32 34" opacity=".3" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 8 12 16v14c0 14 8 22 20 26 12-4 20-12 20-26V16z" /><path d="M32 18v30" opacity=".5" /><path d="M22 28h20" opacity=".5" />
    </svg>
  ),
  dash: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 22h22M6 32h26M12 42h20" opacity=".5" /><path d="M36 16l16 16-16 16" /><path d="M28 32h24" />
    </svg>
  ),
  burst: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="32" r="8" /><circle cx="32" cy="32" r="16" opacity=".5" /><circle cx="32" cy="32" r="25" opacity=".25" />
      <path d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M52 12l-6 6M18 46l-6 6" opacity=".6" />
    </svg>
  ),
  gun: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 26h38l6 4v6H30l-4 12h-8l2-12H8z" /><path d="M52 31h6" opacity=".6" /><path d="M58 28l4-3M58 34l4 3" opacity=".5" />
    </svg>
  ),
  wall: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M46 6v52" /><path d="M46 14h6M46 26h6M46 38h6M46 50h6" opacity=".5" />
      <circle cx="32" cy="16" r="4" /><path d="M34 22l-6 12 8 6M28 34l-8 4M36 40l-2 12" />
    </svg>
  ),
}

function Controls() {
  const { t, lang } = useLang()
  const [active, setActive] = useState(null)
  const [last, setLast] = useState(null)
  const timer = useRef()

  useEffect(() => {
    const down = (e) => {
      const i = KEYS.findIndex((k) => k.code.includes(e.code))
      if (i < 0) return
      if (e.code === 'Space') e.preventDefault()
      setActive(i); setLast(i)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setActive(null), 260)
    }
    window.addEventListener('keydown', down)
    return () => { window.removeEventListener('keydown', down); clearTimeout(timer.current) }
  }, [])

  const press = (i) => {
    setActive(i); setLast(i)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setActive(null), 260)
  }

  return (
    <div className="controls">
      <div className="controls-head">
        <h3>{t.combat.ctrlTitle}</h3>
        <p>{t.combat.ctrlHint}</p>
      </div>
      <div className="keys">
        {KEYS.map((k, i) => (
          <button
            key={k.k}
            className={`key ${active === i ? 'on' : ''} ${k.wide ? 'wide' : ''}`}
            onPointerDown={() => press(i)}
            aria-label={k[lang]}
          >
            <kbd>{k.k}</kbd>
            <span>{k[lang]}</span>
            <small>{t.combat.pad} · {k.pad}</small>
          </button>
        ))}
      </div>
      <div className="readout" aria-live="polite">
        <i className={last != null ? 'blink' : ''} />
        <code>{last == null ? t.combat.ctrlIdle : `> ${KEYS[last].k.replace(' ', ' / ')} → ${KEYS[last][lang]}`}</code>
      </div>
    </div>
  )
}

export default function Combat() {
  const { t } = useLang()
  return (
    <section id="combat" className="section combat">
      <div className="wrap">
        <SectionHead kicker={t.combat.kicker} title={t.combat.title} lead={t.combat.lead} />
        <div className="bento">
          {t.combat.cards.map((c, i) => (
            <Reveal key={c.t} delay={(i % 3) * 0.06} className={`card ${c.span === 'lg' ? 'lg' : ''}`}>
              <motion.div className="card-in" whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
                <span className="card-icon">{ICONS[c.icon]}</span>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
                <i className="card-glow" aria-hidden="true" />
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal as="p" className="anim-note"><b>//</b> {t.combat.anim}</Reveal>
        <Reveal><Controls /></Reveal>
      </div>
    </section>
  )
}
