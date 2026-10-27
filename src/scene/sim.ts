import type * as THREE from 'three'

/** Estado de simulación compartido entre la UI y la escena (se lee en cada frame). */
export const sim = {
  /** Modo estilizado: tiempo en segundos (comprimido) */
  time: 0,
  speed: 1,
  paused: false,
  /** Modo realista */
  real: false,
  /** Instante simulado (ms Unix) */
  epochMs: Date.now(),
  /** Segundos simulados por cada segundo real */
  realSpeed: 86400,
}

/** Rango en el que los elementos orbitales usados son fiables (1900 a 2049). */
export const MIN_MS = Date.UTC(1900, 0, 1)
export const MAX_MS = Date.UTC(2049, 11, 31)

export const clampEpoch = (ms: number) => Math.min(MAX_MS, Math.max(MIN_MS, ms))

/** Objetos 3D de cada cuerpo, para que la cámara pueda seguirlos mientras orbitan. */
export const registry = new Map<string, THREE.Object3D>()
