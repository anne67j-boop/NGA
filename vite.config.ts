// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2000 // size in KB (default is 500)
  }
})
