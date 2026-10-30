import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // In development the back runs on its own port; in production it
    // serves this client itself.
    proxy: {
      '/api': 'http://localhost:8000',
      '/socket.io': { target: 'ws://localhost:8000', ws: true },
    },
  },
  build: { outDir: 'build' },
});
