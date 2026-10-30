import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Same dev port and output directory as Create React App, which the
  // Dockerfile and local setup expect.
  server: { port: 3000 },
  build: { outDir: 'build' },
});
