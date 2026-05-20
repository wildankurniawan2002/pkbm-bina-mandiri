// ============================================================
// vite.config.js — Konfigurasi bundler Vite
// ============================================================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-router-dom')) return 'router';
          if (id.includes('axios')) return 'axios';
          if (id.includes('react')) return 'react-vendor';
          return 'vendor';
        },
      },
    },
  },

  // Konfigurasi server development
  server: {
    port: 5173, // Port default Vite
    // Proxy: alihkan request /api ke backend secara transparan
    // Berguna agar tidak kena masalah CORS saat development
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
