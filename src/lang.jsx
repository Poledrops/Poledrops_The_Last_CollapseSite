import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { T } from './content.js'

const Ctx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const s = localStorage.getItem('pd-lang')
      if (s === 'tr' || s === 'en') return s
    } catch {}
    return (navigator.language || 'tr').toLowerCase().startsWith('tr') ? 'tr' : 'en'
  })
  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('pd-lang', lang) } catch {}
  }, [lang])
  const toggle = useCallback(() => setLang((l) => (l === 'tr' ? 'en' : 'tr')), [])
  return <Ctx.Provider value={{ lang, t: T[lang], toggle }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)

export const asset = (p) => `./assets/${p}`
