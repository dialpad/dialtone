import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import vueAccessibility from 'eslint-plugin-vuejs-accessibility';
import storybook from 'eslint-plugin-storybook';
import vitest from 'eslint-plugin-vitest';
import globals from 'globals'
import componentsList from '../../common/components_list.js';

componentsList.push('btn', 'select', 'validation-message', 'label', 'description', 'split-btn', 'mention-suggestion', 'suggestion-list');
const componentsNames = componentsList.map(name => name.replace('_', '-').replace('.vue', ''));

export default [
  js.configs.recommended,
  ...vue.configs['flat/vue2-essential'],
  ...vue.configs['flat/vue2-strongly-recommended'],
  ...vue.configs['flat/vue2-recommended'],
  {
    files: ['**/*.stories.js', '**/*.story.js', '**/*.stories.vue', '**/*.story.vue', '.storybook/**'],
    plugins: {
      storybook,
    },
    rules: {
      'storybook/await-interactions': 'error',
      'storybook/context-in-play-function': 'error',
      'storybook/default-exports': 'error',
      'storybook/hierarchy-separator': 'warn',
      'storybook/no-redundant-story-name': 'warn',
      'storybook/prefer-pascal-case': 'warn',
      'storybook/story-exports': 'off',
      'storybook/use-storybook-expect': 'error',
      'storybook/use-storybook-testing-library': 'error',
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      // Override for Vue 2 compatibility
      'vue/multi-word-component-names': 'off',
      'vue/no-v-model-argument': 'warn',
    },
  },
  {
    plugins: {
      'vuejs-accessibility': vueAccessibility,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      camelcase: ['error', {
        properties: 'never',
        allow: ['^opt_'], // Allow opt_varname arguments.
      }],
      'comma-dangle': ['error', 'always-multiline'],
      'no-console': ['warn', {
        allow: ['error', 'info'],
      }],
      'max-len': ['error', {
        code: 120,
        tabWidth: 2,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      'prefer-promise-reject-errors': ['error', {
        allowEmptyReject: true,
      }],
      'vue/comma-dangle': ['error', 'always-multiline'],
      'vue/component-name-in-template-casing': ['error', 'kebab-case', {
        registeredComponentsOnly: true,
      }],
      'vuejs-accessibility/label-has-for': ['error', {
        required: {
          some: ['nesting', 'id'],
        },
        allowChildren: true,
      }],
      'vue/attributes-order': ['warn', {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'SLOT',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
        alphabetical: false,
      }],
      'vue/new-line-between-multi-line-property': ['warn'],
      'vue/html-comment-content-spacing': ['warn'],
      'vue/no-potential-component-option-typo': ['warn'],
      'vue/multi-word-component-names': ['off'],
      'vue/no-reserved-component-names': ['error', {
        disallowVueBuiltInComponents: true,
        disallowVue3BuiltInComponents: true,
      }],
      'vue/no-v-model-argument': ['warn'],
      'vue/padding-line-between-blocks': ['warn'],
      'vue/require-direct-export': ['warn'],
      'vue/require-name-property': ['error'],
      'vue/valid-next-tick': ['error'],
      'vue/block-tag-newline': ['error'],
      'vue/no-duplicate-attr-inheritance': ['error'],
      'vue/no-bare-strings-in-template': ['error'],
      'vue/no-undef-components': ['error'],
      'vue/no-unused-properties': ['warn'],
      'vue/v-on-event-hyphenation': ['error'],
      'vue/no-template-target-blank': ['error'],
      'vue/no-static-inline-styles': ['error'],
      'vuejs-accessibility/iframe-has-title': 'warn',
      'vuejs-accessibility/aria-props': 'warn',
      'max-lines': ['warn', {
        max: 300,
        skipBlankLines: true,
        skipComments: true,
      }],
      quotes: ['error', 'single', {
        allowTemplateLiterals: true,
      }],
      complexity: ['warn', 8],
      'vue/no-restricted-class': ['error', `/^d-(?!(recipe|${componentsNames.join('|')})).*/`],
    },
  },
  {
    files: [
      '**/*.test.js',
      'tests/shared_examples/*.js',
      'tests/setupTests.js',
    ],
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
      },
    },
    rules: {
      'max-lines': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.story.vue'],
    rules: {
      'vue/no-bare-strings-in-template': ['off'],
      'vue/no-restricted-class': ['off'],
    },
  },
  {
    files: ['common/**'],
    rules: {
      'vue/no-restricted-class': ['off'],
    },
  },
  {
    files: ['prototypes/**/*.vue'],
    rules: {
      'vue/no-bare-strings-in-template': ['off'],
      'vue/no-restricted-class': ['off'],
    },
  },
  {
    ignores: [
      'node_modules',
      'storybook-static',
      'tests/.cache',
      'tests/compiled',
      '**/*.ejs',
      'dist',
      '**/common/emoji/index.js',
      '**/common/storybook_utils.js',
      '**/components/emoji/emoji.test.js',
      '**/components/emoji_text_wrapper/emoji_text_wrapper.test.js',
      '**/components/icon/icon_constants.js',
      '**/components/illustration/illustration_constants.js',
    ],
  },
];
