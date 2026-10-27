import { sim } from '../scene/sim'

interface Props {
  real: boolean
  paused: boolean
  speed: number
  realSpeed: number
  showOrbits: boolean
  showLabels: boolean
  onReal: (v: boolean) => void
  onPaused: (v: boolean) => void
  onSpeed: (v: number) => void
  onRealSpeed: (v: number) => void
  onOrbits: (v: boolean) => void
  onLabels: (v: boolean) => void
}

const SPEEDS = [0.5, 1, 4, 12]

/** Segundos simulados por segundo real. */
const REAL_SPEEDS = [
  { label: 'Tiempo real', title: '1 segundo por segundo', value: 1 },
  { label: '1 h/s', title: '1 hora por segundo', value: 3600 },
  { label: '1 día/s', title: '1 día por segundo', value: 86400 },
  { label: '1 mes/s', title: '1 mes por segundo', value: 2629800 },
  { label: '1 año/s', title: '1 año por segundo', value: 31557600 },
]

export default function SceneControls(p: Props) {
  return (
    <div className="controls glass" role="group" aria-label="Controles de la escena">
      <div className="mode-switch" role="group" aria-label="Modo">
        <button className={`ctrl ctrl-text${!p.real ? ' is-on' : ''}`} onClick={() => p.onReal(false)} aria-pressed={!p.real}>
          Estilizado
        </button>
        <button
          className={`ctrl ctrl-text${p.real ? ' is-on' : ''}`}
          onClick={() => p.onReal(true)}
          aria-pressed={p.real}
          title="Escala, tiempos y posiciones reales"
        >
          Realista
        </button>
      </div>
      <span className="ctrl-sep" aria-hidden="true" />
      <button
        className="ctrl"
        onClick={() => {
          sim.paused = !p.paused
          p.onPaused(!p.paused)
        }}
        aria-label={p.paused ? 'Reanudar movimiento' : 'Pausar movimiento'}
        title={p.paused ? 'Reanudar' : 'Pausar'}
      >
        {p.paused ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
        )}
      </button>
      <div className="ctrl-speeds" role="group" aria-label="Velocidad">
        {p.real
          ? REAL_SPEEDS.map((s) => (
              <button
                key={s.value}
                title={s.title}
                className={`ctrl ctrl-text${p.realSpeed === s.value ? ' is-on' : ''}`}
                onClick={() => {
                  sim.realSpeed = s.value
                  p.onRealSpeed(s.value)
                }}
              >
                {s.label}
              </button>
            ))
          : SPEEDS.map((s) => (
              <button
                key={s}
                className={`ctrl ctrl-text${p.speed === s ? ' is-on' : ''}`}
                onClick={() => {
                  sim.speed = s
                  p.onSpeed(s)
                }}
              >
                {s}×
              </button>
            ))}
      </div>
      <span className="ctrl-sep" aria-hidden="true" />
      <button className={`ctrl ctrl-text${p.showOrbits ? ' is-on' : ''}`} onClick={() => p.onOrbits(!p.showOrbits)} aria-pressed={p.showOrbits}>
        Órbitas
      </button>
      <button className={`ctrl ctrl-text${p.showLabels ? ' is-on' : ''}`} onClick={() => p.onLabels(!p.showLabels)} aria-pressed={p.showLabels}>
        Nombres
      </button>
    </div>
  )
}
