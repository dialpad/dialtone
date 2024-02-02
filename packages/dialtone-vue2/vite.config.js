import { defineConfig } from 'vite';
import { createSvgPlugin } from 'vite-plugin-vue2-svg';
import vue from '@vitejs/plugin-vue2';
import { fileURLToPath } from 'url';
import hash from 'string-hash';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      name: 'dialtone-vue',
      entry: 'index.js',
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-demi',
        '@dialpad/dialtone-css',
      ],
      output: {
        globals: {
          vue: 'Vue',
          'vue-demi': 'VueDemi',
        },
      },
    },
  },
  plugins: [vue(), createSvgPlugin({
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
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
});
