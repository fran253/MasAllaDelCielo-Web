/**
 * Efemérides sencillas para el modo realista (matemática pura, sin dependencias).
 *
 * - Posiciones: elementos keplerianos aproximados del JPL de la NASA (E. M. Standish,
 *   «Keplerian Elements for Approximate Positions of the Major Planets»), válidos entre 1800 y 2050.
 * - Orientación y giro: elementos de rotación de la IAU (ascensión recta y declinación del polo norte,
 *   meridiano origen W).
 * - Luna: longitud media y nodo medios (sin perturbaciones).
 *
 * Precisión: de décimas de grado a pocos grados según el planeta y la fecha. Vale para divulgar,
 * no para un observatorio.
 */

const D2R = Math.PI / 180

export type Vec3 = [number, number, number]

/** Cada elemento es [valor en J2000, variación por siglo]. Ángulos en grados, a en UA. */
interface Elements {
  a: [number, number]
  e: [number, number]
  I: [number, number]
  L: [number, number]
  peri: [number, number]
  node: [number, number]
}

const ELEMENTS: Record<string, Elements> = {
  mercurio: {
    a: [0.38709927, 0.00000037],
    e: [0.20563593, 0.00001906],
    I: [7.00497902, -0.00594749],
    L: [252.2503235, 149472.67411175],
    peri: [77.45779628, 0.16047689],
    node: [48.33076593, -0.12534081],
  },
  venus: {
    a: [0.72333566, 0.0000039],
    e: [0.00677672, -0.00004107],
    I: [3.39467605, -0.0007889],
    L: [181.9790995, 58517.81538729],
    peri: [131.60246718, 0.00268329],
    node: [76.67984255, -0.27769418],
  },
  // Baricentro Tierra-Luna (la diferencia con el centro de la Tierra es de unos 4.700 km).
  tierra: {
    a: [1.00000261, 0.00000562],
    e: [0.01671123, -0.00004392],
    I: [-0.00001531, -0.01294668],
    L: [100.46457166, 35999.37244981],
    peri: [102.93768193, 0.32327364],
    node: [0, 0],
  },
  marte: {
    a: [1.52371034, 0.00001847],
    e: [0.0933941, 0.00007882],
    I: [1.84969142, -0.00813131],
    L: [-4.55343205, 19140.30268499],
    peri: [-23.94362959, 0.44441088],
    node: [49.55953891, -0.29257343],
  },
  jupiter: {
    a: [5.202887, -0.00011607],
    e: [0.04838624, -0.00013253],
    I: [1.30439695, -0.00183714],
    L: [34.39644051, 3034.74612775],
    peri: [14.72847983, 0.21252668],
    node: [100.47390909, 0.20469106],
  },
  saturno: {
    a: [9.53667594, -0.0012506],
    e: [0.05386179, -0.00050991],
    I: [2.48599187, 0.00193609],
    L: [49.95424423, 1222.49362201],
    peri: [92.59887831, -0.41897216],
    node: [113.66242448, -0.28867794],
  },
  urano: {
    a: [19.18916464, -0.00196176],
    e: [0.04725744, -0.00004397],
    I: [0.77263783, -0.00242939],
    L: [313.23810451, 428.48202785],
    peri: [170.9542763, 0.40805281],
    node: [74.01692503, 0.04240589],
  },
  neptuno: {
    a: [30.06992276, 0.00026291],
    e: [0.00859048, 0.00005105],
    I: [1.77004347, 0.00035372],
    L: [-55.12002969, 218.45945325],
    peri: [44.96476227, -0.32241464],
    node: [131.78422574, -0.00508664],
  },
}

/** Fecha juliana a partir de milisegundos Unix. */
export const julianDate = (ms: number) => ms / 86400000 + 2440587.5
const J2000 = 2451545.0

const norm180 = (deg: number) => {
  let d = deg % 360
  if (d > 180) d -= 360
  if (d < -180) d += 360
  return d
}

function solveKepler(M: number, e: number) {
  let E = M + e * Math.sin(M)
  for (let i = 0; i < 8; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E))
    E -= dE
    if (Math.abs(dE) < 1e-10) break
  }
  return E
}

interface Orbit {
  a: number
  e: number
  I: number
  w: number
  node: number
  M: number
}

function orbitAt(id: string, jd: number): Orbit | null {
  const el = ELEMENTS[id]
  if (!el) return null
  const T = (jd - J2000) / 36525
  const at = (p: [number, number]) => p[0] + p[1] * T
  const peri = at(el.peri)
  const node = at(el.node)
  return {
    a: at(el.a),
    e: at(el.e),
    I: at(el.I) * D2R,
    w: (peri - node) * D2R,
    node: node * D2R,
    M: norm180(at(el.L) - peri) * D2R,
  }
}

function toEcliptic(o: Orbit, xp: number, yp: number): Vec3 {
  const cw = Math.cos(o.w), sw = Math.sin(o.w)
  const cn = Math.cos(o.node), sn = Math.sin(o.node)
  const ci = Math.cos(o.I), si = Math.sin(o.I)
  return [
    (cw * cn - sw * sn * ci) * xp + (-sw * cn - cw * sn * ci) * yp,
    (cw * sn + sw * cn * ci) * xp + (-sw * sn + cw * cn * ci) * yp,
    sw * si * xp + cw * si * yp,
  ]
}

