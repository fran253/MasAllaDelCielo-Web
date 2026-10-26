import { BODIES } from '../data/bodies'
import PlanetOrb from './PlanetOrb'
import { LogoMark } from './Logo'
import { siteConfig } from '../config'

export function Worlds({ onExplore }: { onExplore: (id: string) => void }) {
  return (
    <section id="mundos" className="section">
      <div className="wrap">
        <p className="overline">Explora</p>
        <h2 className="section-title">Nueve mundos, nueve historias</h2>
        <p className="section-lead">
          Cada tarjeta te lleva de vuelta al sistema solar en 3D, con la cámara ya posada sobre el cuerpo elegido.
        </p>
        <div className="worlds">
          {BODIES.map((b) => (
            <button key={b.id} className="world" onClick={() => onExplore(b.id)} style={{ ['--accent' as string]: b.accent }}>
              <PlanetOrb body={b} size={72} />
              <span className="world-name">{b.name}</span>
              <span className="world-sub">{b.subtitle}</span>
              <span className={`badge${b.video ? ' badge-on' : ''}`}>{b.video ? 'Vídeo disponible' : 'Próximamente'}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Videos({ onExplore }: { onExplore: (id: string) => void }) {
  const jupiter = BODIES.find((b) => b.id === 'jupiter')!
  const video = jupiter.video!
  return (
    <section id="videos" className="section section-alt">
      <div className="wrap">
        <p className="overline">Vídeos</p>
        <h2 className="section-title">Lo último del canal</h2>
        <div className="feature">
          <div className="video-frame feature-media">
            {video.youtubeId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                title={video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="video-poster" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${jupiter.texture})` }}>
                <span className="video-poster-badge">Vídeo disponible en el canal</span>
              </div>
            )}
          </div>
          <div className="feature-copy">
            <span className="badge badge-on">Nuevo · Júpiter</span>
            <h3>{video.title}</h3>
            <p>{video.blurb}</p>
            <div className="feature-actions">
              <button className="btn btn-gold" onClick={() => onExplore('jupiter')}>
                Ver Júpiter en 3D
              </button>
              {siteConfig.channelUrl && (
                <a className="btn btn-ghost" href={siteConfig.channelUrl} target="_blank" rel="noreferrer">
                  Ver en YouTube
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="soon-strip">
          <span className="soon-dot" />
          <p>Más vídeos en camino: cada uno de los demás mundos irá sumando el suyo.</p>
        </div>
      </div>
    </section>
  )
}

const PILLARS = [
  { title: 'Rigor', text: 'Datos comprobados y fuentes a la vista. Si algo es una hipótesis, lo decimos.' },
  { title: 'Calma', text: 'Historias contadas sin prisa y sin rodeos, para que el espacio se entienda de verdad.' },
  { title: 'Imágenes reales', text: 'Material de la NASA y de misiones espaciales, en la mejor calidad disponible.' },
]

export function About() {
  return (
    <section id="canal" className="section">
      <div className="wrap about">
        <div className="about-copy">
          <p className="overline">El canal</p>
          <h2 className="section-title">Divulgación espacial, sin ruido</h2>
          <p className="section-lead">
            Más Allá del Cielo es un canal de divulgación espacial en español. Planetas, lunas, misiones y los misterios del sistema solar, contados con calma,
            rigor y sin rodeos.
          </p>
          <p className="section-lead">Cada vídeo parte de una pregunta concreta y la responde con imágenes reales y datos comprobados.</p>
          <a className="btn btn-gold" href={siteConfig.channelUrl || '#sistema'} target={siteConfig.channelUrl ? '_blank' : undefined} rel="noreferrer">
            Suscríbete al canal
          </a>
        </div>
        <ul className="pillars">
          {PILLARS.map((p) => (
            <li key={p.title} className="pillar">
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <LogoMark size={44} />
          <div>
            <strong>Más Allá del Cielo</strong>
            <p className="muted">Divulgación espacial en español.</p>
          </div>
        </div>
        <div className="credits">
          <h4>Créditos</h4>
          <p>
            Texturas de planetas y fondo estelar: <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">Solar System Scope</a>,
            basadas en imágenes de la NASA y publicadas bajo licencia{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Anillos de Urano: NASA.
          </p>
          <p>Los tamaños y distancias de la escena 3D están ajustados para que se aprecie bien cada mundo; no son proporcionales a la realidad.</p>
        </div>
      </div>
      <p className="footer-note">© {new Date().getFullYear()} Más Allá del Cielo</p>
    </footer>
  )
}
