import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative paths: works at https://polejek.github.io/SwiadomyZawodnik/ (GitHub Pages) and at any other address.
  base: './',
  plugins: [react()],
  server: { host: true, port: 3000 },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    restoreMocks: true,
  },
})
