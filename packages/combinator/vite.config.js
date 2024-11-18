import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

export default defineConfig({
  build: {
    sourcemap: true,
    minify: false,
    rollupOptions: {
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
        globals: {
          vue: 'Vue',
        },
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
    },
  },
});
