import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: 'src/main.ts',
      output: {
        entryFileNames: 'assets/main.js',
        assetFileNames: 'assets/main.css',
      },
    },
  },
});
