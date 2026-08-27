import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev
export default defineConfig({
  base: '/beta/', 
  plugins: [react()],
  define: {
    // This injects the beta path directly into React's environment variables
    'process.env.PUBLIC_URL': JSON.stringify('/beta'),
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
}
