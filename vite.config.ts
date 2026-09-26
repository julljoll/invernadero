import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import path from 'path';
import { viteSqliteDbPlugin } from './scripts/vite-db-plugin.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSqliteDbPlugin(), wasm(), topLevelAwait()],
  optimizeDeps: {
    exclude: ['@react-cad/core']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 3000,
    open: false,
    host: true,
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['chart.js', 'react-chartjs-2'],
          'vendor-3d': ['three'],
          'vendor-math': ['katex', 'react-katex'],
          'vendor-ui': ['bootstrap', 'react-bootstrap', 'canvas-confetti'],
        },
      },
    },
  },
});
