import { defineConfig } from 'vite';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import dts from 'vite-plugin-dts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        'postcss/rem-to-px': resolve(__dirname, './postcss/rem-to-px.js'),
        'postcss/root-to-host': resolve(__dirname, './postcss/root-to-host.js'),
        'themes/config': resolve(__dirname, './themes/config.js'),
        'themes/dp-light': resolve(__dirname, './themes/dp-light.js'),
        'themes/dp-dark': resolve(__dirname, './themes/dp-dark.js'),
        'themes/expressive-light': resolve(
          __dirname,
          './themes/expressive-light.js',
        ),
        'themes/expressive-dark': resolve(
          __dirname,
          './themes/expressive-dark.js',
        ),
        'themes/tmo-light': resolve(__dirname, './themes/tmo-light.js'),
        'themes/tmo-dark': resolve(__dirname, './themes/tmo-dark.js'),
        'themes/expressive-sm-light': resolve(
          __dirname,
          './themes/expressive-sm-light.js',
        ),
        'themes/expressive-sm-dark': resolve(
          __dirname,
          './themes/expressive-sm-dark.js',
        ),
        'themes/debug': resolve(__dirname, './themes/debug.js'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      output: {
        chunkFileNames: () => 'themes/chunks/[name]-[hash].js',
      },
    },
    minify: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  plugins: [dts({ outDir: 'dist/types' })],
});
