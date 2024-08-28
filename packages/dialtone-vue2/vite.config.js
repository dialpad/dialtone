import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
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

    if (pathPrefix === 'common') {
      entries[`common/${entryName}`] = path;
    } else {
      entries[`lib/${entryName}`] = path;
    }

    return entries;
  }, {});
}

const commonEntries = _getEntries('common', 'common/*/index.js');
const componentEntries = _getEntries('components', 'components/*/index.js');
const directiveEntries = _getEntries('directives', 'directives/*/index.js', 'directive');
const recipeEntries = _getEntries('recipes', 'recipes/**/index.js');

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    minify: false,
    rollupOptions: {
      external: [
        /^@dialpad/,
        /^@linusborg/,
        /^@tiptap/,
        /^date-fns/,
        /^emoji-toolkit/,
        /^tippy\.js/,
        /^prosemirror/,
        /^overlayscrollbars/,
        'vue',
        'regex-combined-emojis',
      ],
      output: {
        preserveModules: true,
        minifyInternalExports: false,
      },
      treeshake: 'smallest',
    },
    lib: {
      entry: {
        'dialtone-vue': './index.js',
        ...commonEntries,
        ...componentEntries,
        ...directiveEntries,
        ...recipeEntries,
      },
      formats: ['es', 'cjs'],
    },
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
