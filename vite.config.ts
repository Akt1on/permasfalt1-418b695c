import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import imageOptimizer from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [react(), imageOptimizer({
    test: /\.(jpg|jpeg|png|webp|avif)$/i,
    png: { quality: 80 },
    jpeg: { quality: 80 },
    webp: { quality: 80 },
  })],
  build: {
    sourcemap: false,
  }
})