import { themeDataPlugin } from '@vuepress/plugin-theme-data';
import { activeHeaderLinksPlugin } from '@vuepress/plugin-active-header-links';
import { prismjsPlugin } from '@vuepress/plugin-prismjs';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';
import { gitPlugin } from '@vuepress/plugin-git';
import { sitemapPlugin } from 'vuepress-plugin-sitemap2';
import markdownItClass from '@toycode/markdown-it-class';
import fencedDemoPlugin from '../plugins/markdown-it-fenced-demo.js';
import codeExampleSourcePlugin from '../plugins/markdown-it-code-example-source.js';
import noticePlugin from '../plugins/markdown-it-notice.js';
import { getDirname, path } from 'vuepress/utils'

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
const _normalizeSidebarPath = (pagePath) => _normalizePagePath(pagePath)?.replace(/\/$/, '');

function _getChildrenFromSidebarItems (items, normalizedPath, useSectionItems = false) {
  if (!Array.isArray(items)) return null;

  const matchingItem = items.find(item => _normalizeSidebarPath(item.link) === normalizedPath);
  if (matchingItem) return matchingItem.children || (useSectionItems ? items : []);

  return useSectionItems ? items : null;
}

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

function _blogPostsFrontmatter (app) {
  const blogPosts = app.pages
    .filter(page => page.path.includes('/dialtone/whats-new/posts'))
    .map(post => {
      delete post.frontmatter.description;
      return {
        ...post.frontmatter,
        firstParagraph: post.contentRendered.split('\n').find(f => f.startsWith('<p>')),
      };
    });

  const blogIndex = app.pages.find(page => page.path === '/dialtone/whats-new/');
  blogIndex.data.blogPosts = blogPosts;

  const homePage = app.pages.find(page => page.path === '/');
  if (homePage) {
    homePage.data.blogPosts = blogPosts;
  }
}

function _injectOverviewPages (app) {
  const dialtoneIndexPage = app.pages.find(page => page.path === '/dialtone/');
  if (!dialtoneIndexPage) return;

  const pagePaths = [
    '/components/',
    '/utilities/',
    '/tokens/',
    '/guides/content/',
    '/functions-and-utilities/',
  ];

  dialtoneIndexPage.data.overviewPages = pagePaths.map(path => {
    const page = app.pages.find(p => p.path === path);
    if (!page) return null;

    const fileName = page.frontmatter.title.toLowerCase().replaceAll(' ', '-');

    // For /components/, hardcode thumb since we can't modify its frontmatter
    // (it uses <overview> for its own children)
    const thumb = path === '/components/' ? true : page.frontmatter.thumb;

    return {
      title: page.frontmatter.title,
      shortTitle: page.frontmatter.shortTitle,
      description: page.frontmatter.description,
      thumb: thumb,
      fileName: fileName,
      link: path,
    };
  }).filter(Boolean);
}

function _extractFrontmatter (app, path, options, exceptions = []) {
  const children = getChildrenPageNames(path, options.sidebar);

  // Defensive check: if getChildrenPageNames returns null/undefined, log warning and use empty array
  if (!children) {
    console.warn(`[extractFrontmatter] No children found for path: ${path}. Navigation data may be missing.`);
    return;
  }

  // Filter out the parent page itself (e.g., "Overview" which links to the index page)
  const childPages = children.filter(child => child.link !== path);
  const sortingArr = childPages.map(child => _normalizePagePath(child.link));
  const indexPage = app.pages.find(page => page.path === path);

  if (!indexPage) {
    console.warn(`[extractFrontmatter] No index page found for path: ${path}`);
    return;
  }

  const regExpPath = new RegExp(`^${path}[^/]+(\\.html|/)$`);

  indexPage.data.enhancedFrontmatter = app.pages
    .filter(page => regExpPath.test(page.path))
    .filter(page => page.frontmatter?.title || page.frontmatter?.shortTitle)
    .filter(page => !exceptions.includes(page.path))
    .map(page => {
      const fileName = (page.frontmatter.shortTitle || page.frontmatter.title).toLowerCase().replaceAll(' ', '-');
      return {
        fileName,
        link: page.path,
        name: page.frontmatter.shortTitle || fileName,
        ...page.frontmatter,
      };
    })
    .sort((a, b) => {
      const indexA = a.cardOrder ?? sortingArr.indexOf(_normalizePagePath(a.link));
      const indexB = b.cardOrder ?? sortingArr.indexOf(_normalizePagePath(b.link));
      return (indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA) -
        (indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB);
    });
}

