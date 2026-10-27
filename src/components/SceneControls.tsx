import { useEffect, useRef, useState } from 'react'
import { sim } from '../scene/sim'

interface Props {
  paused: boolean
  speed: number
  showOrbits: boolean
  showLabels: boolean
  onPaused: (v: boolean) => void
  onSpeed: (v: number) => void
  onOrbits: (v: boolean) => void
  onLabels: (v: boolean) => void
}

const SPEEDS = [0.5, 1, 4, 12]

export default function SceneControls({ paused, speed, showOrbits, showLabels, onPaused, onSpeed, onOrbits, onLabels }: Props) {
  const [info, setInfo] = useState(false)
  const infoRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!info) return
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !infoRef.current?.contains(e.target as Node)) setInfo(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [info])
  return (
    <div className="controls glass" role="group" aria-label="Controles de la escena">
      <button
        className="ctrl"
        onClick={() => {
          sim.paused = !paused
          onPaused(!paused)
        }}
        aria-label={paused ? 'Reanudar movimiento' : 'Pausar movimiento'}
        title={paused ? 'Reanudar' : 'Pausar'}
      >
        {paused ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
        )}
      </button>
      <div className="ctrl-speeds" role="group" aria-label="Velocidad">
        {SPEEDS.map((s) => (
          <button
            key={s}
            className={`ctrl ctrl-text${speed === s ? ' is-on' : ''}`}
            onClick={() => {
              sim.speed = s
              onSpeed(s)
            }}
          >
            {s}×
          </button>
        ))}
      </div>
      <span className="ctrl-sep" aria-hidden="true" />
      <button className={`ctrl ctrl-text${showOrbits ? ' is-on' : ''}`} onClick={() => onOrbits(!showOrbits)} aria-pressed={showOrbits}>
        Órbitas
      </button>
      <button className={`ctrl ctrl-text${showLabels ? ' is-on' : ''}`} onClick={() => onLabels(!showLabels)} aria-pressed={showLabels}>
        Nombres
      </button>
      <span className="info-wrap" ref={infoRef}>
        <button className="ctrl ctrl-info" onClick={() => setInfo((v) => !v)} aria-label="Información sobre el modelo" aria-expanded={info}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <circle cx="12" cy="7.8" r="0.6" fill="currentColor" />
          </svg>
        </button>
        {info && (
          <div className="info-pop glass" role="status">
            Este modelo de sistema solar está adaptado para la facilidad del uso y de la web, los tamaños y posiciones no coinciden con la realidad
          </div>
        )}
      </span>
    </div>
  )
}
