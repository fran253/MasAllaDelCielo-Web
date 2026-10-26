import { useEffect, useState } from 'react'
import { LogoMark } from './Logo'
import { siteConfig } from '../config'

const LINKS = [
  { href: '#sistema', label: 'Sistema Solar' },
  { href: '#mundos', label: 'Mundos' },
  { href: '#videos', label: 'Vídeos' },
  { href: '#canal', label: 'El canal' },
]

export default function Header() {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${solid ? ' is-solid' : ''}`}>
      <a href="#sistema" className="brand" aria-label={siteConfig.channelName}>
        <LogoMark />
        <span className="brand-text">
          <span className="brand-name">Más Allá del Cielo</span>
          <span className="brand-tag">Divulgación espacial</span>
        </span>
      </a>
      <nav className="site-nav" aria-label="Principal">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <a className="btn btn-gold btn-sm" href={siteConfig.channelUrl || '#canal'} target={siteConfig.channelUrl ? '_blank' : undefined} rel="noreferrer">
        Suscríbete
      </a>
    </header>
  )
}
