import { useEffect, useRef, useState } from 'react'
import { BODIES } from '../data/bodies'
import type { Body } from '../data/bodies'
import { siteConfig } from '../config'

interface Props {
  body: Body | null
  onClose: () => void
  onSelect: (id: string) => void
}

function dedicatedTo(body: Body) {
  if (body.id === 'sol') return 'al Sol'
  if (body.id === 'tierra') return 'a la Tierra'
  return `a ${body.name}`
}

function VideoBlock({ body }: { body: Body }) {
  const video = body.video!
  const [start, setStart] = useState(0)
  const [autoplay, setAutoplay] = useState(false)
  const hasVideo = Boolean(video.youtubeId)

  useEffect(() => {
    setStart(0)
    setAutoplay(false)
  }, [body.id])

  return (
    <section className="panel-section">
      <h3 className="panel-h">En el canal</h3>
      <div className="video-frame">
        {hasVideo ? (
          <iframe
            key={`${video.youtubeId}-${start}`}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1&start=${start}${autoplay ? '&autoplay=1' : ''}`}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <div className="video-poster" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${body.texture})` }}>
            <span className="video-poster-badge">Vídeo disponible en el canal</span>
          </div>
        )}
      </div>
      <h4 className="video-title">{video.title}</h4>
      <p className="muted">{video.blurb}</p>
      <ol className="chapters">
        {video.chapters.map((c) => (
          <li key={c.time}>
            <button
              disabled={!hasVideo}
              onClick={() => {
                setStart(c.seconds)
                setAutoplay(true)
              }}
            >
              <time>{c.time}</time>
              <span>{c.title}</span>
            </button>
          </li>
        ))}
      </ol>
      {!hasVideo && siteConfig.channelUrl && (
        <a className="btn btn-gold" href={siteConfig.channelUrl} target="_blank" rel="noreferrer">
          Ver en YouTube
        </a>
      )}
    </section>
  )
}

export default function InfoPanel({ body, onClose, onSelect }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [body?.id])

  const index = body ? BODIES.findIndex((b) => b.id === body.id) : -1
  const prev = index > 0 ? BODIES[index - 1] : null
  const next = index >= 0 && index < BODIES.length - 1 ? BODIES[index + 1] : null

  return (
    <aside className={`info-panel glass${body ? ' is-open' : ''}`} aria-hidden={!body} aria-label="Información del cuerpo celeste">
      {body && (
        <div className="panel-scroll" ref={scroller} key={body.id}>
          <button className="panel-close" onClick={onClose} aria-label="Cerrar y volver a la vista general">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <header className="panel-head" style={{ ['--accent' as string]: body.accent }}>
            <p className="overline">{body.kind === 'star' ? 'Nuestra estrella' : `Planeta ${index} de 8`}</p>
            <h2 className="panel-title">{body.name}</h2>
            <p className="panel-sub">{body.subtitle}</p>
            <span className="accent-bar" />
          </header>

          <p className="panel-summary">{body.summary}</p>

          <section className="panel-section">
            <h3 className="panel-h">Datos clave</h3>
            <dl className="stats">
              {body.stats.map((s) => (
                <div key={s.label} className="stat">
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {body.video && <VideoBlock body={body} />}

          <section className="panel-section">
            <h3 className="panel-h">Tarjetas de información</h3>
            <div className="cards">
              {body.curiosities.map((c, i) => (
                <article className="card" key={c.title}>
                  <span className="card-n">{String(i + 1).padStart(2, '0')}</span>
                  <h4>{c.title}</h4>
                  <p>{c.text}</p>
                </article>
              ))}
            </div>
          </section>

          {!body.video && (
            <section className="panel-section">
              <div className="soon">
                <span className="soon-dot" />
                <div>
                  <h4>Vídeo en preparación</h4>
                  <p className="muted">
                    Pronto habrá un vídeo del canal dedicado {dedicatedTo(body)}. Aquí aparecerá en cuanto se publique.
                  </p>
                </div>
              </div>
            </section>
          )}

          <nav className="panel-nav" aria-label="Navegar entre cuerpos">
            <button disabled={!prev} onClick={() => prev && onSelect(prev.id)}>
              <span aria-hidden="true">←</span> {prev?.name ?? ''}
            </button>
            <button disabled={!next} onClick={() => next && onSelect(next.id)}>
              {next?.name ?? ''} <span aria-hidden="true">→</span>
            </button>
          </nav>
        </div>
      )}
    </aside>
  )
}
