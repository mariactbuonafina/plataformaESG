import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração padrão para Docker
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173
    }
  }
})