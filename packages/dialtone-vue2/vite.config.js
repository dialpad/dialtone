import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        'dialtone-vue': resolve(__dirname, './index.js'),
        'components/icon': resolve(__dirname, './components/icon/index.js'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /@dialpad/,
        /@linusborg/,
        /@tiptap/,
        /date-fns/,
        /emoji-regex/,
        /emoji-toolkit/,
        /tippy\.js/,
        /prosemirror/,
        'vue',
      ],
      output: {
        minifyInternalExports: true,
      },
    },
    minify: true,
  },
  plugins: [vue()],
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
