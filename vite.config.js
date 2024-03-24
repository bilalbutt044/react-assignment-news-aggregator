import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow connections from outside the container (optional)
    port: 3000, // Change port if desired (optional)
  },
})
