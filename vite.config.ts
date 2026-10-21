import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/slim-hero/',
  plugins: [react()],
  server: { port: 5191, host: true },
})
