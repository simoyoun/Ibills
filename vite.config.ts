import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      routesDirectory: './src/features'
    })
  ],
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    open: true
  }
})
