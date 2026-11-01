import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/influencer/api': {
        target: 'http://127.0.0.1:80',
        changeOrigin: true
      }
    }
  }
})
