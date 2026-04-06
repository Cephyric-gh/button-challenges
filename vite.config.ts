import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: '/public/',
  base: '/button-challenges/',
  plugins: [react(), tailwindcss()],
  build: { outDir: '../dist', emptyOutDir: true },
});
