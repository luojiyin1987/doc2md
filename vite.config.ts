import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { seoPages } from './scripts/pages.mjs'

const input = Object.fromEntries([
  ['home', resolve(import.meta.dirname, 'index.html')],
  ...seoPages.map((page) => [
    page.slug,
    resolve(import.meta.dirname, page.slug, 'index.html'),
  ]),
])

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      input,
    },
  },
})
