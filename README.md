# Más Allá del Cielo · Sistema Solar 3D

Web del canal de YouTube **Más Allá del Cielo**. Lo principal es un sistema solar en 3D que se puede girar, acercar y recorrer; al pulsar un planeta se abre su ficha con datos, tarjetas de información y, en el caso de Júpiter, el vídeo del canal.

**Stack:** React 18 · TypeScript · Vite · three.js · @react-three/fiber · @react-three/drei · postprocessing (bloom).

## Puesta en marcha

Necesitas [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:5173
npm run build      # versión de producción en /dist
npm run preview    # probar la versión de producción
```

## Lo primero que tienes que tocar

Abre `src/config.ts`:

- `jupiterVideoId`: el ID del vídeo de Júpiter (lo que va tras `watch?v=` en la URL de YouTube). Mientras esté vacío se muestra un póster en su lugar.
- `channelUrl`: enlace a tu canal. Activa los botones «Suscríbete» y «Ver en YouTube».

## Cómo añadir el vídeo de otro planeta

En `src/data/bodies.ts`, cada cuerpo celeste es un objeto. Para que un planeta tenga vídeo, añade un campo `video` igual que el de Júpiter (título, descripción, `youtubeId` y capítulos). La ficha y las tarjetas de la web se actualizan solas.

Ahí mismo están todos los textos y cifras de las fichas, y los parámetros de la escena 3D (tamaño, distancia, inclinación, texturas).

## Estructura

```
public/textures/        texturas de planetas, anillos y fondo estelar
src/config.ts           ajustes del sitio (ID de vídeo, enlace del canal)
src/data/bodies.ts      datos y parámetros 3D de cada cuerpo
src/scene/              escena 3D: planetas, órbitas, cámara, efectos
src/components/         cabecera, dock, panel de información, secciones
src/styles.css          todo el diseño
```

## Controles

- **Arrastrar**: girar · **Rueda / pellizco**: zoom · **Clic / toque**: elegir planeta
- **← →**: pasar de un cuerpo al siguiente · **Esc**: volver a la vista general
- Botones de la escena: pausa, velocidad (0,5× a 12×), mostrar/ocultar órbitas y nombres.

## Créditos

Texturas de los planetas, la Luna y el fondo estelar: [Solar System Scope](https://www.solarsystemscope.com/textures/), basadas en imágenes de la NASA, licencia [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Anillos de Urano: NASA. La atribución aparece también en el pie de la web.

Los tamaños y distancias de la escena no son proporcionales a la realidad: están ajustados para que cada mundo se vea bien.

## Modo Realista

El conmutador **Estilizado / Realista** (arriba a la izquierda de la escena) cambia entre dos modos:

- **Estilizado**: tamaños y distancias comprimidos para que todo se vea bien; órbitas y giros acelerados.
- **Realista**: escala real (1 unidad = 1 radio terrestre), posiciones de los planetas para la fecha elegida, inclinación real de los ejes y periodos de rotación reales. La velocidad por defecto es 1 día/s; "Tiempo real" muestra el movimiento a 1 s por segundo.

Detalles técnicos (`src/scene/ephemeris.ts`):
- Elementos keplerianos aproximados de JPL (válidos 1800–2050; la app limita a 1900–2049). Error < 0,3° frente a astropy.
- Orientación: polo IAU (AR/Dec) y meridiano origen W0 + velocidad. Solo la orientación día/noche de la Tierra es físicamente significativa; en el resto, el origen de longitud de la textura es arbitrario.
- La posición de la Tierra es la del baricentro Tierra-Luna; la Luna es aproximada.
- A velocidades altas (> ~1 día/s) el giro se ralentiza visualmente para evitar el efecto estroboscópico.
- A escala real los planetas son puntos diminutos: usa el dock inferior para ir a cada uno.
