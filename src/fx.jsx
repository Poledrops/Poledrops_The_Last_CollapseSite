import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

export function Reveal({ children, delay = 0, y = 28, as = 'div', className = '', ...rest }) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function Kicker({ children }) {
  return <p className="kicker"><span className="kicker-dot" />{children}</p>
}

export function SectionHead({ kicker, title, lead, align = 'left' }) {
  return (
    <header className={`sec-head ${align}`}>
      <Reveal><Kicker>{kicker}</Kicker></Reveal>
      <Reveal delay={0.05} as="h2" className="sec-title">{title}</Reveal>
      {lead && <Reveal delay={0.1} as="p" className="sec-lead">{lead}</Reveal>}
    </header>
  )
}

export function CountUp({ to, duration = 1400 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()
  const num = parseInt(to, 10)
  const [v, setV] = useState(reduce ? num : 0)
  useEffect(() => {
    if (!inView || reduce) return
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      setV(Math.round(num * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, num, duration, reduce])
  return <span ref={ref}>{v}</span>
}

// Kırmızı vurgulu {metin} ayrıştırıcı (oyundaki kayıt ekranıyla aynı)
export function Marked({ text, upto }) {
  const out = []
  let shown = 0
  const re = /\{([^}]*)\}/g
  let last = 0
  let m
  const push = (s, red, key) => {
    const room = upto == null ? s.length : Math.max(0, upto - shown)
    const piece = s.slice(0, room)
    shown += s.length
    if (piece) out.push(red ? <b key={key} className="red">{piece}</b> : <span key={key}>{piece}</span>)
  }
  while ((m = re.exec(text))) {
    if (m.index > last) push(text.slice(last, m.index), false, `a${m.index}`)
    push(m[1], true, `b${m.index}`)
    last = m.index + m[0].length
  }
  if (last < text.length) push(text.slice(last), false, 'z')
  return <>{out}</>
}

export function plain(text) {
  return text.replace(/[{}]/g, '')
}
