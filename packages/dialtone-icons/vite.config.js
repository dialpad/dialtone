import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'DialtoneIcon',
      fileName: 'dialtone-icon',
    },
    rollupOptions: {
      external: ['vue', 'vue-demi'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-demi': 'VueDemi',
        },
      },
    },
    emptyOutDir: false,
  },
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
});
