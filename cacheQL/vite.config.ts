import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/dashQL': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/api/query': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
    port: 5173,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './__tests__/setup.ts',
  }
})
