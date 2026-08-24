import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api/v2': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      }
    }
  },
  preview: {
    proxy: {
      '/api/v2': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      }
    }
  }
});
