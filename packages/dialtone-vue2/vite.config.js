import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import { globSync } from 'glob';
import { fileURLToPath } from 'node:url';
import dts from 'vite-plugin-dts';

function _getEntries (pathPrefix, globRegex) {
  return globSync(globRegex, {
    ignore: [
      '**/*.story.vue',
      '**/*.stories.js',
      '**/*.test.js',
      'common/storybook_utils.js',
      'common/v_html.js',
      'common/mixins/keyboard_list_navigation_tester.vue',
      'components/plugins/*',
    ],
    maxDepth: 4,
  }).reduce((entries, path) => {
    const entryName = path
      .split('/')
      .slice(-2)
      .join('/')
      .replace(`${pathPrefix}/`, '')
      .replace(/\.(vue|js)/, '')
      .replaceAll('_', '-');

    entries[`${pathPrefix}/${entryName}`] = path;

    return entries;
  }, {});
}

const commonEntries = _getEntries('common', 'common/*/*.{js,vue}');
const componentEntries = _getEntries('lib', 'components/*/*.{js,vue}');
const directiveEntries = _getEntries('lib', 'directives/*/*.{js,vue}');
const recipeEntries = _getEntries('lib', 'recipes/**/*.{js,vue}');

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    minify: true,
    rollupOptions: {
      external: [
        /^@dialpad/,
        /^@tiptap\/(?!vue-2)/,
        /^date-fns/,
        /^emoji-toolkit/,
        /^overlayscrollbars/,
        /^prosemirror/,
        '@linusborg/vue-simple-portal',
        'regex-combined-emojis',
        'deep-equal',
        'tippy.js',
        'vue',
      ],
      output: {
        minifyInternalExports: true,
        exports: 'named',
      },
      treeshake: 'smallest',
    },
    lib: {
      entry: {
        ...commonEntries,
        ...componentEntries,
        ...directiveEntries,
        ...recipeEntries,
        'shared/sr_only_close_button': './common/sr_only_close_button.vue',
        'node_modules/@tiptap/vue-2': './node_modules/@tiptap/vue-2/dist/index.js',
        'dialtone-vue': './index.js',
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
