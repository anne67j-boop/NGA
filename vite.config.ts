import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    define: {
      __APP_ENV__: env.APP_ENV
    },
    build: {
      chunkSizeWarningLimit: 2000
    },
    server: {
      port: 5173,
      host: true
    }
  }
})
