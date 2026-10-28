import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project site: https://mrzch03.github.io/word-root-atlas/
export default defineConfig({
  plugins: [react()],
  base: '/word-root-atlas/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'diorama';
          if (id.includes('node_modules/react')) return 'react';
        },
      },
    },
  },
});
