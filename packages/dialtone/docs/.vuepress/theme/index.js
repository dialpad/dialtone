import { getDirname, path } from '@vuepress/utils';
import { themeDataPlugin } from '@vuepress/plugin-theme-data';
import { tocPlugin } from '@vuepress/plugin-toc';
import { activeHeaderLinksPlugin } from '@vuepress/plugin-active-header-links';
import { prismjsPlugin } from '@vuepress/plugin-prismjs';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';
import { gitPlugin } from '@vuepress/plugin-git';
import { docsearchPlugin } from '@vuepress/plugin-docsearch';
import { sitemapPlugin } from 'vuepress-plugin-sitemap2';
import markdownItClass from '@toycode/markdown-it-class';

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
  const sortingArr = options?.sidebar[path][0].children.map(child => child.text.toLowerCase().replaceAll(' ', '-'));
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
        link: page.frontmatter.shortTitle || fileName,
        ...page.frontmatter,
      };
    })
    .sort((a, b) => sortingArr.indexOf(a.link) - sortingArr.indexOf(b.link));
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

export const dialtoneVuepressTheme = (options) => {
  return {
    name: '@dialpad/vuepress-theme-dialtone',
    clientConfigFile: path.resolve(__dirname, 'client.js'),
    plugins: [
      themeDataPlugin({
        themeData: options,
      }),
      tocPlugin(),
      activeHeaderLinksPlugin({
        headerLinkSelector: 'a.d-btn',
        offset: 128,
      }),
      prismjsPlugin({}),
      backToTopPlugin(),
      gitPlugin({
        // options
      }),
      docsearchPlugin({
        indexName: 'dialpad',
        apiKey: '6436ebddb959748daeec411eb388a99d',
        container: '#algolia-search-container',
        appId: 'Y5HG9UX6KM',
        placeholder: 'Search Dialtone',
      }),
      sitemapPlugin({
        hostname: 'https://dialpad.design',
      }),
    ],
    extendsMarkdown: (md) => {
      md.use(markdownItClass, mapping);
    },
    onInitialized (app) {
      _blogPostsFrontmatter(app);
      _extractFrontmatter(app, '/guides/', options);
      _extractFrontmatter(app, '/components/', options, ['/components/status/']);
      _extractFrontmatter(app, '/design/', options);
      _extractComponentStatus(app);
    },
    // eslint-disable-next-line complexity
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
    },
  };
};

export default dialtoneVuepressTheme;
