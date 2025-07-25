import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
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
  assetsInclude: ['**/*.ftl'],
  build: {
    sourcemap: true,
    minify: true,
    rollupOptions: {
      external: [
        /^@dialpad/,
        /^@tiptap\/(?!vue-3)/,
        /^date-fns/,
        /^emoji-toolkit/,
        /^overlayscrollbars/,
        /^prosemirror/,
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
        'dialtone-vue': './index.js',

        ...commonEntries,
        ...componentEntries,
        ...directiveEntries,
        ...recipeEntries,

        // Shared components
        'shared/sr_only_close_button': './common/sr_only_close_button.vue',

        // Dependencies
        'node_modules/@tiptap/vue-3': './node_modules/@tiptap/vue-3/dist/index.js',

        // Localization
        'localization/index': './localization/index.js',
        'localization/en-US': './localization/en-US.ftl?raw',
        'localization/zh-CN': './localization/zh-CN.ftl?raw',
        'localization/nl-NL': './localization/nl-NL.ftl?raw',
        'localization/fr-FR': './localization/fr-FR.ftl?raw',
        'localization/de-DE': './localization/de-DE.ftl?raw',
        'localization/it-IT': './localization/it-IT.ftl?raw',
        'localization/ja-JP': './localization/ja-JP.ftl?raw',
        'localization/pt-BR': './localization/pt-BR.ftl?raw',
        'localization/ru-RU': './localization/ru-RU.ftl?raw',
        'localization/es-LA': './localization/es-LA.ftl?raw',
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
    name: 'dialtone-vue3',
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
