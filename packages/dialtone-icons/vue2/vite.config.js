import vue from '@vitejs/plugin-vue2';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { glob } from 'glob';

const iconEntries = glob.sync('../src/icons/*.vue').reduce((entries, path) => {
  const entryName = path.replace(/^\.\.\/src\/icons\/(.*)\.vue$/, 'components/$1');
  entries[entryName] = path;
  return entries;
}, {});
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        ...iconEntries,
        'dialtone-icons': resolve(__dirname, '../index.js'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        minifyInternalExports: true,
      },
    },
    minify: true,
  },
});
