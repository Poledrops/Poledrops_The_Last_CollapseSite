import { LangProvider } from './lang.jsx'
import { Nav, Progress, CursorGlow, Marquee, Footer } from './components/Chrome.jsx'
import Hero from './components/Hero.jsx'
import Story from './components/Story.jsx'
import Combat from './components/Combat.jsx'
import Levels from './components/Levels.jsx'
import Archive from './components/Archive.jsx'
import Cast from './components/Cast.jsx'
import { Tech, Final } from './components/Tail.jsx'

export default function App() {
  return (
    <LangProvider>
      <Progress />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Story />
        <Combat />
        <Levels />
        <Archive />
        <Cast />
        <Tech />
        <Final />
      </main>
      <Footer />
    </LangProvider>
  )
}
