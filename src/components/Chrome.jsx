import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useLang, asset } from '../lang.jsx'

export function Progress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 })
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />
}

export function CursorGlow() {
  const ref = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const el = ref.current
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf
    const move = (e) => { tx = e.clientX; ty = e.clientY; el.style.opacity = 1 }
    const loop = () => {
      x += (tx - x) * 0.14; y += (ty - y) * 0.14
      el.style.transform = `translate3d(${x - 260}px, ${y - 260}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />
}

export function Nav() {
  const { t, toggle } = useLang()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const links = [
    ['story', t.nav.story], ['combat', t.nav.combat], ['levels', t.nav.levels],
    ['archive', t.nav.archive], ['cast', t.nav.cast],
  ]
  return (
    <header className={`nav ${solid ? 'solid' : ''} ${open ? 'open' : ''}`}>
      <a className="brand" href="#top" aria-label="Poledrops">
        <img src={asset('ui/logo_icon_512.png')} alt="" width="34" height="34" />
        <span>POLEDROPS</span>
      </a>
      <nav className="nav-links" aria-label="Ana menü">
        {links.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </nav>
      <div className="nav-right">
        <button className="lang" onClick={toggle} aria-label="Language">{t.footer.lang}</button>
        <button className="burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          <i /><i />
        </button>
      </div>
    </header>
  )
}

export function Marquee() {
  const { t } = useLang()
  const row = [...t.marquee, ...t.marquee]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div className="marquee-row" key={k}>
            {row.map((s, i) => (<span key={i}>{s}<em>◆</em></span>))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src={asset('ui/logo_icon_512.png')} alt="" width="44" height="44" />
        <div>
          <strong>POLEDROPS</strong>
          <span>THE LAST COLLAPSE</span>
        </div>
      </div>
      <p>{t.footer.credit}</p>
      <p className="muted">{t.footer.rights}</p>
    </footer>
  )
}
