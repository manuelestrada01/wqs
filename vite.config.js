import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',
  assetsInlineLimit: 0,
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap'],
        },
      },
    },
  },
});
