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
  const blogIndex = app.pages.find(page => page.path === '/about/whats-new/');
  blogIndex.data.blogPosts = app.pages
    .filter(page => page.path.includes('/about/whats-new/posts'))
    .map(post => {
      delete post.frontmatter.description;
      return {
        ...post.frontmatter,
        firstParagraph: post.contentRendered.split('\n').find(f => f.startsWith('<p>')),
      };
    });
}

function _extractFrontmatter (app, path, options, exceptions = []) {
  const sortingArr = getChildrenPageNames(path, options.sidebar).map(child => child.text.toLowerCase().replaceAll(' ', '-'));
  const indexPage = app.pages.find(page => page.path === path);
  const regExpPath = new RegExp(`${path}.+`);

  indexPage.data.enhancedFrontmatter = app.pages
    .filter(page => regExpPath.test(page.path))
    .filter(page => page.frontmatter?.title || page.frontmatter?.shortTitle)
    .filter(page => !exceptions.includes(page.path))
    .map(page => {
      const fileName = page.frontmatter.title.toLowerCase().replaceAll(' ', '-');
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
    // Extract sections from dialtone group (where all current content lives)
    pages = pages.topLevelGroups['dialtone']?.sections || {};
  }

  const [, parent, child] = path.split('/');
  const page = Object.keys(pages).find(pageKey => {
    return pageKey === `/${parent}/` || pages[pageKey]?.link?.endsWith(`${path}/`);
  });
  const children = pages?.[page]?.[0]?.children || pages?.[page]?.children;

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
      _extractFrontmatter(app, '/design/', options, ['/design/colors/usage/', '/design/colors/palette/', '/design/colors/themes/', '/design/colors/chart-colors/']);
      _extractFrontmatter(app, '/design/colors/', options);
      _extractComponentStatus(app);
    },

    extendsPage: (page) => {
      switch (page.path) {
        case '/about/whats-new/':
          page.data.blogPosts = [];
          break;
        case '/components/':
        case '/guides/':
        case '/design/':
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
