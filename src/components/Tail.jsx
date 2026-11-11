import { useLang, asset } from '../lang.jsx'
import { GITHUB } from '../content.js'
import { SectionHead, Reveal, Kicker } from '../fx.jsx'

export function Tech() {
  const { t } = useLang()
  return (
    <section id="tech" className="section tech">
      <div className="wrap">
        <SectionHead kicker={t.tech.kicker} title={t.tech.title} />
        <ul className="tech-grid">
          {t.tech.items.map(([h, d], i) => (
            <Reveal as="li" key={h} delay={(i % 3) * 0.06}>
              <span className="tech-no">{String(i + 1).padStart(2, '0')}</span>
              <h3>{h}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Final() {
  const { t } = useLang()
  return (
    <section id="final" className="final">
      <div className="final-bg" style={{ backgroundImage: `url(${asset('scenes/city_ruins.webp')})` }} aria-hidden="true" />
      <div className="final-fade" aria-hidden="true" />
      <div className="wrap final-in">
        <Reveal><Kicker>{t.final.kicker}</Kicker></Reveal>
        <Reveal delay={0.05} as="h2" className="final-title">{t.final.title}</Reveal>
        <Reveal delay={0.1} as="p" className="sec-lead center">{t.final.lead}</Reveal>
        <Reveal delay={0.15} className="hero-cta center">
          <a className="btn btn-primary" href={GITHUB} target="_blank" rel="noreferrer noopener">{t.final.cta1}<span aria-hidden="true">↗</span></a>
          <a className="btn btn-ghost" href="#top">{t.final.cta2}<span aria-hidden="true">↑</span></a>
        </Reveal>
      </div>
    </section>
  )
}
