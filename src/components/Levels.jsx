import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang, asset } from '../lang.jsx'
import { LEVELS } from '../content.js'
import { SectionHead, Reveal } from '../fx.jsx'

export default function Levels() {
  const { t, lang } = useLang()
  const [i, setI] = useState(0)
  const L = LEVELS[i]
  const x = L[lang]

  const onKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); setI((n) => Math.min(9, n + 1)) }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); setI((n) => Math.max(0, n - 1)) }
  }

  return (
    <section id="levels" className="section levels">
      <div className="wrap">
        <SectionHead kicker={t.levels.kicker} title={t.levels.title} lead={t.levels.lead} />

        <Reveal className="lv" style={{ '--c': L.color }}>
          <div className="lv-tabs" role="tablist" aria-label={t.levels.kicker} onKeyDown={onKey}>
            {LEVELS.map((lv, k) => (
              <button
                key={lv.n}
                role="tab"
                aria-selected={k === i}
                tabIndex={k === i ? 0 : -1}
                className={`lv-tab ${k === i ? 'on' : ''}`}
                style={{ '--c': lv.color }}
                onClick={() => setI(k)}
              >
                <b>{String(lv.n).padStart(2, '0')}</b>
                <span>{lv[lang].name}</span>
              </button>
            ))}
          </div>

          <div className="lv-stage">
            <div className="lv-view">
              <AnimatePresence mode="sync">
                <motion.img
                  key={L.scene}
                  className="pix lv-img"
                  src={asset(`scenes/${L.scene}.webp`)}
                  alt={`${x.name} — ${x.place}`}
                  initial={{ opacity: 0, scale: 1.12 }}
                  animate={{ opacity: 1, scale: 1.02 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </AnimatePresence>
              <div className="crt-overlay" />
              <div className="lv-num" aria-hidden="true">{String(L.n).padStart(2, '0')}</div>
              <div className="lv-badge"><span>{t.levels.lvl} {String(L.n).padStart(2, '0')}</span><b>{x.place}</b></div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={L.n + lang}
                className="lv-info"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <h3>{x.name}</h3>
                <p className="lv-desc">{x.desc}</p>

                <dl className="lv-meta">
                  <div><dt>{t.levels.mech}</dt><dd>{x.mech}</dd></div>
                  <div>
                    <dt>{t.levels.enemies}</dt>
                    <dd className="chips">{L.enemies.map((e) => (<span key={e}>{e}</span>))}</dd>
                  </div>
                </dl>

                <div className="boss">
                  {L.portrait
                    ? <img className="pix boss-face" src={asset(`portraits/${L.portrait}.webp`)} alt="" width="72" height="72" />
                    : <span className="boss-face glyph" aria-hidden="true">☠</span>}
                  <div>
                    <small>{t.levels.boss}</small>
                    <strong>{L.boss}</strong>
                    <p>{x.bossNote}</p>
                  </div>
                </div>

                <div className="diff" aria-label={`${t.levels.diff} ${L.diff}/10`}>
                  <small>{t.levels.diff}</small>
                  <div className="diff-bar">
                    {Array.from({ length: 10 }, (_, k) => (<i key={k} className={k < L.diff ? 'on' : ''} style={{ transitionDelay: `${k * 30}ms` }} />))}
                  </div>
                  <b>{L.diff}/10</b>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
