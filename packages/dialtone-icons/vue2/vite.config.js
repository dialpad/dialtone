import vue from '@vitejs/plugin-vue2';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, '../index.js'),
      name: 'DialtoneIcon@2',
      fileName: 'dialtone-icon@2',
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
