import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: '../dist/frontend',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/graphql': 'http://localhost:4000',
      '/auth': 'http://localhost:4000',
    },
  },
})
