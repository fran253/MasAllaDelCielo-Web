import type * as THREE from 'three'

/** Estado de simulación compartido entre la UI y la escena (se lee en cada frame). */
export const sim = {
  time: 0,
  speed: 1,
  paused: false,
}

/** Objetos 3D de cada cuerpo, para que la cámara pueda seguirlos mientras orbitan. */
export const registry = new Map<string, THREE.Object3D>()
