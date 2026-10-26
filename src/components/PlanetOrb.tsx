import { asset } from '../data/bodies'
import type { Body } from '../data/bodies'

/** Esfera CSS con la textura del cuerpo: se usa en el dock y en las tarjetas. */
export default function PlanetOrb({ body, size = 40 }: { body: Body; size?: number }) {
  return (
    <span
      className={`orb${body.rings ? ' has-rings' : ''}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${asset(body.texture)})`,
        ['--accent' as string]: body.accent,
      }}
      aria-hidden="true"
    />
  )
}
