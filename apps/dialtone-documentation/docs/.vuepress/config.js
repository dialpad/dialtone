import { viteBundler } from '@vuepress/bundler-vite';
import { defineUserConfig } from 'vuepress'
import viteSvgLoader from 'vite-svg-loader';
import anchor from 'markdown-it-anchor';
import { getDirname, path } from 'vuepress/utils'

const sidebar = require('../_data/site-nav.json');
const { dialtoneVuepressTheme } = require('./theme');
const baseURL = (process.env.VUEPRESS_BASE_URL ?? '/');

const themeConfig = {
  logo: baseURL + 'assets/images/dialpad-logo.svg',
  // Navbar config disabled - now using Navbar component with hardcoded top-level navigation
  // Top-level navigation: Foundations | Design System | Careers | Articles
  // Design System sections (Design, Components, etc.) appear in left sidebar
  navbar: [],
  sidebar,
  sidebarDepth: 0,
  editLink: false,
  colorModeSwitch: false,
  contributors: false,
};

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  // site config
  lang: 'en-US',
  title: 'Dialtone Design System',

  base: baseURL,

  port: 4000,

  // theme and its config
  theme: dialtoneVuepressTheme(themeConfig),

  bundler: viteBundler({
    viteOptions: {
      build: {
        sourcemap: true,
      },
      plugins: [
        viteSvgLoader({ svgo: false }),
      ],
      css: {
        devSourcemap: true,
      },
    },
    vuePluginOptions: {
      template: {
        compilerOptions: {
          whitespace: 'preserve',
        },
      },
    },
  }),

  // Header links and meta tags
  head: [
    // Favicons
    ['link', {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: baseURL + 'assets/images/favicons/apple-touch-icon.png',
    }],
    ['link', { rel: 'icon', href: baseURL + 'assets/images/favicons/favicon.svg' }],
    ['link', { rel: 'manifest', href: baseURL + 'assets/images/favicons/site.webmanifest' }],
    ['link', { rel: 'mask-icon', href: baseURL + 'assets/images/favicons/safari-pinned-tab.svg', color: '#7C52FF' }],
    ['meta', { name: 'msapplication-TileColor', content: '#7C52FF' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
  ],

  // markdown config
  markdown: {
    anchor: {
      level: [1, 2, 3],
      permalink: anchor.permalink.ariaHidden({
        class: 'header-anchor d-link',
      }),
    },
    headers: {
      level: [2, 3], // Generated data header levels (used for toc)
    },
  },

  alias: {
    '@data': path.resolve(__dirname, '../_data/'), // Needed to import json data.
    '@exampleComponents': path.resolve(__dirname, './exampleComponents'),
    '@baseComponents': path.resolve(__dirname, './baseComponents'),
    '@views': path.resolve(__dirname, './views'),
    '@mixins': path.resolve(__dirname, './common/mixins/'),
    '@utilities': path.resolve(__dirname, './common/utilities.js'),
    '@composables': path.resolve(__dirname, './theme/composables'),
    '@projectRoot': path.resolve(__dirname, '../../'),
    '@': path.resolve(__dirname, '../'),
    '@workspaceRoot': path.resolve(__dirname, '../../../../'),
  },
});
