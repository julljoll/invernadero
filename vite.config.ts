import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteSqliteDbPlugin } from './scripts/vite-db-plugin.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSqliteDbPlugin()],
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
});
