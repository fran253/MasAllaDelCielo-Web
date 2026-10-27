import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'
import Header from './components/Header'
import Dock from './components/Dock'
import InfoPanel from './components/InfoPanel'
import SceneControls from './components/SceneControls'
import DateBar from './components/DateBar'
import { sim } from './scene/sim'
import { About, Footer, Videos, Worlds } from './components/Sections'
import { BODIES, bodyById } from './data/bodies'

const SolarScene = lazy(() => import('./scene/SolarScene'))

function Loader() {
  const { progress, active } = useProgress()
  const [gone, setGone] = useState(false)
  useEffect(() => {
    if (!active && progress >= 100) {
      const t = setTimeout(() => setGone(true), 500)
      return () => clearTimeout(t)
    }
  }, [active, progress])
  if (gone) return null
  const done = !active && progress >= 100
  return (
    <div className={`loader${done ? ' is-done' : ''}`} role="status" aria-live="polite">
      <div className="loader-inner">
        <div className="loader-ring" />
        <p className="overline">Preparando el sistema solar</p>
        <div className="loader-bar">
          <span style={{ width: `${Math.round(progress)}%` }} />
        </div>
        <p className="muted">{Math.round(progress)} %</p>
      </div>
    </div>
  )
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [real, setReal] = useState(false)
  const [realSpeed, setRealSpeed] = useState(sim.realSpeed)
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [stageVisible, setStageVisible] = useState(true)
  const stage = useRef<HTMLElement>(null)

  const select = useCallback((id: string | null) => setSelectedId(id), [])

  const changeMode = useCallback((value: boolean) => {
    // Al entrar en el modo realista se parte de la fecha de hoy.
    if (value && !sim.real) sim.epochMs = Date.now()
    sim.real = value
    setReal(value)
  }, [])

  // La escena deja de renderizar cuando no se ve, para no gastar batería.
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setStageVisible(entry.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Teclado: Esc vuelve a la vista general, ← → recorren los cuerpos.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /input|textarea|select/i.test(e.target.tagName)) return
      if (e.key === 'Escape') setSelectedId(null)
      if (!stageVisible) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        setSelectedId((cur) => {
          const i = cur ? BODIES.findIndex((b) => b.id === cur) : -1
          const n = e.key === 'ArrowRight' ? Math.min(i + 1, BODIES.length - 1) : Math.max(i - 1, 0)
          return BODIES[n].id
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stageVisible])

  const explore = useCallback((id: string) => {
    setSelectedId(id)
    document.getElementById('sistema')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const body = selectedId ? bodyById(selectedId) ?? null : null

  return (
    <>
      <Header />
      <section id="sistema" className={`stage${body ? ' has-selection' : ''}`} ref={stage}>
        <div className="stage-canvas">
          <Suspense fallback={null}>
            <SolarScene selectedId={selectedId} onSelect={select} showOrbits={showOrbits} showLabels={showLabels} real={real} active={stageVisible} />
          </Suspense>
        </div>
        <div className="stage-vignette" aria-hidden="true" />

        <div className={`hero${body || real ? ' is-hidden' : ''}`}>
          <p className="overline">Sistema Solar · Experiencia 3D</p>
          <h1>
            Viaja por el <em>sistema solar</em>
          </h1>
          <p className="hero-lead">Gira, acércate y toca cualquier planeta para descubrir sus datos y los vídeos del canal.</p>
          <ul className="hints" aria-label="Cómo moverte">
            <li><kbd>Arrastrar</kbd> girar</li>
            <li><kbd>Rueda</kbd> zoom</li>
            <li><kbd>Clic</kbd> elegir planeta</li>
          </ul>
        </div>

        <SceneControls
          real={real}
          paused={paused}
          speed={speed}
          realSpeed={realSpeed}
          showOrbits={showOrbits}
          showLabels={showLabels}
          onReal={changeMode}
          onPaused={setPaused}
          onSpeed={setSpeed}
          onRealSpeed={setRealSpeed}
          onOrbits={setShowOrbits}
          onLabels={setShowLabels}
        />
        {real && <DateBar />}
        <InfoPanel body={body} onClose={() => setSelectedId(null)} onSelect={select} />
        <Dock selectedId={selectedId} onSelect={select} />
        <Loader />
      </section>

      <main>
        <Worlds onExplore={explore} />
        <Videos onExplore={explore} />
        <About />
      </main>
      <Footer />
    </>
  )
}
