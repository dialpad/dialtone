import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { glob } from 'glob';

const iconEntries = glob.sync('../src/icons/*.vue').reduce((entries, path) => {
  const entryName = path.replace(/^\.\.\/src\/icons\/(.*)\.vue$/, 'components/$1');
  entries[entryName] = path;
  return entries;
}, {});
export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: {
        ...iconEntries,
        'dialtone-icons': resolve(__dirname, '../index.js'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        minifyInternalExports: true,
        sourcemap: true,
      },
    },
    minify: true,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../', import.meta.url)),
    },
  },
});
