import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLang, asset } from '../lang.jsx'
import { Kicker, Reveal, CountUp } from '../fx.jsx'

function Line({ text, i, progress }) {
  const start = 0.1 + i * 0.22
  const opacity = useTransform(progress, [start, start + 0.18], [0.12, 1])
  const x = useTransform(progress, [start, start + 0.18], [24, 0])
  return <motion.p className="story-line" style={{ opacity, x }}>{text}</motion.p>
}

export default function Story() {
  const { t } = useLang()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.6'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '8%'])

  return (
    <section id="story" className="section story" ref={ref}>
      <div className="story-grid wrap">
        <div className="story-copy">
          <Reveal><Kicker>{t.story.kicker}</Kicker></Reveal>
          <Reveal delay={0.05} as="h2" className="sec-title">{t.story.title}</Reveal>
          <div className="story-lines">
            {t.story.lines.map((l, i) => (<Line key={i} text={l} i={i} progress={scrollYProgress} />))}
          </div>
          <Reveal as="blockquote" className="story-quote">
            <span aria-hidden="true">“</span>{t.story.quote}
          </Reveal>
        </div>

        <Reveal className="story-visual" y={40}>
          <div className="crt-frame">
            <motion.img src={asset('scenes/hospital_ward.webp')} alt="" className="pix" style={{ y: imgY, scale: 1.14 }} />
            <div className="crt-overlay" />
            <span className="tag tag-red">A-01</span>
            <span className="tag tag-cyan">● REC 06:20:44</span>
          </div>
        </Reveal>
      </div>

      <div className="wrap">
        <ul className="stat-row">
          {t.story.stats.map(([n, l], i) => (
            <Reveal as="li" key={l} delay={i * 0.07}>
              <strong><CountUp to={n} /></strong>
              <span>{l}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
