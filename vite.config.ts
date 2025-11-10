
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'main',
  plugins: [react()],
  base: "/my-gig-jobs/" 
})