function _extractComponentStatus (app) {
  const indexPage = app.pages.find(page => page.path === '/components/status/');
  indexPage.data.componentsStatus = app.pages
    .filter(page => page.path.startsWith('/components/') && page.path.endsWith('.html'))
    .map(page => {
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

function _injectFrontmatterIntoSidebar (app, options) {
  // Create maps of page paths to frontmatter data for faster lookup
  const pageKeywords = new Map();
  const pageStatus = new Map();
  const pageDescription = new Map();
  app.pages.forEach(page => {
    const normalizedPath = page.path.replace(/\/$/, '').replace(/\.html$/, '');

    if (page.frontmatter?.keywords && Array.isArray(page.frontmatter.keywords)) {
      pageKeywords.set(normalizedPath, page.frontmatter.keywords);
      pageKeywords.set(page.path, page.frontmatter.keywords);
    }

    if (page.frontmatter?.status) {
      pageStatus.set(normalizedPath, page.frontmatter.status);
      pageStatus.set(page.path, page.frontmatter.status);
    }

    if (page.frontmatter?.description) {
      pageDescription.set(normalizedPath, page.frontmatter.description);
      pageDescription.set(page.path, page.frontmatter.description);
    }
  });

  // Recursive function to inject frontmatter data into sidebar items
  const injectData = (items) => {
    if (!items || !Array.isArray(items)) return;

    items.forEach(item => {
      if (item.link) {
        const normalizedLink = item.link.replace(/\/$/, '').replace(/\.html$/, '');

        const keywords = pageKeywords.get(normalizedLink) || pageKeywords.get(item.link);
        if (keywords) {
          item.keywords = keywords;
        }

        // Only inject status from frontmatter if not already set in site-nav.json
        if (!item.status) {
          const status = pageStatus.get(normalizedLink) || pageStatus.get(item.link);
          if (status) {
            item.status = status;
          }
        }

        if (!item.description) {
          const description = pageDescription.get(normalizedLink) || pageDescription.get(item.link);
          if (description) {
            item.description = description;
          }
        }
      }

      // Recursively process children
      if (item.children && Array.isArray(item.children)) {
        injectData(item.children);
      }
    });
  };

  // Process all sidebar sections
  if (options.sidebar?.topLevelGroups) {
    Object.values(options.sidebar.topLevelGroups).forEach(group => {
      if (group.sections) {
        Object.values(group.sections).forEach(section => {
          injectData(section);
        });
      }
    });
  }
}

function getChildrenPageNames (path, pages) {
  const normalizedPath = _normalizeSidebarPath(path);

  // Handle new topLevelGroups structure
  if (pages?.topLevelGroups) {
    // Search all top-level groups and merge their sections
    const allSections = {};
    Object.values(pages.topLevelGroups).forEach(group => {
      if (group.sections) {
        Object.assign(allSections, group.sections);
      }
    });
    pages = allSections;
  }

  // If pages is not an object (e.g., undefined or null), return empty array
  if (!pages || typeof pages !== 'object') {
    return [];
  }

  if (Array.isArray(pages)) {
    return _getChildrenFromSidebarItems(pages, normalizedPath) || [];
  }

  const [, parent] = path.split('/');
  const sectionKey = `/${parent}/`;
  const directSectionChildren = _getChildrenFromSidebarItems(
    pages[sectionKey],
    normalizedPath,
    _normalizeSidebarPath(sectionKey) === normalizedPath,
  );
  if (directSectionChildren) return directSectionChildren;

  for (const sectionItems of Object.values(pages)) {
    const children = _getChildrenFromSidebarItems(sectionItems, normalizedPath);
    if (children) return children;
  }

  return [];
}

export const dialtoneVuepressTheme = (options) => ({
    name: '@dialpad/vuepress-theme-dialtone',
    clientConfigFile: path.resolve(__dirname, 'client.js'),
    plugins: [
      themeDataPlugin({
        themeData: options,
      }),
      activeHeaderLinksPlugin({
        headerLinkSelector: 'a.d-link',
        offset: 128,
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

    onInitialized (app) {
      _blogPostsFrontmatter(app);
      _injectOverviewPages(app);
      _extractFrontmatter(
        app,
        '/guides/',
        options,
        [
          '/guides/content/action-language/',
          '/guides/content/error-messages/',
          '/guides/content/grammar-and-mechanics/',
          '/guides/content/help-content/',
          '/guides/content/inclusive-language/',
          '/guides/content/voice-and-tone/',
        ]);
      _extractFrontmatter(app, '/guides/content/', options, ['/guides/content/voice-and-tone/']);
      _extractFrontmatter(app, '/components/', options, ['/components/status/']);
      _extractFrontmatter(app, '/foundations/', options, FOUNDATIONS_OVERVIEW_EXCLUDES);
      _extractFrontmatter(app, '/foundations/colors/', options);
      _extractComponentStatus(app);
      _injectFrontmatterIntoSidebar(app, options);
    },

    extendsPage: (page) => {
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
