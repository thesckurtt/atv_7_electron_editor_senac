import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        'electron', // <- impede que o Electron seja empacotado
        'fs',
        'path',
        'os'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  }
})
