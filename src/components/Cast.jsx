import { useRef } from 'react'
import { useLang, asset } from '../lang.jsx'
import { CAST } from '../content.js'
import { SectionHead, Reveal } from '../fx.jsx'

function Tilt({ c, lang, i }) {
  const ref = useRef(null)
  const move = (e) => {
    const el = ref.current
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${(0.5 - py) * 12}deg`)
    el.style.setProperty('--ry', `${(px - 0.5) * 14}deg`)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
  }
  const leave = () => {
    const el = ref.current
    el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg')
  }
  return (
    <Reveal delay={(i % 4) * 0.06} className="tilt-wrap">
      <article ref={ref} className="face" style={{ '--c': c.color }} onPointerMove={move} onPointerLeave={leave}>
        <div className="face-img">
          <img className="pix" src={asset(`portraits/${c.id}.webp`)} alt={c[lang][0]} width="384" height="384" loading="lazy" />
          <i className="face-shine" aria-hidden="true" />
        </div>
        <div className="face-txt">
          <b>{c[lang][0]}</b>
          <span>{c[lang][1]}</span>
        </div>
      </article>
    </Reveal>
  )
}

export default function Cast() {
  const { t, lang } = useLang()
  return (
    <section id="cast" className="section cast">
      <div className="wrap">
        <SectionHead kicker={t.cast.kicker} title={t.cast.title} lead={t.cast.lead} />
        <div className="faces">
          {CAST.map((c, i) => (<Tilt key={c.id} c={c} lang={lang} i={i} />))}
        </div>
      </div>
    </section>
  )
}
