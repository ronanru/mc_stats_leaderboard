import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 4000,
    proxy: {
      '/api': 'http://0.0.0.0:3000',
    },
  },
  build: {
    target: 'esnext',
  },
});
