import { themeDataPlugin } from '@vuepress/plugin-theme-data';
import { prismjsPlugin } from '@vuepress/plugin-prismjs';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';
import { gitPlugin } from '@vuepress/plugin-git';
import { sitemapPlugin } from 'vuepress-plugin-sitemap2';
import markdownItClass from '@toycode/markdown-it-class';
import fencedDemoPlugin from '../plugins/markdown-it-fenced-demo.js';
import codeExampleSourcePlugin from '../plugins/markdown-it-code-example-source.js';
import noticePlugin from '../plugins/markdown-it-notice.js';
import { findNavItemByLink } from './utils/findNavItemByLink.js';
import { getDirname, path } from 'vuepress/utils';

const __dirname = getDirname(import.meta.url);
const mapping = {
  h2: 'd-docsite--header-2',
  h3: 'd-docsite--header-3',
  h4: 'd-docsite--header-4',
  p: 'd-docsite--paragraph',
  ul: 'd-docsite--unordered-list',
  ol: 'd-docsite--ordered-list',
  li: 'd-docsite--list-element',
  img: 'd-docsite--image d-wmx100p',
  a: 'd-docsite--link d-link',
};
const _sortAlphabetically = (str1, str2) => {
  if (str1 > str2) return 1;
  if (str1 < str2) return -1;
  return 0;
};
const _normalizePagePath = (pagePath) => pagePath?.replace(/\.html$/, '/');

// Pages at /foundations/* that should NOT appear as standalone cards on the
// Foundations wall-of-cards (usually because they're children of another parent).
const FOUNDATIONS_OVERVIEW_EXCLUDES = [
  '/foundations/typography/',
  '/foundations/typography.html',
  '/foundations/colors/usage/',
  '/foundations/colors/palette/',
  '/foundations/colors/themes/',
  '/foundations/colors/chart-colors/',
  '/foundations/icons/usage/',
  '/foundations/icons/crafting-an-icon/',
  '/foundations/brand/using-our-logo/',
  '/foundations/brand/our-icon/',
  '/foundations/brand/sub-brands-and-co-branding/',
  '/foundations/brand/samples/',
  '/foundations/size/',
  '/foundations/space/',
  '/foundations/illustrations/',
];

function _blogPostsFrontmatter(app) {
  const blogPosts = app.pages
    .filter((page) => page.path.includes('/dialtone/whats-new/posts'))
    .map((post) => {
      delete post.frontmatter.description;
      return {
        ...post.frontmatter,
        firstParagraph: post.contentRendered
          .split('\n')
          .find((f) => f.startsWith('<p>')),
      };
    });

  const blogIndex = app.pages.find(
    (page) => page.path === '/dialtone/whats-new/',
  );
  blogIndex.data.blogPosts = blogPosts;

  const homePage = app.pages.find((page) => page.path === '/');
  if (homePage) {
    homePage.data.blogPosts = blogPosts;
  }
}

