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
  navbar: [
    { text: 'Home', link: '/' },
    { text: 'Design', link: '/design/' },
    { text: 'Components', link: '/components/' },
    { text: 'Utilities', link: '/utilities/' },
    { text: 'Tokens', link: '/tokens/' },
    { text: 'Guides', link: '/guides/' },
    { text: 'About', link: '/about/dialtone' },
  ],
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
    // Site-level SEO defaults
    ['meta', { name: 'description', content: 'Dialtone is Dialpad\'s design system — tokens, CSS utilities, and Vue components for building consistent UIs.' }],
    ['meta', { property: 'og:site_name', content: 'Dialtone Design System' }],
    ['meta', { name: 'twitter:site', content: '@dialpad' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // JSON-LD
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Dialtone Design System',
      url: 'https://dialtone.dialpad.com',
      description: 'Dialpad\'s design system — tokens, CSS utilities, and Vue components.',
      publisher: {
        '@type': 'Organization',
        name: 'Dialpad',
        url: 'https://www.dialpad.com',
      },
    })],
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
    '@projectRoot': path.resolve(__dirname, '../../'),
    '@': path.resolve(__dirname, '../'),
    '@workspaceRoot': path.resolve(__dirname, '../../../../'),
  },

  extendsPage: (page) => {
    const SITE_URL = 'https://dialtone.dialpad.com';
    const DEFAULT_IMAGE = `${SITE_URL}/assets/images/home-hero.png`;

    const title = page.frontmatter.title || page.frontmatter.heading;
    const desc = page.frontmatter.description;
    const image = page.frontmatter.image
      ? `${SITE_URL}/${page.frontmatter.image}`
      : DEFAULT_IMAGE;
    const url = `${SITE_URL}${page.path}`;

    page.frontmatter.head ??= [];

    if (desc) {
      page.frontmatter.head.push(['meta', { name: 'description', content: desc }]);
      page.frontmatter.head.push(['meta', { property: 'og:description', content: desc }]);
      page.frontmatter.head.push(['meta', { name: 'twitter:description', content: desc }]);
    }
    if (title) {
      page.frontmatter.head.push(['meta', { property: 'og:title', content: `${title} | Dialtone Design System` }]);
      page.frontmatter.head.push(['meta', { name: 'twitter:title', content: `${title} | Dialtone Design System` }]);
    }

    page.frontmatter.head.push(
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:image', content: image }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['link', { rel: 'canonical', href: url }],
    );
  },
});
