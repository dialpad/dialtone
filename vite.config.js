import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
import vue from '@vitejs/plugin-vue';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import hash from 'string-hash';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        'dialtone-vue': resolve(__dirname, './index.js'),
        emoji: resolve(__dirname, './emoji.js'),
        message_input: resolve(__dirname, './message_input.js'),
        directives: resolve(__dirname, './directives.js'),
      },
    },
    rollupOptions: {
      plugins: [nodeResolve()],
      external: [
        'vue',
        '@dialpad/dialtone',
        /node_modules/,
      ],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [vue(), svgLoader({
    svgoConfig: {
      plugins: [
        {
          name: 'prefixIds',
          params: {
            delim: '',
            prefix: (_, extra) => {
              return `dt-icon${hash(extra.path)}`;
            },
            prefixClassNames: false,
          },
        },
      ],
    },
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setupTests.js',
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'tests/setupTests.js',
      ],
    },
  },
});
