import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Zmień na '/erp/' jeśli aplikacja jedzie pod subpath
  base: '/',

  build: {
    outDir:   'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },

  // server: {
  //   proxy: {
  //     '/api': {
  //       target:       import.meta.env?.VITE_API_URL,
  //       changeOrigin: true,
  //     },
  //   },
  // },
})