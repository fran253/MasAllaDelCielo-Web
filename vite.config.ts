import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH lo fija el despliegue en GitHub Pages (p. ej. /nombre-del-repo/).
// En local y en un dominio propio se queda en "/".
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 2500 },
})
