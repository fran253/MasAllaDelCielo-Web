import { useEffect, useState } from 'react'
import { MAX_MS, MIN_MS, clampEpoch, sim } from '../scene/sim'

const pad = (n: number) => String(n).padStart(2, '0')
const toInput = (ms: number) => {
  const d = new Date(ms)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Fecha simulada del modo realista, con selector y botón para volver a «ahora». */
export default function DateBar() {
  const [ms, setMs] = useState(sim.epochMs)
  useEffect(() => {
    const id = setInterval(() => setMs(sim.epochMs), 150)
    return () => clearInterval(id)
  }, [])

  const label = new Date(ms).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })

  return (
    <div className="datebar glass">
      <div className="datebar-main">
        <span className="datebar-label">Fecha simulada</span>
        <time className="datebar-date">{label}</time>
      </div>
      <div className="datebar-actions">
        <input
          type="date"
          aria-label="Elegir fecha"
          value={toInput(ms)}
          min={toInput(MIN_MS)}
          max={toInput(MAX_MS)}
          onChange={(e) => {
            if (!e.target.value) return
            const [y, m, d] = e.target.value.split('-').map(Number)
            sim.epochMs = clampEpoch(new Date(y, m - 1, d, 12, 0, 0).getTime())
            setMs(sim.epochMs)
          }}
        />
        <button
          className="ctrl ctrl-text"
          onClick={() => {
            sim.epochMs = Date.now()
            setMs(sim.epochMs)
          }}
        >
          Ahora
        </button>
      </div>
      <p className="datebar-note">
        Tamaños, distancias, órbitas, ejes y giros reales. Desde lejos los planetas son puntos: usa la barra inferior para viajar
        hasta ellos. A velocidades altas el giro se muestra ralentizado.
      </p>
    </div>
  )
}
