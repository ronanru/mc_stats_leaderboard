import solidDevtoolsPlugin from 'solid-devtools/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    solidDevtoolsPlugin({
      autoname: true,
    }),
    solidPlugin(),
  ],
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
