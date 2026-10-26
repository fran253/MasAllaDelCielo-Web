import { useEffect, useRef } from 'react'
import { BODIES } from '../data/bodies'
import PlanetOrb from './PlanetOrb'

interface Props {
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export default function Dock({ selectedId, onSelect }: Props) {
  const nav = useRef<HTMLElement>(null)
  // En pantallas estrechas el dock se desplaza: mantiene visible el elemento activo.
  useEffect(() => {
    const el = nav.current?.querySelector<HTMLElement>('.is-active')
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [selectedId])

  return (
    <nav className="dock" aria-label="Planetas" ref={nav}>
      <button className={`dock-item dock-home${selectedId === null ? ' is-active' : ''}`} onClick={() => onSelect(null)}>
        <span className="dock-home-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="2.2" />
            <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-20 12 12)" />
            <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(40 12 12)" />
          </svg>
        </span>
        <span className="dock-label">Vista general</span>
      </button>
      <span className="dock-sep" aria-hidden="true" />
      {BODIES.map((b) => (
        <button
          key={b.id}
          className={`dock-item${selectedId === b.id ? ' is-active' : ''}`}
          onClick={() => onSelect(b.id)}
          aria-pressed={selectedId === b.id}
          style={{ ['--accent' as string]: b.accent }}
        >
          <PlanetOrb body={b} size={34} />
          <span className="dock-label">{b.name}</span>
        </button>
      ))}
    </nav>
  )
}
