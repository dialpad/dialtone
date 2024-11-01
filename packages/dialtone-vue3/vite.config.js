import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import dts from 'vite-plugin-dts';

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
        /^@tiptap/,
        /^date-fns/,
        /^emoji-toolkit/,
        /^overlayscrollbars/,
        /^prosemirror/,
        'regex-combined-emojis',
        'tippy.js',
        'vue',
      ],
      output: {
        preserveModules: true,
        minifyInternalExports: false,
        exports: 'named',
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
  plugins: [vue(), dts({ outDir: 'dist/types' })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setupTests.js',
    exclude: ['common/custom-emoji.test.js'],
    include: ['./{common,components,directives,recipes}/**/*.test.js'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
