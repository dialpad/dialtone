import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, '../index.js'),
      name: 'DialtoneIcon@3',
      fileName: 'dialtone-icon@3',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    emptyOutDir: false,
    outDir: '../dist',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../../../'),
    },
  },
});
