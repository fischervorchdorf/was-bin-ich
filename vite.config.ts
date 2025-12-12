import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/was-bin-ich/',
  plugins: [react()],
})