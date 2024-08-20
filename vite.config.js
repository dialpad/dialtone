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
        'themes/config': resolve(__dirname, './common/themes/config.js'),
        'themes/dp-light': resolve(__dirname, './common/themes/dp-light.js'),
        'themes/dp-dark': resolve(__dirname, './common/themes/dp-dark.js'),
        'themes/expressive-light': resolve(
          __dirname,
          './common/themes/expressive-light.js',
        ),
        'themes/expressive-dark': resolve(
          __dirname,
          './common/themes/expressive-dark.js',
        ),
        'themes/tmo-light': resolve(__dirname, './common/themes/tmo-light.js'),
        'themes/tmo-dark': resolve(__dirname, './common/themes/tmo-dark.js'),
        'themes/expressive-sm-light': resolve(
          __dirname,
          './common/themes/expressive-sm-light.js',
        ),
        'themes/expressive-sm-dark': resolve(
          __dirname,
          './common/themes/expressive-sm-dark.js',
        ),
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
  plugins: [dts({ outDir: 'dist/themes/types' })],
});
