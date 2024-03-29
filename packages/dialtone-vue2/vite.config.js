import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

function _extractEntryNameFromPath (path, pathPrefix) {
  const regex = new RegExp(`^${pathPrefix}(\\/(\\w+))+\\/index\\.js$`);
  return path.replace(regex, '$2').replaceAll('_', '-');
}
function _getEntries (pathPrefix, globRegex, entrySuffix = '') {
  return glob.sync(globRegex).reduce((entries, path) => {
    let entryName = _extractEntryNameFromPath(path, pathPrefix);
    if (entrySuffix) entryName += `-${entrySuffix}`;

    entries[`lib/${entryName}`] = path;

    return entries;
  }, {});
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commonEntries = _getEntries('common', 'common/*/index.js');
const componentEntries = _getEntries('components', 'components/*/index.js');
const directiveEntries = _getEntries('directives', 'directives/*/index.js', 'directive');
const recipeEntries = _getEntries('recipes', 'recipes/**/index.js');

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: {
        ...commonEntries,
        ...componentEntries,
        ...directiveEntries,
        ...recipeEntries,
        'dialtone-vue': resolve(__dirname, './index.js'),
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
        chunkFileNames: () => 'chunks/[name]-[hash].js',
        minifyInternalExports: true,
      },
      treeshake: 'smallest',
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
