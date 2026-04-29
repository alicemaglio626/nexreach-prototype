import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/nexreach-prototype/',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', '@mantine/core', '@mantine/hooks'],
  },
})
