import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Html, Line, OrbitControls, useTexture } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import type { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls.js'
import { BODIES, asset, bodyById, orbitSpeed, spinSpeed } from '../data/bodies'
import type { Body } from '../data/bodies'
import { registry, sim } from './sim'

const PANEL_WIDTH = 440
const PRESET_DIR = new THREE.Vector3(0, 0.34, 1).normalize()

/* ------------------------------------------------------------------ */
/* Reloj de simulación                                                 */
/* ------------------------------------------------------------------ */
function SimClock() {
  useFrame((_, dt) => {
    if (!sim.paused) sim.time += Math.min(dt, 0.1) * sim.speed
  })
  return null
}

/* ------------------------------------------------------------------ */
/* Atmósfera (resplandor fresnel)                                      */
/* ------------------------------------------------------------------ */
const atmVert = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const atmFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  uniform float uTmax;
  varying vec3 vNormal;
  void main() {
    // t vale 0 en el borde exterior de la atmósfera y uTmax junto al limbo del planeta.
    float t = clamp(-dot(vNormal, vec3(0.0, 0.0, 1.0)) / uTmax, 0.0, 1.0);
    float i = pow(t, uPower) * uIntensity;
    gl_FragColor = vec4(uColor * i, i);
  }
`

function Atmosphere({ radius, color, intensity, power, scale }: { radius: number; color: string; intensity: number; power: number; scale: number }) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power },
      uIntensity: { value: intensity },
      uTmax: { value: Math.sqrt(1 - 1 / (scale * scale)) },
    }),
    [color, power, intensity, scale],
  )
  return (
    <mesh scale={scale} raycast={() => null}>
      <sphereGeometry args={[radius, 64, 64]} />
      <shaderMaterial
        vertexShader={atmVert}
        fragmentShader={atmFrag}
        uniforms={uniforms}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* Anillos (Saturno, Urano)                                            */
/* ------------------------------------------------------------------ */
function RingSet({ radius, outer, texture, opacity }: { radius: number; outer: number; texture: string; opacity: number }) {
  const map = useTexture(asset(texture))
  const outerR = radius * outer
  const geometry = useMemo(() => {
    // En la textura el anillo ocupa la mitad izquierda (un cuadrado de 512×512 con el anillo centrado).
    const g = new THREE.RingGeometry(outerR * 0.46, outerR, 192, 1)
    const pos = g.attributes.position
    const uv = g.attributes.uv
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      uv.setXY(i, (x / outerR + 1) / 4, (y / outerR + 1) / 2)
    }
    return g
  }, [outerR])
  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial
        map={map}
        side={THREE.DoubleSide}
        transparent
        opacity={opacity}
        roughness={1}
        metalness={0}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* Resplandor del Sol                                                  */
/* ------------------------------------------------------------------ */
function makeGlowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  gr.addColorStop(0, 'rgba(255,236,190,1)')
  gr.addColorStop(0.16, 'rgba(255,196,100,0.55)')
  gr.addColorStop(0.45, 'rgba(255,140,40,0.07)')
  gr.addColorStop(1, 'rgba(255,120,30,0)')
  g.fillStyle = gr
  g.fillRect(0, 0, 256, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function SunGlow({ radius }: { radius: number }) {
  const map = useMemo(makeGlowTexture, [])
  return (
    <sprite scale={[radius * 6.5, radius * 6.5, 1]} raycast={() => null}>
      <spriteMaterial map={map} blending={THREE.AdditiveBlending} transparent depthWrite={false} toneMapped={false} />
    </sprite>
  )
}

/* ------------------------------------------------------------------ */
/* Cuerpo celeste                                                      */
/* ------------------------------------------------------------------ */
interface BodyProps {
  body: Body
  selected: boolean
  showLabel: boolean
  hovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

function BodyMesh({ body, selected, showLabel, hovered, onSelect, onHover }: BodyProps) {
  const orbit = useRef<THREE.Group>(null!)
  const spin = useRef<THREE.Mesh>(null!)
  const clouds = useRef<THREE.Mesh>(null)
  const moon = useRef<THREE.Mesh>(null)

  const paths = [asset(body.texture), ...(body.normalMap ? [asset(body.normalMap)] : [])]
  const [map, normal] = useTexture(paths) as THREE.Texture[]
  const cloudMap = useTexture(asset(body.clouds ?? body.texture))
  const moonMap = useTexture(asset('textures/moonmap2k.jpg'))
  const isStar = body.kind === 'star'

  useEffect(() => {
    registry.set(body.id, orbit.current)
    return () => {
      registry.delete(body.id)
    }
  }, [body.id])

  useEffect(() => {
    map.anisotropy = 8
  }, [map])

  useFrame((_, dt) => {
    const g = orbit.current
    if (body.distance > 0) {
      const a = body.startAngle + sim.time * orbitSpeed(body)
      g.position.set(Math.cos(a) * body.distance, 0, -Math.sin(a) * body.distance)
    }
    const step = sim.paused ? 0 : Math.min(dt, 0.1) * sim.speed
    spin.current.rotation.y += step * spinSpeed(body)
    if (clouds.current) clouds.current.rotation.y += step * spinSpeed(body) * 0.35
    if (moon.current) {
      const m = sim.time * 1.1
      moon.current.position.set(Math.cos(m) * 2.9, 0, Math.sin(m) * 2.9)
      moon.current.rotation.y = -m
    }
  })

  const hitRadius = isStar ? body.radius : Math.max(body.radius * 1.3, 1.3)

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return // fue un arrastre, no un clic
    e.stopPropagation()
    onSelect(body.id)
  }

  return (
    <group
      ref={orbit}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(body.id)
      }}
      onPointerOut={() => onHover(null)}
    >
      {/* Zona de clic ampliada para planetas pequeños */}
      <mesh>
        <sphereGeometry args={[hitRadius, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group rotation={[0, 0, THREE.MathUtils.degToRad(body.tiltDeg)]}>
        <mesh ref={spin}>
          <sphereGeometry args={[body.radius, isStar ? 96 : 128, isStar ? 96 : 128]} />
          {isStar ? (
            <meshBasicMaterial map={map} color={new THREE.Color(1.7, 1.3, 0.9)} toneMapped={false} />
          ) : (
            <meshStandardMaterial
              map={map}
              normalMap={normal}
              normalScale={new THREE.Vector2(0.35, 0.35)}
              roughness={1}
              metalness={0}
            />
          )}
        </mesh>

        {body.clouds && (
          <mesh ref={clouds} raycast={() => null}>
            <sphereGeometry args={[body.radius * 1.012, 96, 96]} />
            <meshStandardMaterial map={cloudMap} transparent opacity={0.85} depthWrite={false} roughness={1} />
          </mesh>
        )}

        {body.rings && (
          <RingSet radius={body.radius} outer={body.rings.outer} texture={body.rings.texture} opacity={body.rings.opacity} />
        )}
      </group>

      {body.atmosphere && <Atmosphere radius={body.radius} {...body.atmosphere} />}
      {isStar && <SunGlow radius={body.radius} />}
      {isStar && <pointLight color="#fff1dc" intensity={3.6} decay={0} />}

      {body.id === 'tierra' && (
        <mesh ref={moon} raycast={() => null}>
          <sphereGeometry args={[0.35, 48, 48]} />
          <meshStandardMaterial map={moonMap} roughness={1} />
        </mesh>
      )}

      {showLabel && (
        <Html position={[0, body.radius * (body.rings ? 1.5 : 1.25) + 0.9, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className={`body-label${hovered ? ' is-hover' : ''}${selected ? ' is-selected' : ''}`}>{body.name}</div>
        </Html>
      )}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Órbitas, asteroides y fondo                                         */
/* ------------------------------------------------------------------ */
function OrbitLine({ radius, active }: { radius: number; active: boolean }) {
  const points = useMemo(
    () =>
      Array.from({ length: 257 }, (_, i) => {
        const a = (i / 256) * Math.PI * 2
        return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius)
      }),
    [radius],
  )
  return (
    <Line
      points={points}
      color={active ? '#f0d79c' : '#c8a45e'}
      lineWidth={active ? 1.4 : 0.8}
      transparent
      opacity={active ? 0.6 : 0.16}
      depthWrite={false}
      raycast={() => null}
    />
  )
}

function makeDotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 32
  const g = c.getContext('2d')!
  const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16)
  gr.addColorStop(0, 'rgba(255,255,255,1)')
  gr.addColorStop(0.5, 'rgba(255,255,255,0.7)')
  gr.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = gr
  g.fillRect(0, 0, 32, 32)
  return new THREE.CanvasTexture(c)
}

function AsteroidBelt() {
  const group = useRef<THREE.Group>(null!)
  const dot = useMemo(makeDotTexture, [])
  const geometry = useMemo(() => {
    const n = 4500
    const p = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 31 + ((Math.random() + Math.random() + Math.random()) / 3) * 9
      const y = (Math.random() - 0.5) * 1.2 * (0.4 + Math.random())
      p[i * 3] = Math.cos(a) * r
      p[i * 3 + 1] = y
      p[i * 3 + 2] = Math.sin(a) * r
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    return g
  }, [])
  useFrame((_, dt) => {
    if (!sim.paused) group.current.rotation.y += Math.min(dt, 0.1) * sim.speed * 0.004
  })
  return (
    <group ref={group}>
      <points geometry={geometry} raycast={() => null}>
        <pointsMaterial map={dot} size={0.2} color="#b0a08a" sizeAttenuation transparent opacity={0.6} depthWrite={false} alphaTest={0.02} />
      </points>
    </group>
  )
}

function Starfield() {
  const map = useTexture(asset('textures/galaxy_starfield.jpg'))
  return (
    <mesh rotation={[0.5, 1.2, 0]} raycast={() => null}>
      <sphereGeometry args={[2200, 64, 64]} />
      <meshBasicMaterial map={map} side={THREE.BackSide} color="#8d97b4" toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* Cámara: vuelos suaves y seguimiento del planeta                     */
/* ------------------------------------------------------------------ */
interface RigProps {
  selectedId: string | null
  controls: React.MutableRefObject<OrbitControlsImpl | null>
}

function CameraRig({ selectedId, controls }: RigProps) {
  const { camera, size } = useThree()
  const transition = useRef(true)
  const shiftX = useRef(0)
  const shiftY = useRef(0)
  const v = useMemo(
    () => ({
      target: new THREE.Vector3(),
      prev: new THREE.Vector3(),
      offset: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      delta: new THREE.Vector3(),
    }),
    [],
  )

  useEffect(() => {
    transition.current = true
  }, [selectedId])

  useEffect(() => {
    const c = controls.current
    if (!c) return
    const stop = () => {
      transition.current = false
    }
    c.addEventListener('start', stop)
    return () => c.removeEventListener('start', stop)
  }, [controls])

  useFrame((_, rawDt) => {
    const c = controls.current
    if (!c) return
    const dt = Math.min(rawDt, 0.05)
    const sel = selectedId ? bodyById(selectedId) : undefined
    const obj = sel ? registry.get(sel.id) : undefined
    if (sel && obj) obj.getWorldPosition(v.target)
    else v.target.set(0, 0, 0)

    if (transition.current) {
      const k = 1 - Math.exp(-3.4 * dt)
      v.prev.copy(c.target)
      v.offset.copy(camera.position).sub(v.prev)
      let len = v.offset.length()
      const overview = size.width / size.height < 1 ? 330 : 225
      const aspect = size.width / size.height
      const portraitBoost = THREE.MathUtils.clamp(0.9 / aspect, 1, 2.2)
      const desired = sel ? sel.radius * sel.focus * portraitBoost : overview
      v.dir.copy(v.offset).normalize()
      if (!sel) v.dir.lerp(PRESET_DIR, k * 0.6).normalize()
      len = THREE.MathUtils.damp(len, desired, 3, dt)
      c.target.lerp(v.target, k)
      camera.position.copy(c.target).addScaledVector(v.dir, len)
      if (Math.abs(len - desired) < desired * 0.015 && c.target.distanceTo(v.target) < Math.max(desired * 0.01, 0.02)) {
        transition.current = false
      }
    } else if (sel) {
      // Seguimiento rígido: la cámara acompaña al planeta en su órbita.
      v.delta.copy(v.target).sub(c.target)
      c.target.add(v.delta)
      camera.position.add(v.delta)
    }

    c.minDistance = sel ? sel.radius * 1.5 : Math.min(10, camera.position.distanceTo(c.target))
    c.maxDistance = 760
    c.enablePan = !sel

    // Desplaza el encuadre para que el planeta no quede tapado por el panel de información.
    const wideScreen = size.width > 900
    const wantX = wideScreen ? (sel ? PANEL_WIDTH / 2 : -size.width * 0.09) : 0
    const wantY = sel && !wideScreen ? size.height * 0.25 : 0
    shiftX.current = THREE.MathUtils.damp(shiftX.current, wantX, 4, dt)
    shiftY.current = THREE.MathUtils.damp(shiftY.current, wantY, 4, dt)
    const cam = camera as THREE.PerspectiveCamera
    if (Math.abs(shiftX.current) < 0.3 && Math.abs(shiftY.current) < 0.3 && !wantX && !wantY) {
      if (cam.view?.enabled) cam.clearViewOffset()
    } else {
      cam.setViewOffset(size.width, size.height, shiftX.current, shiftY.current, size.width, size.height)
    }
  })

  return null
}

/** Avisa cuando la cámara está lo bastante cerca del centro como para mostrar los nombres de los planetas interiores. */
function ZoomWatcher({ onChange }: { onChange: (near: boolean) => void }) {
  const last = useRef<boolean | null>(null)
  useFrame(({ camera }) => {
    const near = camera.position.length() < 120
    if (last.current !== near) {
      last.current = near
      onChange(near)
    }
  })
  return null
}

/* ------------------------------------------------------------------ */
/* Escena                                                              */
/* ------------------------------------------------------------------ */
export interface SolarSceneProps {
  selectedId: string | null
  onSelect: (id: string | null) => void
  showOrbits: boolean
  showLabels: boolean
  active: boolean
}

export default function SolarScene({ selectedId, onSelect, showOrbits, showLabels, active }: SolarSceneProps) {
  const controls = useRef<OrbitControlsImpl | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [nearView, setNearView] = useState(false)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [hovered])

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 2]}
      flat
      camera={{ position: [0, 90, 330], fov: 42, near: 0.05, far: 5000 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => {
        /* un clic en el vacío no cierra nada: se cierra con la X o con Esc */
      }}
    >
      <color attach="background" args={['#02060f']} />
      <ambientLight intensity={0.9} color="#7a8cc0" />
      <Suspense fallback={null}>
        <SimClock />
        <ZoomWatcher onChange={setNearView} />
        <Starfield />
        {BODIES.map((b) => (
          <BodyMesh
            key={b.id}
            body={b}
            selected={selectedId === b.id}
            showLabel={showLabels && !selectedId && (b.distance >= 40 || nearView)}
            hovered={hovered === b.id}
            onSelect={onSelect}
            onHover={setHovered}
          />
        ))}
        {showOrbits &&
          BODIES.filter((b) => b.distance > 0).map((b) => <OrbitLine key={b.id} radius={b.distance} active={selectedId === b.id} />)}
        <AsteroidBelt />
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur intensity={0.95} luminanceThreshold={1} luminanceSmoothing={0.15} radius={0.75} />
        </EffectComposer>
      </Suspense>
      <OrbitControls
        ref={controls as never}
        makeDefault
        enableDamping
        dampingFactor={0.07}
        rotateSpeed={0.55}
        zoomSpeed={0.75}
        panSpeed={0.6}
        screenSpacePanning
      />
      <CameraRig selectedId={selectedId} controls={controls} />
    </Canvas>
  )
}