/** Posición heliocéntrica en UA, ejes eclípticos J2000 (x hacia el equinoccio, z al norte eclíptico). */
export function planetPositionAU(id: string, jd: number): Vec3 {
  const o = orbitAt(id, jd)
  if (!o) return [0, 0, 0]
  const E = solveKepler(o.M, o.e)
  return toEcliptic(o, o.a * (Math.cos(E) - o.e), o.a * Math.sqrt(1 - o.e * o.e) * Math.sin(E))
}

/** Puntos de la elipse orbital completa (UA, ejes eclípticos). */
export function orbitEllipseAU(id: string, jd: number, n = 256): Vec3[] {
  const o = orbitAt(id, jd)
  if (!o) return []
  const pts: Vec3[] = []
  for (let i = 0; i <= n; i++) {
    const E = (i / n) * Math.PI * 2
    pts.push(toEcliptic(o, o.a * (Math.cos(E) - o.e), o.a * Math.sqrt(1 - o.e * o.e) * Math.sin(E)))
  }
  return pts
}

/** Posición de la Luna respecto al centro de la Tierra en km (ejes eclípticos). Aproximada. */
export function moonOffsetKm(jd: number): Vec3 {
  const d = jd - J2000
  const L = (218.316 + 13.176396 * d) * D2R // longitud media
  const node = (125.08 - 0.0529539 * d) * D2R // nodo ascendente medio
  const I = 5.145 * D2R
  const u = L - node
  const r = 384400
  return [
    r * (Math.cos(node) * Math.cos(u) - Math.sin(node) * Math.cos(I) * Math.sin(u)),
    r * (Math.sin(node) * Math.cos(u) + Math.cos(node) * Math.cos(I) * Math.sin(u)),
    r * Math.sin(I) * Math.sin(u),
  ]
}

/* ------------------------------------------------------------------ */
/* Rotación (IAU): polo norte y meridiano origen                       */
/* ------------------------------------------------------------------ */

interface Rotation {
  ra: number // ascensión recta del polo norte (°)
  dec: number // declinación del polo norte (°)
  W0: number // meridiano origen en J2000 (°)
  rate: number // °/día (negativo = rotación retrógrada)
}

const ROTATION: Record<string, Rotation> = {
  sol: { ra: 286.13, dec: 63.87, W0: 84.176, rate: 14.1844 },
  mercurio: { ra: 281.0103, dec: 61.4155, W0: 329.5988, rate: 6.1385108 },
  venus: { ra: 272.76, dec: 67.16, W0: 160.2, rate: -1.4813688 },
  tierra: { ra: 0.0, dec: 90.0, W0: 190.147, rate: 360.9856235 },
  marte: { ra: 317.269202, dec: 54.432516, W0: 176.049863, rate: 350.891982443 },
  jupiter: { ra: 268.056595, dec: 64.495303, W0: 284.95, rate: 870.536 },
  saturno: { ra: 40.589, dec: 83.537, W0: 38.9, rate: 810.7939024 },
  urano: { ra: 257.311, dec: -15.175, W0: 203.81, rate: -501.1600928 },
  neptuno: { ra: 299.36, dec: 43.46, W0: 249.978, rate: 541.1397757 },
}

const OBLIQUITY = 23.4392911 * D2R

/** Rotación en °/día de un cuerpo (con signo). */
export const rotationRateDegPerDay = (id: string) => ROTATION[id]?.rate ?? 0

/** Meridiano origen verdadero en grados para la fecha. */
export const primeMeridianDeg = (id: string, jd: number) => {
  const r = ROTATION[id]
  return r ? r.W0 + r.rate * (jd - J2000) : 0
}

const eqToEcl = (v: Vec3): Vec3 => [
  v[0],
  v[1] * Math.cos(OBLIQUITY) + v[2] * Math.sin(OBLIQUITY),
  -v[1] * Math.sin(OBLIQUITY) + v[2] * Math.cos(OBLIQUITY),
]

const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]

/**
 * Polo norte y dirección del meridiano origen (longitud 0°) en ejes eclípticos J2000,
 * para un valor dado de W en grados.
 */
export function bodyFrame(id: string, Wdeg: number): { pole: Vec3; prime: Vec3 } {
  const r = ROTATION[id]
  if (!r) return { pole: [0, 0, 1], prime: [1, 0, 0] }
  const a = r.ra * D2R
  const d = r.dec * D2R
  const pole: Vec3 = [Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d)]
  const node: Vec3 = [-Math.sin(a), Math.cos(a), 0]
  const pn = cross(pole, node)
  const W = Wdeg * D2R
  const primeEq: Vec3 = [
    node[0] * Math.cos(W) + pn[0] * Math.sin(W),
    node[1] * Math.cos(W) + pn[1] * Math.sin(W),
    node[2] * Math.cos(W) + pn[2] * Math.sin(W),
  ]
  return { pole: eqToEcl(pole), prime: eqToEcl(primeEq) }
}
