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
    </div>
  )
}
