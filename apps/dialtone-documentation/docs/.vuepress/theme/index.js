import { themeDataPlugin } from '@vuepress/plugin-theme-data';
import { activeHeaderLinksPlugin } from '@vuepress/plugin-active-header-links';
import { prismjsPlugin } from '@vuepress/plugin-prismjs';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';
import { gitPlugin } from '@vuepress/plugin-git';
import { sitemapPlugin } from 'vuepress-plugin-sitemap2';
import markdownItClass from '@toycode/markdown-it-class';
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

function _blogPostsFrontmatter (app) {
  const blogIndex = app.pages.find(page => page.path === '/dialtone/whats-new/');
  blogIndex.data.blogPosts = app.pages
    .filter(page => page.path.includes('/dialtone/whats-new/posts'))
    .map(post => {
      delete post.frontmatter.description;
      return {
        ...post.frontmatter,
        firstParagraph: post.contentRendered.split('\n').find(f => f.startsWith('<p>')),
      };
    });
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
  const sortingArr = childPages.map(child => child.text.toLowerCase().replaceAll(' ', '-'));
  const indexPage = app.pages.find(page => page.path === path);

  if (!indexPage) {
    console.warn(`[extractFrontmatter] No index page found for path: ${path}`);
    return;
  }

  const regExpPath = new RegExp(`^${path}[^/]+(\.html|/)$`);

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
    .sort((a, b) => sortingArr.indexOf(a.name) - sortingArr.indexOf(b.name));
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

function getChildrenPageNames (path, pages) {
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

  // If pages is already an array (from recursive call), search within it
  if (Array.isArray(pages)) {
    const item = pages.find(item => {
      const itemPath = item.link?.replace(/\/$/, '');
      const searchPath = `/${path}`.replace(/\/$/, '');
      return itemPath === searchPath;
    });
    return item?.children || [];
  }

  const [, parent, child] = path.split('/');
  const page = Object.keys(pages).find(pageKey => {
    return pageKey === `/${parent}/` || pages[pageKey]?.link?.endsWith(`${path}/`);
  });

  // Handle both nested structure (first item has children) and flat structure (array IS the children)
  let children;
  if (pages?.[page]) {
    const pageItems = pages[page];
    // Check if first item has children property (nested structure)
    if (pageItems[0]?.children) {
      children = pageItems[0].children;
    } else if (Array.isArray(pageItems)) {
      // Flat structure - the array itself contains the items
      children = pageItems;
    }
  }

  if (!child) return children || [];

  return getChildrenPageNames(child, children);
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
      }),
    ],

  extendsMarkdown: (md) => {
      md.use(markdownItClass, mapping);
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
      _extractFrontmatter(app, '/guides/content/', options);
      _extractFrontmatter(app, '/components/', options, ['/components/status/']);
      _extractFrontmatter(app, '/foundations/', options, ['/foundations/typography/', '/foundations/typography.html', '/foundations/colors/usage/', '/foundations/colors/palette/', '/foundations/colors/themes/', '/foundations/colors/chart-colors/', '/foundations/icons/usage/', '/foundations/icons/crafting-an-icon/', '/foundations/brand/using-our-logo/', '/foundations/brand/our-icon/', '/foundations/brand/sub-brands-and-co-branding/', '/foundations/brand/samples/']);
      _extractFrontmatter(app, '/foundations/colors/', options);
      _extractComponentStatus(app);
    },

    extendsPage: (page) => {
      switch (page.path) {
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
