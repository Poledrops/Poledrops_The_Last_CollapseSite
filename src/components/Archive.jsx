import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang, asset } from '../lang.jsx'
import { RECORDS, SPEAKERS } from '../content.js'
import { SectionHead, Reveal, Marked, plain } from '../fx.jsx'

function Portrait({ sp, lang }) {
  const s = SPEAKERS[sp]
  return (
    <div className={`speaker ${s.mode}`} style={{ '--c': s.color }}>
      <div className="speaker-face">
        {s.mode === 'photo' && <img className="pix" src={asset(`portraits/${s.portrait}.webp`)} alt="" width="96" height="96" />}
        {s.mode === 'silhouette' && (
          <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="24" r="11" /><path d="M10 60c2-16 12-22 22-22s20 6 22 22z" /></svg>
        )}
        {s.mode === 'signal' && (
          <svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M6 32h10l5-14 8 28 7-22 5 8h17" />
          </svg>
        )}
      </div>
      <div className="speaker-name">
        <b>{s[lang][0]}</b>
        <span>{s[lang][1]}</span>
      </div>
    </div>
  )
}

export default function Archive() {
  const { t, lang } = useLang()
  const [rec, setRec] = useState(0)
  const [line, setLine] = useState(0)
  const [chars, setChars] = useState(0)
  const [run, setRun] = useState(0) // yeniden başlatma sayacı
  const R = RECORDS[rec]
  const cur = R.lines[line]
  const full = plain(cur[1][lang])
  const done = chars >= full.length
  const last = line === R.lines.length - 1
  const reduce = useRef(false)

  useEffect(() => { reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches }, [])

  // yazma efekti
  useEffect(() => {
    if (reduce.current) { setChars(full.length); return }
    setChars(0)
    const id = setInterval(() => setChars((c) => c + 1), 24)
    return () => clearInterval(id)
  }, [rec, line, lang, run, full.length])

  // satır bitince bir sonrakine geç
  useEffect(() => {
    if (!done || last) return
    const id = setTimeout(() => setLine((l) => l + 1), 1500)
    return () => clearTimeout(id)
  }, [done, last, line, rec, run])

  const select = (k) => { setRec(k); setLine(0); setChars(0); setRun((n) => n + 1) }
  const skip = () => { if (!done) setChars(full.length); else if (!last) setLine((l) => l + 1) }
  const replay = () => { setLine(0); setChars(0); setRun((n) => n + 1) }

  return (
    <section id="archive" className="section archive">
      <div className="wrap">
        <SectionHead kicker={t.archive.kicker} title={t.archive.title} lead={t.archive.lead} />

        <Reveal className="player">
          <ul className="rec-list" aria-label={t.archive.list}>
            <li className="rec-list-head">{t.archive.list} · {RECORDS.length}/41</li>
            {RECORDS.map((r, k) => (
              <li key={r.no}>
                <button className={k === rec ? 'on' : ''} onClick={() => select(k)}>
                  <b>№ {r.no}</b>
                  <span>{r.cat[lang]}</span>
                  <small>{r.date} · {r.time}</small>
                </button>
              </li>
            ))}
          </ul>

          <div className="screen">
            <div className="screen-bg">
              <AnimatePresence>
                <motion.img
                  key={R.scene}
                  className="pix"
                  src={asset(`scenes/${R.scene}.webp`)}
                  alt=""
                  initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                />
              </AnimatePresence>
            </div>
            <div className="crt-overlay strong" />
            <div className="screen-top">
              <span><i className="rec-dot" /> {t.archive.rec} № {R.no}</span>
              <span>{R.date} · {R.time}</span>
            </div>
            <div className="screen-place">{R.place[lang]}</div>

            <div className="screen-body">
              <AnimatePresence mode="wait">
                <motion.div key={`${rec}-${cur[0]}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Portrait sp={cur[0]} lang={lang} />
                </motion.div>
              </AnimatePresence>

              <div className="subs" style={{ '--c': SPEAKERS[cur[0]].color }}>
                {R.lines.slice(0, line).slice(-2).map((l, k) => (
                  <p key={`${rec}-${line}-${k}`} className="sub old"><Marked text={l[1][lang]} /></p>
                ))}
                <p className="sub cur">
                  <Marked text={cur[1][lang]} upto={chars} />
                  {!done && <span className="caret" />}
                </p>
              </div>
            </div>

            <div className="screen-bar">
              <div className="progress-dots" aria-hidden="true">
                {R.lines.map((_, k) => (<i key={k} className={k <= line ? 'on' : ''} />))}
              </div>
              <div className="screen-btns">
                {done && last ? <button onClick={replay}>{t.archive.replay}</button> : <button onClick={skip}>{t.archive.skip}</button>}
              </div>
            </div>
          </div>
        </Reveal>
        <p className="fineprint">{t.archive.note}</p>
      </div>
    </section>
  )
}