function _overviewFileName(name) {
  return name
    .toLowerCase()
    .replaceAll('&', 'and')
    .replaceAll(/['’]/g, '')
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-|-$/g, '');
}

function _getDialtoneOverviewItems(sidebar) {
  const navItems = sidebar?.nav || [];

  return navItems.filter((item) => item.link !== '/dialtone/');
}

function _injectOverviewPages(app, options) {
  const dialtoneIndexPage = app.pages.find(
    (page) => page.path === '/dialtone/',
  );
  if (!dialtoneIndexPage) return;

  dialtoneIndexPage.data.overviewPages = _getDialtoneOverviewItems(
    options.sidebar,
  )
    .map((item) => {
      const page = app.pages.find((p) => p.path === item.link);
      if (!page) return null;

      return {
        title: page.frontmatter.title,
        shortTitle: item.text || page.frontmatter.shortTitle,
        description: page.frontmatter.description,
        status: item.status || page.frontmatter.status,
        thumb: true,
        fileName: _overviewFileName(
          item.text || page.frontmatter.shortTitle || page.frontmatter.title,
        ),
        link: item.link,
      };
    })
    .filter(Boolean);
}

function _extractFrontmatter(app, path, options, exceptions = []) {
  const children = getChildrenPageNames(path, options.sidebar);

  // Filter out the parent page itself (e.g., "Overview" which links to the index page)
  const childPages = children.filter((child) => child.link !== path);
  const sortingArr = childPages.map((child) => _normalizePagePath(child.link));
  const indexPage = app.pages.find((page) => page.path === path);

  if (!indexPage) {
    console.warn(`[extractFrontmatter] No index page found for path: ${path}`);
    return;
  }

  const regExpPath = new RegExp(`^${path}[^/]+(\\.html|/)$`);

  indexPage.data.enhancedFrontmatter = app.pages
    .filter((page) => regExpPath.test(page.path))
    .filter((page) => page.frontmatter?.title || page.frontmatter?.shortTitle)
    .filter((page) => !exceptions.includes(page.path))
    .map((page) => {
      const fileName = (page.frontmatter.shortTitle || page.frontmatter.title)
        .toLowerCase()
        .replaceAll(' ', '-');
      return {
        fileName,
        link: page.path,
        name: page.frontmatter.shortTitle || fileName,
        ...page.frontmatter,
      };
    })
    .sort((a, b) => {
      const indexA =
        a.cardOrder ?? sortingArr.indexOf(_normalizePagePath(a.link));
      const indexB =
        b.cardOrder ?? sortingArr.indexOf(_normalizePagePath(b.link));
      return (
        (indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA) -
        (indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB)
      );
    });
}

function _extractComponentStatus(app) {
  const indexPage = app.pages.find(
    (page) => page.path === '/components/status/',
  );
  indexPage.data.componentsStatus = app.pages
    .filter(
      (page) =>
        page.path.startsWith('/components/') && page.path.endsWith('.html'),
    )
    .map((page) => {
      const frontmatter = page.frontmatter;
      const componentStatus = (property) => {
        if (!property) return 'N/A';
        switch (property) {
          case 'wip':
            return 'In progress';
          case 'planned':
            return 'Planned';
          default:
            return 'Ready';
        }
      };
      return {
        url: page.path,
        name: frontmatter.title,
        figma: componentStatus(frontmatter.figma || frontmatter.figma_url),
        vue: componentStatus(frontmatter.storybook),
        css: componentStatus(frontmatter.status),
      };
    })
    .sort((a, b) => _sortAlphabetically(a.name, b.name));
}

// Frontmatter fields copied onto matching sidebar nav items. `overwrite` fields
// always win; the rest only fill a gap site-nav.json left empty.
const INJECTED_NAV_FIELDS = [
  { key: 'keywords', overwrite: true, isValid: Array.isArray },
  { key: 'status' },
  { key: 'description' },
];

// Distinct from _normalizePagePath above: strips both suffixes so a nav link and a
// page path collapse to the same lookup key.
const _navLookupKey = (path) => path.replace(/\/$/, '').replace(/\.html$/, '');

function _injectFrontmatterIntoSidebar(app, options) {
  // field -> (page path -> value), keyed by both normalized and raw path for faster lookup.
  const lookups = new Map(INJECTED_NAV_FIELDS.map(({ key }) => [key, new Map()]));

  app.pages.forEach((page) => {
    INJECTED_NAV_FIELDS.forEach(({ key, isValid }) => {
      const value = page.frontmatter?.[key];
      if (!value || (isValid && !isValid(value))) return;

      const byPath = lookups.get(key);
      byPath.set(_navLookupKey(page.path), value);
      byPath.set(page.path, value);
    });
  });

  const injectData = (items) => {
    if (!Array.isArray(items)) return;

    items.forEach((item) => {
      if (item.link) {
        const normalizedLink = _navLookupKey(item.link);

        INJECTED_NAV_FIELDS.forEach(({ key, overwrite }) => {
          if (!overwrite && item[key]) return;

          const byPath = lookups.get(key);
          const value = byPath.get(normalizedLink) || byPath.get(item.link);
          if (value) item[key] = value;
        });
      }

      if (Array.isArray(item.children)) injectData(item.children);
    });
  };

  if (options.sidebar?.nav) {
    injectData(options.sidebar.nav);
  }
}

/**
 * Children of the nav item whose link matches `path` (e.g. '/components/').
 * Returns [] when no nav item matches.
 */
function getChildrenPageNames(path, sidebar) {
  return findNavItemByLink(sidebar?.nav, path)?.children || [];
}

export const dialtoneVuepressTheme = (options) => ({
  name: '@dialpad/vuepress-theme-dialtone',
  clientConfigFile: path.resolve(__dirname, 'client.js'),
  plugins: [
    themeDataPlugin({
      themeData: options,
    }),
    prismjsPlugin({
      lineNumbers: 'disable',
    }),
    backToTopPlugin(),
    gitPlugin({
      // options
    }),
    sitemapPlugin({
      hostname: 'https://dialtone.dialpad.com',
      changefreq: 'weekly',
      modifyTimeGetter: (page) =>
        page.git?.updatedTime
          ? new Date(page.git.updatedTime).toISOString()
          : new Date().toISOString(),
      excludePaths: ['/404.html'],
    }),
  ],

  extendsMarkdown: (md) => {
    // Transform ```vue demo fenced blocks into <code-example> HTML
    md.use(fencedDemoPlugin);

    md.use(markdownItClass, mapping);

    // Transform > [!kind] blockquote alerts into <dt-notice> components
    md.use(noticePlugin);

    // Auto-extract slot source from <code-example> blocks for the Vue code tab
    md.use(codeExampleSourcePlugin);
  },

  onInitialized(app) {
    _blogPostsFrontmatter(app);
    _injectOverviewPages(app, options);
    _extractFrontmatter(app, '/guides/', options, [
      '/guides/content/action-language/',
      '/guides/content/error-messages/',
      '/guides/content/grammar-and-mechanics/',
      '/guides/content/help-content/',
      '/guides/content/inclusive-language/',
      '/guides/content/voice-and-tone/',
    ]);
    _extractFrontmatter(app, '/guides/content/', options, [
      '/guides/content/voice-and-tone/',
    ]);
    _extractFrontmatter(app, '/components/', options, ['/components/status/']);
    _extractFrontmatter(
      app,
      '/foundations/',
      options,
      FOUNDATIONS_OVERVIEW_EXCLUDES,
    );
    _extractFrontmatter(app, '/foundations/colors/', options);
    _extractComponentStatus(app);
    _injectFrontmatterIntoSidebar(app, options);
  },

  extendsPage: (page) => {
    page.data.filePathRelative = page.filePathRelative;

    switch (page.path) {
      case '/':
        page.data.blogPosts = [];
        break;
      case '/dialtone/':
        page.data.overviewPages = [];
        break;
      case '/dialtone/whats-new/':
        page.data.blogPosts = [];
        break;
      case '/components/':
      case '/guides/':
      case '/foundations/':
        page.data.enhancedFrontmatter = [];
        break;
      case '/components/status/':
        page.data.componentsStatus = [];
        break;
    }
    page.data.headers = page.headers;
  },
});

export default dialtoneVuepressTheme;
