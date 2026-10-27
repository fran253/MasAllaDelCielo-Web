import { siteConfig } from '../config'

export interface Stat {
  label: string
  value: string
}

export interface Curiosity {
  title: string
  text: string
}

export interface Chapter {
  time: string
  seconds: number
  title: string
}

export interface BodyVideo {
  title: string
  blurb: string
  youtubeId: string
  chapters: Chapter[]
}

export interface Rings {
  /** múltiplos del radio del planeta */
  outer: number
  texture: string
  opacity: number
}

export interface Body {
  id: string
  name: string
  kind: 'star' | 'planet'
  subtitle: string
  summary: string
  stats: Stat[]
  curiosities: Curiosity[]
  video?: BodyVideo

  /* --- escena 3D (escala estilizada, no real) --- */
  radius: number
  /** radio real en km (para el modo realista) */
  realRadiusKm: number
  distance: number
  periodYears: number
  /** duración de un día en horas (negativo = rotación retrógrada) */
  spinHours: number
  tiltDeg: number
  startAngle: number
  texture: string
  normalMap?: string
  clouds?: string
  accent: string
  /** multiplicador del radio para la distancia de la cámara al enfocar */
  focus: number
  atmosphere?: { color: string; intensity: number; power: number; scale: number }
  rings?: Rings
}

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const BODIES: Body[] = [
  {
    id: 'sol',
    name: 'Sol',
    kind: 'star',
    subtitle: 'La estrella que lo sostiene todo',
    summary:
      'El Sol concentra el 99,86 % de la masa del sistema solar. Es una esfera de plasma en la que cada segundo se fusionan unos 600 millones de toneladas de hidrógeno en helio. Esa energía tarda decenas de miles de años en abrirse paso desde el núcleo hasta la superficie y solo unos 8 minutos en llegar hasta nosotros.',
    stats: [
      { label: 'Diámetro', value: '1.392.700 km' },
      { label: 'Edad', value: '≈ 4.600 millones de años' },
      { label: 'Superficie', value: '≈ 5.500 °C' },
      { label: 'Núcleo', value: '≈ 15 millones de °C' },
      { label: 'Luz hasta la Tierra', value: '8 min 20 s' },
      { label: 'Tipo', value: 'Enana amarilla (G2V)' },
    ],
    curiosities: [
      {
        title: 'Caben 1,3 millones de Tierras',
        text: 'Su volumen es tan grande que dentro del Sol cabrían más de un millón de planetas como el nuestro.',
      },
      {
        title: 'Una estrella a mitad de vida',
        text: 'Lleva unos 4.600 millones de años brillando y le quedan otros 5.000 millones antes de hincharse hasta convertirse en gigante roja.',
      },
      {
        title: 'No gira como un sólido',
        text: 'Su ecuador da una vuelta en unos 25 días, mientras que los polos tardan cerca de 35: es una bola de plasma con rotación diferencial.',
      },
    ],
    radius: 5,
    realRadiusKm: 695700,
    distance: 0,
    periodYears: 1,
    spinHours: 609,
    tiltDeg: 7,
    startAngle: 0,
    texture: 'textures/sunmap.jpg',
    accent: '#f6b64a',
    focus: 5.4,
  },
  {
    id: 'mercurio',
    name: 'Mercurio',
    kind: 'planet',
    subtitle: 'El mundo más rápido y extremo',
    summary:
      'El planeta más pequeño y el más cercano al Sol. Sin una atmósfera que retenga el calor, sus días superan los 400 °C y sus noches se hunden por debajo de −170 °C. Su superficie, cubierta de cráteres, recuerda a la de la Luna.',
    stats: [
      { label: 'Diámetro', value: '4.879 km' },
      { label: 'Distancia al Sol', value: '57,9 M km (0,39 UA)' },
      { label: 'Año', value: '88 días terrestres' },
      { label: 'Día solar', value: '176 días terrestres' },
      { label: 'Temperatura', value: '−180 °C a 430 °C' },
      { label: 'Lunas', value: 'Ninguna' },
    ],
    curiosities: [
      {
        title: 'Un día dura el doble que su año',
        text: 'De un amanecer al siguiente pasan 176 días terrestres, el doble de lo que tarda en dar una vuelta al Sol (88).',
      },
      {
        title: 'Hielo junto al Sol',
        text: 'En el fondo de algunos cráteres polares, que nunca reciben luz directa, las sondas han detectado hielo de agua.',
      },
      {
        title: 'Un planeta que se encoge',
        text: 'Al enfriarse su núcleo, Mercurio se ha contraído varios kilómetros, y esa contracción ha dejado enormes grietas en su corteza.',
      },
    ],
    radius: 0.7,
    realRadiusKm: 2439.7,
    distance: 11,
    periodYears: 0.241,
    spinHours: 1408,
    tiltDeg: 0.03,
    startAngle: 0.5,
    texture: 'textures/mercurymap.jpg',
    accent: '#b5aaa0',
    focus: 6,
  },
  {
    id: 'venus',
    name: 'Venus',
    kind: 'planet',
    subtitle: 'El infierno velado',
    summary:
      'Casi gemelo de la Tierra en tamaño, pero con un efecto invernadero desbocado: una atmósfera de dióxido de carbono unas 90 veces más densa que la nuestra mantiene su superficie a unos 465 °C, más caliente que la de Mercurio.',
    stats: [
      { label: 'Diámetro', value: '12.104 km' },
      { label: 'Distancia al Sol', value: '108,2 M km (0,72 UA)' },
      { label: 'Año', value: '224,7 días terrestres' },
      { label: 'Día (rotación)', value: '243 días, retrógrada' },
      { label: 'Temperatura', value: '≈ 465 °C' },
      { label: 'Lunas', value: 'Ninguna' },
    ],
    curiosities: [
      {
        title: 'Gira al revés',
        text: 'Rota en sentido contrario al de casi todos los planetas, así que allí el Sol saldría por el oeste.',
      },
      {
        title: 'Su día es más largo que su año',
        text: 'Tarda 243 días en dar una vuelta sobre sí misma y solo 224,7 en orbitar alrededor del Sol.',
      },
      {
        title: 'Nubes de ácido sulfúrico',
        text: 'Su cielo está cubierto por una capa permanente de nubes que refleja gran parte de la luz solar: por eso brilla tanto en el cielo nocturno.',
      },
    ],
    radius: 1.2,
    realRadiusKm: 6051.8,
    distance: 15.5,
    periodYears: 0.615,
    spinHours: -5832,
    tiltDeg: 2.6,
    startAngle: 2.2,
    texture: 'textures/venusmap.jpg',
    accent: '#e3b87a',
    focus: 6,
    atmosphere: { color: '#f0c785', intensity: 0.85, power: 2.6, scale: 1.1 },
  },
  {
    id: 'tierra',
    name: 'Tierra',
    kind: 'planet',
    subtitle: 'El único mundo con vida conocida',
    summary:
      'El tercer planeta es el único donde conocemos vida. Su distancia al Sol, un campo magnético protector, océanos líquidos que cubren cerca del 71 % de la superficie y una atmósfera rica en nitrógeno y oxígeno lo convierten en un lugar excepcional.',
    stats: [
      { label: 'Diámetro', value: '12.742 km' },
      { label: 'Distancia al Sol', value: '149,6 M km (1 UA)' },
      { label: 'Año', value: '365,25 días' },
      { label: 'Día', value: '24 horas' },
      { label: 'Temperatura media', value: '≈ 15 °C' },
      { label: 'Lunas', value: '1' },
    ],
    curiosities: [
      {
        title: 'La Luna se aleja',
        text: 'Se separa de nosotros unos 3,8 centímetros al año, aproximadamente lo que crecen las uñas.',
      },
      {
        title: 'Un núcleo como la superficie del Sol',
        text: 'El núcleo interno ronda los 5.000–6.000 °C, una temperatura comparable a la de la superficie solar.',
      },
      {
        title: 'Un escudo invisible',
        text: 'Su campo magnético desvía buena parte del viento solar y protege la atmósfera y a los seres vivos de la radiación.',
      },
    ],
    radius: 1.3,
    realRadiusKm: 6371,
    distance: 20.5,
    periodYears: 1,
    spinHours: 24,
    tiltDeg: 23.4,
    startAngle: 1.1,
    texture: 'textures/earthmap2k.jpg',
    normalMap: 'textures/earthnormal2k.jpg',
    clouds: 'textures/earthcloudmapcolortrans.png',
    accent: '#5fa8e8',
    focus: 6.2,
    atmosphere: { color: '#5aa2ff', intensity: 0.95, power: 2.6, scale: 1.12 },
  },
  {
    id: 'marte',
    name: 'Marte',
    kind: 'planet',
    subtitle: 'El planeta rojo',
    summary:
      'Un mundo frío y árido cuyo color procede del óxido de hierro del polvo superficial. Conserva valles fluviales, deltas y minerales formados con agua: hace miles de millones de años fue mucho más húmedo y quizá habitable.',
    stats: [
      { label: 'Diámetro', value: '6.779 km' },
      { label: 'Distancia al Sol', value: '227,9 M km (1,52 UA)' },
      { label: 'Año', value: '687 días terrestres' },
      { label: 'Día', value: '24 h 37 min' },
      { label: 'Temperatura media', value: '≈ −63 °C' },
      { label: 'Lunas', value: '2 (Fobos y Deimos)' },
    ],
    curiosities: [
      {
        title: 'El volcán más alto',
        text: 'El Monte Olimpo mide unos 22 km de altura, cerca de dos veces y media el Everest.',
      },
      {
        title: 'Un cañón de 4.000 km',
        text: 'Valles Marineris se extiende a lo largo de más de 4.000 kilómetros: cabría de punta a punta de Estados Unidos.',
      },
      {
        title: 'Atardeceres azules',
        text: 'El polvo en suspensión dispersa la luz de forma distinta a la Tierra, y alrededor del Sol poniente el cielo se tiñe de azul.',
      },
    ],
    radius: 0.95,
    realRadiusKm: 3389.5,
    distance: 26,
    periodYears: 1.881,
    spinHours: 24.6,
    tiltDeg: 25.2,
    startAngle: 2.7,
    texture: 'textures/marsmap2k.jpg',
    accent: '#d4623c',
    focus: 6,
    atmosphere: { color: '#e8845a', intensity: 0.3, power: 3, scale: 1.06 },
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    kind: 'planet',
    subtitle: 'El gigante que moldeó el sistema solar',
    summary:
      'Con una masa 2,5 veces mayor que la de todos los demás planetas juntos, Júpiter domina la dinámica del sistema solar. Es un gigante gaseoso de hidrógeno y helio, sin superficie sólida, atravesado por bandas de nubes y tormentas colosales.',
    stats: [
      { label: 'Diámetro', value: '139.820 km' },
      { label: 'Distancia al Sol', value: '778,5 M km (5,2 UA)' },
      { label: 'Año', value: '11,86 años terrestres' },
      { label: 'Día', value: '9 h 56 min' },
      { label: 'Nubes', value: '≈ −110 °C' },
      { label: 'Lunas', value: 'Más de 90 conocidas' },
    ],
    curiosities: [
      {
        title: 'Una tormenta más ancha que la Tierra',
        text: 'La Gran Mancha Roja se observa desde hace más de 150 años y, aunque se va encogiendo, sigue siendo mayor que nuestro planeta.',
      },
      {
        title: 'Ganímedes, una luna mayor que Mercurio',
        text: 'Es la luna más grande del sistema solar y supera en diámetro al propio Mercurio.',
      },
      {
        title: 'Lunas con océanos ocultos',
        text: 'Bajo el hielo de Europa se esconde un océano de agua líquida, uno de los lugares más prometedores para buscar vida.',
      },
    ],
    video: {
      title: 'Júpiter es mucho más importante de lo que crees',
      blurb:
        'Qué pasaría si Júpiter desapareciera mañana, si de verdad nos protege de los asteroides y por qué quizá le debemos hasta el origen de la Tierra.',
      youtubeId: siteConfig.jupiterVideoId,
      chapters: [
        { time: '00:00', seconds: 0, title: 'Mañana, Júpiter desaparece' },
        { time: '00:48', seconds: 48, title: 'Lo que notarías el primer día' },
        { time: '01:45', seconds: 105, title: 'El gigante que mueve al Sol' },
        { time: '02:55', seconds: 175, title: '¿El aspirador del sistema solar?' },
        { time: '04:02', seconds: 242, title: 'Un escudo con agujeros' },
        { time: '04:49', seconds: 289, title: 'El planeta que nunca se formó' },
        { time: '05:51', seconds: 351, title: 'Los hijos de Júpiter: Ío, Ganímedes y Europa' },
        { time: '07:10', seconds: 430, title: 'El viaje de Júpiter: la hipótesis del Gran Viraje' },
        { time: '08:32', seconds: 512, title: 'Resumen y pregunta para ti' },
      ],
    },
    radius: 3.8,
    realRadiusKm: 69911,
    distance: 47,
    periodYears: 11.86,
    spinHours: 9.93,
    tiltDeg: 3.1,
    startAngle: 2.05,
    texture: 'textures/jupitermap.jpg',
    accent: '#d9a66b',
    focus: 5.8,
    atmosphere: { color: '#e2b98a', intensity: 0.22, power: 3, scale: 1.05 },
  },
  {
    id: 'saturno',
    name: 'Saturno',
    kind: 'planet',
    subtitle: 'El señor de los anillos',
    summary:
      'El segundo planeta más grande es tan poco denso que tendría menos densidad que el agua. Sus anillos, formados sobre todo por hielo de agua, se extienden cientos de miles de kilómetros pero suelen tener un grosor de apenas decenas de metros.',
    stats: [
      { label: 'Diámetro', value: '116.460 km' },
      { label: 'Distancia al Sol', value: '1.434 M km (9,58 UA)' },
      { label: 'Año', value: '29,5 años terrestres' },
      { label: 'Día', value: '10 h 33 min' },
      { label: 'Nubes', value: '≈ −140 °C' },
      { label: 'Lunas', value: 'Más de 270 conocidas' },
    ],
    curiosities: [
      {
        title: 'Un hexágono en el polo norte',
        text: 'Una corriente en chorro con forma de hexágono perfecto, más ancha que dos Tierras, rodea su polo norte.',
      },
      {
        title: 'Encélado lanza géiseres',
        text: 'Esta pequeña luna expulsa chorros de agua helada al espacio desde un océano subterráneo.',
      },
      {
        title: 'Titán, una luna con atmósfera',
        text: 'Es el único satélite con una atmósfera densa y tiene lagos y ríos, aunque de metano y etano líquidos.',
      },
    ],
    radius: 3.2,
    realRadiusKm: 58232,
    distance: 65,
    periodYears: 29.46,
    spinHours: 10.55,
    tiltDeg: 26.7,
    startAngle: 0.75,
    texture: 'textures/saturnmap.jpg',
    accent: '#e2cd96',
    focus: 8,
    atmosphere: { color: '#ead9a8', intensity: 0.2, power: 3, scale: 1.05 },
    rings: { outer: 2.35, texture: 'textures/saturnringcolortrans.png', opacity: 1 },
  },
  {
    id: 'urano',
    name: 'Urano',
    kind: 'planet',
    subtitle: 'El gigante de hielo que rueda de lado',
    summary:
      'Su eje de rotación está inclinado casi 98°, así que gira prácticamente tumbado sobre su órbita. Es un gigante de hielo: bajo su atmósfera de hidrógeno, helio y metano hay un manto de agua, amoníaco y metano a alta presión.',
    stats: [
      { label: 'Diámetro', value: '50.724 km' },
      { label: 'Distancia al Sol', value: '2.871 M km (19,2 UA)' },
      { label: 'Año', value: '84 años terrestres' },
      { label: 'Día', value: '17 h 14 min, retrógrada' },
      { label: 'Temperatura', value: '≈ −195 °C' },
      { label: 'Lunas', value: 'Más de 25 conocidas' },
    ],
    curiosities: [
      {
        title: 'Estaciones de 21 años',
        text: 'Por su inclinación extrema, cada polo pasa unos 21 años a plena luz y otros 21 en oscuridad.',
      },
      {
        title: 'Azul verdoso gracias al metano',
        text: 'El metano de su atmósfera absorbe la luz roja y deja pasar el cian, de ahí su color.',
      },
      {
        title: 'El primero visto con telescopio',
        text: 'William Herschel lo descubrió en 1781: fue el primer planeta hallado con ayuda de un telescopio.',
      },
    ],
    radius: 2.2,
    realRadiusKm: 25362,
    distance: 82,
    periodYears: 84.01,
    spinHours: 17.2,
    tiltDeg: 97.8,
    startAngle: 2.6,
    texture: 'textures/uranusmap.jpg',
    accent: '#8fd6dc',
    focus: 7,
    atmosphere: { color: '#8fe0e8', intensity: 0.5, power: 2.8, scale: 1.08 },
    rings: { outer: 1.75, texture: 'textures/uranusringcolortrans.png', opacity: 0.2 },
  },
  {
    id: 'neptuno',
    name: 'Neptuno',
    kind: 'planet',
    subtitle: 'El mundo de los vientos supersónicos',
    summary:
      'El planeta más lejano del Sol, de un azul profundo por el metano de su atmósfera. Soporta los vientos más rápidos del sistema solar, de unos 2.000 km/h, y fue el primero localizado mediante cálculos matemáticos antes de ser observado.',
    stats: [
      { label: 'Diámetro', value: '49.244 km' },
      { label: 'Distancia al Sol', value: '4.495 M km (30,1 UA)' },
      { label: 'Año', value: '164,8 años terrestres' },
      { label: 'Día', value: '16 h 6 min' },
      { label: 'Temperatura', value: '≈ −200 °C' },
      { label: 'Lunas', value: '16 conocidas' },
    ],
    curiosities: [
      {
        title: 'Descubierto con lápiz y papel',
        text: 'En 1846 se calculó su posición a partir de las irregularidades en la órbita de Urano, y el telescopio lo encontró casi donde se predijo.',
      },
      {
        title: 'Tritón gira al revés',
        text: 'Su mayor luna orbita en sentido contrario a la rotación del planeta, señal de que probablemente fue capturada.',
      },
      {
        title: 'Una vuelta completa desde 1846',
        text: 'Tardó 164,8 años en completar su primera órbita desde el descubrimiento, y lo logró en 2011.',
      },
    ],
    radius: 2.1,
    realRadiusKm: 24622,
    distance: 96,
    periodYears: 164.8,
    spinHours: 16.1,
    tiltDeg: 28.3,
    startAngle: 0.35,
    texture: 'textures/neptunemap.jpg',
    accent: '#4f7be0',
    focus: 7,
    atmosphere: { color: '#5b86ff', intensity: 0.6, power: 2.8, scale: 1.08 },
  },
]

export const bodyById = (id: string) => BODIES.find((b) => b.id === id)

/** Velocidad angular orbital (rad/s) con escala comprimida para que se aprecie el movimiento. */
export const orbitSpeed = (b: Body) => (b.distance === 0 ? 0 : 0.08 / Math.pow(b.periodYears, 0.6))

/** Velocidad de giro sobre su eje (rad/s), también comprimida. */
export const spinSpeed = (b: Body) =>
  (Math.sign(b.spinHours) * 0.25) / Math.pow(Math.abs(b.spinHours) / 24, 0.3)

/** En el modo realista, 1 unidad de la escena = 1 radio terrestre. */
export const EARTH_RADIUS_KM = 6371
/** Unidades de escena que mide 1 UA en el modo realista. */
export const AU_UNITS = 149597870.7 / EARTH_RADIUS_KM

/** Radio del cuerpo en unidades de escena según el modo. */
export const sceneRadius = (b: Body, real: boolean) => (real ? b.realRadiusKm / EARTH_RADIUS_KM : b.radius)
