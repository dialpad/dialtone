import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { globSync } from 'glob';
import { existsSync, readFileSync } from 'node:fs';
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
      'components/Plugins/*',
    ],
    maxDepth: 4,
  }).reduce((entries, path) => {
    const entryName = path
      .split('/')
      .slice(-2)
      .join('/')
      .replace(`${pathPrefix}/`, '')
      .replace(/\.(vue|js)/, '')
      .replaceAll('_', '-')
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase();

    entries[`${pathPrefix}/${entryName}`] = path;

    return entries;
  }, {});
}

// Dependencies too heavy for the main entry. Apps that hold the whole main entry
// (`import * as Dialtone`) ship every module it reaches, so these live in their
// own subpath exports instead, e.g. `@dialpad/dialtone/vue3/phone`.
const MAIN_ENTRY_FORBIDDEN_DEPENDENCIES = ['libphonenumber-js'];
const SUBPATH_EXPORTS = ['./phone'];

// Matches a quoted module specifier such as `"libphonenumber-js/min"`. The code is
// scanned because Rolldown lists a lazily imported external in neither
// `chunk.imports` nor `chunk.dynamicImports`.
const FORBIDDEN_SPECIFIER = new RegExp(`["'\`]((${MAIN_ENTRY_FORBIDDEN_DEPENDENCIES.join('|')})(/[^"'\`]*)?)["'\`]`);

const packageExports = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')).exports;

function findMissingSubpathTarget (bundle, condition) {
  for (const subpath of SUBPATH_EXPORTS) {
    const target = packageExports[subpath]?.[condition];
    if (bundle[target?.replace('./dist/', '')]?.type !== 'chunk') {
      return `package.json exports "${subpath}" ${condition} points at ${target}, which this build did not emit.`;
    }
  }
}

// Walks every chunk the main entry reaches. The entry file itself only imports
// local chunks, so checking its own imports is not enough.
function findForbiddenImport (entry, bundle) {
  const visited = new Set([entry.fileName]);
  const queue = [entry];
  while (queue.length) {
    const chunk = queue.shift();
    const forbidden = chunk.code.match(FORBIDDEN_SPECIFIER);
    if (forbidden) {
      return `${entry.fileName} imports "${forbidden[1]}" (via ${chunk.fileName}). ` +
        'Export it from its own subpath instead of the main entry.';
    }
    for (const id of [...chunk.imports, ...chunk.dynamicImports]) {
      if (visited.has(id) || bundle[id]?.type !== 'chunk') continue;
      visited.add(id);
      queue.push(bundle[id]);
    }
  }
}

// Fails the build if the main entry reaches a forbidden dependency through any
// chain of static or dynamic imports, or if a subpath export points at a file the
// build did not emit.
function mainEntryImportGuard (libraryEntryNames) {
  let isLibraryBuild = false;

  const plugin = {
    name: 'dialtone-main-entry-import-guard',
    apply: 'build',
    generateBundle (options, bundle) {
      const entries = Object.values(bundle).filter((file) => file.type === 'chunk' && file.isEntry);
      const entry = entries.find((chunk) => chunk.name === 'dialtone-vue');
      if (!entry) {
        // Other builds that load this config, such as Storybook, emit no library entries.
        if (entries.some((chunk) => libraryEntryNames.includes(chunk.name))) {
          this.error('No "dialtone-vue" entry chunk, so the main entry import guard cannot run. ' +
            'Update the guard if the entry was renamed.');
        }
        return;
      }
      isLibraryBuild = true;

      const condition = options.format === 'cjs' ? 'require' : 'import';
      const problem = findMissingSubpathTarget(bundle, condition) ?? findForbiddenImport(entry, bundle);
      if (problem) this.error(problem);
    },
  };

  // Declarations come from vite-plugin-dts, which writes them after the bundle.
  function checkSubpathTypes () {
    if (!isLibraryBuild) return;
    for (const subpath of SUBPATH_EXPORTS) {
      const types = packageExports[subpath]?.types;
      if (!types || !existsSync(fileURLToPath(new URL(types, import.meta.url)))) {
        throw new Error(`package.json exports "${subpath}" types points at ${types}, which this build did not emit.`);
      }
    }
  }

  return { plugin, checkSubpathTypes };
}

const commonEntries = _getEntries('common', 'common/*/*.{js,vue}');
const componentEntries = _getEntries('lib', 'components/*/*.{js,vue}');
const directiveEntries = _getEntries('lib', 'directives/*/*.{js,vue}');
const mainEntryGuard = mainEntryImportGuard(Object.keys(componentEntries));

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.ftl'],
  build: {
    target: 'es2020',
    sourcemap: true,
    minify: true,
    rolldownOptions: {
      external: [
        /^@dialpad/,
        /^@tiptap\/(?!vue-3|static-renderer)/,
        /^date-fns/,
        /^libphonenumber-js/,
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
      treeshake: true,
    },
    lib: {
      entry: {
        'dialtone-vue': './index.js',

        ...commonEntries,
        ...componentEntries,
        ...directiveEntries,

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
        'localization/ko-KR': './localization/ko-KR.ftl?raw',
        'localization/pt-BR': './localization/pt-BR.ftl?raw',
        'localization/ru-RU': './localization/ru-RU.ftl?raw',
        'localization/es-LA': './localization/es-LA.ftl?raw',
        'localization/sv-SE': './localization/sv-SE.ftl?raw',
      },
      formats: ['es', 'cjs'],
    },
  },
  plugins: [
    vue(),
    mainEntryGuard.plugin,
    dts({
      vue: true,
      parallel: true,
      compilerOptions: { skipLibCheck: true },
      afterBuild: mainEntryGuard.checkSubpathTypes,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    name: 'dialtone-vue',
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setupTests.js',
    exclude: ['common/custom-emoji.test.js'],
    include: [
      './{common,components,directives,localization}/**/*.test.js',
      './.storybook/**/*.test.js',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './coverage',
      include: [
        'components/**/*.{js,vue}',
        'common/**/*.{js,vue}',
        'directives/**/*.{js,vue}',
        'localization/**/*.{js,vue}',
      ],
      exclude: [
        '**/*.test.js',
        '**/*.story.vue',
        '**/*.stories.js',
        '**/*.config.js',
        '**/*.config.cjs',
        '**/tests/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        'common/storybook_utils.js',
        'common/v_html.js',
        'common/mixins/keyboard_list_navigation_tester.vue',
        'components/Plugins/*',
        '.storybook/**',
        'storybook-static/**',
      ],
      clean: true, // clean coverage directory before running tests
      skipFull: true, // skip full coverage report
      thresholds: { // will fail the build if coverage is below these thresholds
        global: {
          branches: 80,
          functions: 70,
          lines: 85,
          statements: 85,
        },
      },
    },
  },
});
