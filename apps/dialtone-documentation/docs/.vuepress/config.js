import { viteBundler } from '@vuepress/bundler-vite';
import { defineUserConfig } from 'vuepress'
import { llmsPlugin } from '@vuepress/plugin-llms';
import viteSvgLoader from 'vite-svg-loader';
import anchor from 'markdown-it-anchor';
import { getDirname, path } from 'vuepress/utils'
import { execSync } from 'node:child_process';
import { BROWSER_THEME_COLOR_FALLBACK } from './theme/utils/browserThemeColor.js';

const sidebar = require('../_data/site-nav.json');
const { dialtoneVuepressTheme } = require('./theme');
const baseURL = (process.env.VUEPRESS_BASE_URL ?? '/');

function resolveBranchName () {
  // GITHUB_HEAD_REF is set on pull_request events; GITHUB_REF_NAME on push events.
  const fromCi = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME;
  if (fromCi) return fromCi;
  try {
    return execSync('git symbolic-ref --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

const branchName = resolveBranchName();

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

  pagePatterns: [
    '**/*.md',
    '!.vuepress',
    '!.vuepress/**',
    '!node_modules',
    '!node_modules/**',
  ],

  // theme and its config
  theme: dialtoneVuepressTheme(themeConfig),

  bundler: viteBundler({
    viteOptions: {
      define: {
        __DIALTONE_DEPLOY_PREVIEW__: JSON.stringify(baseURL.includes('deploy-previews')),
        __DIALTONE_BRANCH_NAME__: JSON.stringify(branchName),
      },
      build: {
        sourcemap: true,
      },
      plugins: [
        viteSvgLoader({ svgo: false }),
      ],
      css: {
        devSourcemap: true,
      },
      resolve: {
        alias: [
          // The combinator's DtcNode uses runtime template compilation (h({ template: '...' })),
          // which requires the full Vue build including the compiler.
          // Exact match only — must not rewrite vue/server-renderer etc. during SSR build.
          { find: /^vue$/, replacement: 'vue/dist/vue.esm-bundler.js' },
        ],
      },
      server: {
        // hmr: {
        //   overlay: false,
        // },
        watch: {
          ignored: ['**/node_modules/**'],
        },
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
    ['meta', { name: 'theme-color', content: BROWSER_THEME_COLOR_FALLBACK }],
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
    '@composables': path.resolve(__dirname, './theme/composables'),
    '@projectRoot': path.resolve(__dirname, '../../'),
    '@': path.resolve(__dirname, '../'),
    '@workspaceRoot': path.resolve(__dirname, '../../../../'),
  },

  plugins: [
    llmsPlugin({
      domain: 'https://dialtone.dialpad.com',
      llmsTxt: true,
      llmsFullTxt: true,
      llmsPageTxt: false,
      filter: (page) => {
        const p = page.path;

        // Exclude changelogs and brand assets regardless of other rules
        if (p.startsWith('/about/whats-new/')) return false;
        if (p.startsWith('/design/brand/')) return false;
        if (p.startsWith('/design/illustrations/')) return false;

        // Homepage
        if (p === '/') return true;

        // All design foundations (colors, typography, space, elevation, motion, icons, size)
        if (p.startsWith('/design/')) return true;

        // Section indexes only — no deep component/utility/token pages
        if (p === '/components/') return true;
        if (p === '/utilities/') return true;
        if (p === '/tokens/') return true;

        // Key guides
        if (p.startsWith('/guides/getting-started/')) return true;
        if (p.startsWith('/guides/accessibility/')) return true;
        if (p.startsWith('/guides/contributing/')) return true;
        if (p.startsWith('/guides/mcp-server/')) return true;

        return false;
      },
      llmsTxtTemplateGetter: {
        title: 'Dialtone Design System',
        description: 'Dialpad\'s design system — 58 Vue 3 components, 3,336 CSS utility classes, 6,019 design tokens, and documentation for building consistent UIs across Dialpad products.',
        details: 'Site: https://dialtone.dialpad.com | Repository: https://github.com/dialpad/dialtone | MCP server available for AI-assisted development.',
      },
    }),
  ],

  extendsPage: (page) => {
    const SITE_URL = 'https://dialtone.dialpad.com';
    const DEFAULT_IMAGE = `${SITE_URL}/assets/images/default-og-image.png`;

    const title = page.frontmatter.title || page.frontmatter.heading || page.title || 'Dialtone Design System';
    const seoTitle = title === 'Dialtone Design System' ? title : `${title} | Dialtone Design System`;
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

    page.frontmatter.head.push(['meta', { property: 'og:title', content: seoTitle }]);
    page.frontmatter.head.push(['meta', { name: 'twitter:title', content: seoTitle }]);

    page.frontmatter.head.push(
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:image', content: image }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['link', { rel: 'canonical', href: url }],
    );
  },
});
