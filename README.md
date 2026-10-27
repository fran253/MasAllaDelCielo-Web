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
