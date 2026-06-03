import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

export default defineConfig({
  build: {
    target: 'es2020',
    sourcemap: true,
    minify: false,
    rolldownOptions: {
      external: [
        /^@dialpad/,
        'change-case',
        'js-beautify',
        'json5-with-undefined',
        'just-clone',
        'vue',
      ],
      output: {
        preserveModules: true,
        minifyInternalExports: false,
      },
    },
    lib: {
      entry: {
        'dialtone-combinator': './index.js',
      },
      formats: ['es'],
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
      vue: 'vue/dist/vue.esm-bundler.js',
      '@workspaceRoot': fileURLToPath(new URL('../../', import.meta.url)),
    },
  },
  test: {
    name: 'dialtone-combinator',
    globals: true,
    environment: 'jsdom',
    include: ['./src/**/*.test.js'],
  },
});
