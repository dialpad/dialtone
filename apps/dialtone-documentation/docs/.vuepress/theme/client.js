import { defineClientConfig } from 'vuepress/client';
import Layout from './layouts/Layout.vue';
import NotFound from './layouts/NotFound.vue';
import customEmojis from '@data/custom-emoji';
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import { onBeforeMount, provide, ref, onMounted } from 'vue';
import { flushPromises } from '@workspaceRoot/common/utils/client.mjs';

// CSS
import '@docsearch/css';
import '@dialpad/dialtone-css/lib/dist/dialtone.css';
import '@dialpad/dialtone-combinator/css';
import './assets/less/dialtone-docs.less';
import './assets/less/dialtone-syntax.less';

// The default scrollbar exists outside of the vue instance on the body so
// we cannot use the vue directive for our custom scrollbar. Init it manually here.
const initOverlayScrollbars = () => {
  return new Promise((resolve) => {
    const body = document.body;
    document.documentElement.setAttribute('data-overlayscrollbars-initialize', '');
    body.setAttribute('data-overlayscrollbars-initialize', '');
    body.classList.add('d-scrollbar');

    OverlayScrollbars.plugin(ClickScrollPlugin);
    OverlayScrollbars(body, {
      scrollbars: {
        clickScroll: true,
      },
    }, {
      initialized: (instance) => {
        resolve(instance);
      },
    });
  });
};

export default defineClientConfig({
  async enhance ({ app, router }) {
    // Register libraries
    if (!__VUEPRESS_SSR__) {
      await initOverlayScrollbars();
      await registerDialtoneVue(app);
      await registerDialtoneCombinator(app);
      await registerDialtoneIcons(app);
      await importDocumentation(app);
      await importDialtoneThemes(app);
    }
    router.options.scrollBehavior = async (to) => {
      if (to.hash) {
        const html = document.querySelector('html');
        // vue-router does not incorporate scroll-padding-top on its own.
        if (html) {
          const top = parseFloat(getComputedStyle(html).scrollPaddingTop);
          await flushPromises();
          return {
            el: to.hash,
            behavior: 'smooth',
            top,
          };
        }
      }
      return { top: 0 };
    };
  },
  setup () {
    onBeforeMount(() => {
      // Set the theme to 'dp' by default
      localStorage.setItem('preferredTheme', 'dp');

      const preferredMode = localStorage.getItem('preferredMode') || 'system';
      const preferredTheme = localStorage.getItem('preferredTheme');
      const preferredContrast = localStorage.getItem('preferredContrast') || 'default';

      const currentMode = ref(preferredMode);
      const currentTheme = ref(preferredTheme);
      const currentContrast = ref(preferredContrast);

      provide('currentMode', currentMode);
      provide('currentTheme', currentTheme);
      provide('currentContrast', currentContrast);
    });
    onMounted(async () => {
      const docsearch = (await import('@docsearch/js'))?.default;

      docsearch({
          apiKey: '6436ebddb959748daeec411eb388a99d',
          indexName: 'dialpad',
          appId: 'Y5HG9UX6KM',
          placeholder: 'Search Dialtone',
          container: '#docsearch',
      });
    });
  },
  layouts: {
    Layout,
    NotFound,
  },
});

async function registerDialtoneVue (app) {
  const module = await import('@dialpad/dialtone-vue');
  const documentation = await import('@dialpad/dialtone-vue/component-documentation.json');

  const dialtoneConstants = [];
  const dialtoneComponents = [];
  const dialtoneUtils = [];

  Object.keys(module).forEach(key => {
    if (/^[A-Z_]+$/.test(key)) {
      dialtoneConstants[key] = module[key];
    } else if (key.endsWith('Directive')) {
      app.use(module[key]);
    } else if (key.startsWith('Dt')) {
      dialtoneComponents[key] = module[key];
      app.component(key, module[key]);
    } else {
      dialtoneUtils[key] = module[key];
    }
  });

  app.provide('dialtoneUtils', dialtoneUtils);
  app.provide('dialtoneComponents', dialtoneComponents);
  app.provide('dialtoneComponentsDocumentation', documentation.default);

  window.DIALTONE_CONSTANTS = dialtoneConstants;

  // setup custom emojis
  const { setCustomEmojiUrl, setCustomEmojiJson } = dialtoneUtils;
  setCustomEmojiUrl('https://github.githubassets.com/images/icons/emoji/');
  setCustomEmojiJson(customEmojis);
}

async function registerDialtoneCombinator (app) {
 const { DtcCombinator } = await import('@dialpad/dialtone-combinator');
 app.component('DtcCombinator', DtcCombinator);
}

async function registerDialtoneIcons (app) {
  const icons = await import('@dialpad/dialtone-icons/vue3');

  const dialtoneIcons = [];
  const dialtoneIllustrations = [];

  Object.keys(icons).forEach(key => {
    if (key.startsWith('DtIcon')) {
      dialtoneIcons[key] = icons[key];
    } else if (key.startsWith('DtIllustration')) {
      dialtoneIllustrations[key] = icons[key];
    }
  });

  app.provide('dialtoneIcons', dialtoneIcons);
  app.provide('dialtoneIllustrations', dialtoneIllustrations);
}

async function importDocumentation (app) {
  try {
    console.info('Importing Utility Class documentation');
    const utilityClassDocsModule = (await import('../../../node_modules/@dialpad/dialtone-css/lib/dist/dialtone-docs.json'))?.default;

    console.info('Importing Tokens documentation');
    const tokensDocsModule = (await import('../../../node_modules/@dialpad/dialtone-css/lib/dist/tokens-docs.json'))?.default;

    app.provide('utilityClassDocs', utilityClassDocsModule);
    app.provide('tokensDocs', tokensDocsModule);
  } catch (error) {
    console.error(`Couldn't import dialtone documentation: ${error}`);
  }
}

async function importDialtoneThemes (app) {
  try {
    // Import all available themes
    const dialtoneThemeFiles = {
      // Core themes
      '@dialpad/dialtone-tokens/themes/dp-light.js': (await import('@dialpad/dialtone-tokens/themes/dp-light')),
      '@dialpad/dialtone-tokens/themes/dp-dark.js': (await import('@dialpad/dialtone-tokens/themes/dp-dark')),
      '@dialpad/dialtone-tokens/themes/tmo-light.js': (await import('@dialpad/dialtone-tokens/themes/tmo-light')),
      '@dialpad/dialtone-tokens/themes/tmo-dark.js': (await import('@dialpad/dialtone-tokens/themes/tmo-dark')),

      // Color themes
      '@dialpad/dialtone-tokens/themes/aegean-light.js': (await import('@dialpad/dialtone-tokens/themes/aegean-light')),
      '@dialpad/dialtone-tokens/themes/aegean-dark.js': (await import('@dialpad/dialtone-tokens/themes/aegean-dark')),
      '@dialpad/dialtone-tokens/themes/botany-light.js': (await import('@dialpad/dialtone-tokens/themes/botany-light')),
      '@dialpad/dialtone-tokens/themes/botany-dark.js': (await import('@dialpad/dialtone-tokens/themes/botany-dark')),
      '@dialpad/dialtone-tokens/themes/buttercream-light.js': (await import('@dialpad/dialtone-tokens/themes/buttercream-light')),
      '@dialpad/dialtone-tokens/themes/buttercream-dark.js': (await import('@dialpad/dialtone-tokens/themes/buttercream-dark')),
      '@dialpad/dialtone-tokens/themes/ceruleo-light.js': (await import('@dialpad/dialtone-tokens/themes/ceruleo-light')),
      '@dialpad/dialtone-tokens/themes/ceruleo-dark.js': (await import('@dialpad/dialtone-tokens/themes/ceruleo-dark')),
      '@dialpad/dialtone-tokens/themes/high-desert-light.js': (await import('@dialpad/dialtone-tokens/themes/high-desert-light')),
      '@dialpad/dialtone-tokens/themes/high-desert-dark.js': (await import('@dialpad/dialtone-tokens/themes/high-desert-dark')),
      '@dialpad/dialtone-tokens/themes/melon-light.js': (await import('@dialpad/dialtone-tokens/themes/melon-light')),
      '@dialpad/dialtone-tokens/themes/melon-dark.js': (await import('@dialpad/dialtone-tokens/themes/melon-dark')),
      '@dialpad/dialtone-tokens/themes/plum-light.js': (await import('@dialpad/dialtone-tokens/themes/plum-light')),
      '@dialpad/dialtone-tokens/themes/plum-dark.js': (await import('@dialpad/dialtone-tokens/themes/plum-dark')),
      '@dialpad/dialtone-tokens/themes/sunflower-light.js': (await import('@dialpad/dialtone-tokens/themes/sunflower-light')),
      '@dialpad/dialtone-tokens/themes/sunflower-dark.js': (await import('@dialpad/dialtone-tokens/themes/sunflower-dark')),
      '@dialpad/dialtone-tokens/themes/verdant-haze-light.js': (await import('@dialpad/dialtone-tokens/themes/verdant-haze-light')),
      '@dialpad/dialtone-tokens/themes/verdant-haze-dark.js': (await import('@dialpad/dialtone-tokens/themes/verdant-haze-dark')),

      // Additional special themes
      '@dialpad/dialtone-tokens/themes/prota-deuter-light.js': (await import('@dialpad/dialtone-tokens/themes/prota-deuter-light')),
      '@dialpad/dialtone-tokens/themes/prota-deuter-dark.js': (await import('@dialpad/dialtone-tokens/themes/prota-deuter-dark')),
      '@dialpad/dialtone-tokens/themes/trita-light.js': (await import('@dialpad/dialtone-tokens/themes/trita-light')),
      '@dialpad/dialtone-tokens/themes/trita-dark.js': (await import('@dialpad/dialtone-tokens/themes/trita-dark')),

      // All numbered themes (101-137)
      // '@dialpad/dialtone-tokens/themes/101-light.js': (await import('@dialpad/dialtone-tokens/themes/101-light')),
      // '@dialpad/dialtone-tokens/themes/101-dark.js': (await import('@dialpad/dialtone-tokens/themes/101-dark')),
      // '@dialpad/dialtone-tokens/themes/102-light.js': (await import('@dialpad/dialtone-tokens/themes/102-light')),
      // '@dialpad/dialtone-tokens/themes/102-dark.js': (await import('@dialpad/dialtone-tokens/themes/102-dark')),
      // '@dialpad/dialtone-tokens/themes/103-light.js': (await import('@dialpad/dialtone-tokens/themes/103-light')),
      // '@dialpad/dialtone-tokens/themes/103-dark.js': (await import('@dialpad/dialtone-tokens/themes/103-dark')),
      // '@dialpad/dialtone-tokens/themes/104-light.js': (await import('@dialpad/dialtone-tokens/themes/104-light')),
      // '@dialpad/dialtone-tokens/themes/104-dark.js': (await import('@dialpad/dialtone-tokens/themes/104-dark')),
      // '@dialpad/dialtone-tokens/themes/105-light.js': (await import('@dialpad/dialtone-tokens/themes/105-light')),
      // '@dialpad/dialtone-tokens/themes/105-dark.js': (await import('@dialpad/dialtone-tokens/themes/105-dark')),
      // '@dialpad/dialtone-tokens/themes/106-light.js': (await import('@dialpad/dialtone-tokens/themes/106-light')),
      // '@dialpad/dialtone-tokens/themes/106-dark.js': (await import('@dialpad/dialtone-tokens/themes/106-dark')),
      // '@dialpad/dialtone-tokens/themes/107-light.js': (await import('@dialpad/dialtone-tokens/themes/107-light')),
      // '@dialpad/dialtone-tokens/themes/107-dark.js': (await import('@dialpad/dialtone-tokens/themes/107-dark')),
      // '@dialpad/dialtone-tokens/themes/108-light.js': (await import('@dialpad/dialtone-tokens/themes/108-light')),
      // '@dialpad/dialtone-tokens/themes/108-dark.js': (await import('@dialpad/dialtone-tokens/themes/108-dark')),
      // '@dialpad/dialtone-tokens/themes/109-light.js': (await import('@dialpad/dialtone-tokens/themes/109-light')),
      // '@dialpad/dialtone-tokens/themes/109-dark.js': (await import('@dialpad/dialtone-tokens/themes/109-dark')),
      // '@dialpad/dialtone-tokens/themes/110-light.js': (await import('@dialpad/dialtone-tokens/themes/110-light')),
      // '@dialpad/dialtone-tokens/themes/110-dark.js': (await import('@dialpad/dialtone-tokens/themes/110-dark')),
      // '@dialpad/dialtone-tokens/themes/111-light.js': (await import('@dialpad/dialtone-tokens/themes/111-light')),
      // '@dialpad/dialtone-tokens/themes/111-dark.js': (await import('@dialpad/dialtone-tokens/themes/111-dark')),
      // '@dialpad/dialtone-tokens/themes/112-light.js': (await import('@dialpad/dialtone-tokens/themes/112-light')),
      // '@dialpad/dialtone-tokens/themes/112-dark.js': (await import('@dialpad/dialtone-tokens/themes/112-dark')),
      // '@dialpad/dialtone-tokens/themes/113-light.js': (await import('@dialpad/dialtone-tokens/themes/113-light')),
      // '@dialpad/dialtone-tokens/themes/113-dark.js': (await import('@dialpad/dialtone-tokens/themes/113-dark')),
      // '@dialpad/dialtone-tokens/themes/114-light.js': (await import('@dialpad/dialtone-tokens/themes/114-light')),
      // '@dialpad/dialtone-tokens/themes/114-dark.js': (await import('@dialpad/dialtone-tokens/themes/114-dark')),
      // '@dialpad/dialtone-tokens/themes/115-light.js': (await import('@dialpad/dialtone-tokens/themes/115-light')),
      // '@dialpad/dialtone-tokens/themes/115-dark.js': (await import('@dialpad/dialtone-tokens/themes/115-dark')),
      // '@dialpad/dialtone-tokens/themes/116-light.js': (await import('@dialpad/dialtone-tokens/themes/116-light')),
      // '@dialpad/dialtone-tokens/themes/116-dark.js': (await import('@dialpad/dialtone-tokens/themes/116-dark')),
      // '@dialpad/dialtone-tokens/themes/117-light.js': (await import('@dialpad/dialtone-tokens/themes/117-light')),
      // '@dialpad/dialtone-tokens/themes/117-dark.js': (await import('@dialpad/dialtone-tokens/themes/117-dark')),
      // '@dialpad/dialtone-tokens/themes/118-light.js': (await import('@dialpad/dialtone-tokens/themes/118-light')),
      // '@dialpad/dialtone-tokens/themes/118-dark.js': (await import('@dialpad/dialtone-tokens/themes/118-dark')),
      // '@dialpad/dialtone-tokens/themes/119-light.js': (await import('@dialpad/dialtone-tokens/themes/119-light')),
      // '@dialpad/dialtone-tokens/themes/119-dark.js': (await import('@dialpad/dialtone-tokens/themes/119-dark')),
      // '@dialpad/dialtone-tokens/themes/120-light.js': (await import('@dialpad/dialtone-tokens/themes/120-light')),
      // '@dialpad/dialtone-tokens/themes/120-dark.js': (await import('@dialpad/dialtone-tokens/themes/120-dark')),
      // '@dialpad/dialtone-tokens/themes/121-light.js': (await import('@dialpad/dialtone-tokens/themes/121-light')),
      // '@dialpad/dialtone-tokens/themes/121-dark.js': (await import('@dialpad/dialtone-tokens/themes/121-dark')),
      // '@dialpad/dialtone-tokens/themes/122-light.js': (await import('@dialpad/dialtone-tokens/themes/122-light')),
      // '@dialpad/dialtone-tokens/themes/122-dark.js': (await import('@dialpad/dialtone-tokens/themes/122-dark')),
      // '@dialpad/dialtone-tokens/themes/123-light.js': (await import('@dialpad/dialtone-tokens/themes/123-light')),
      // '@dialpad/dialtone-tokens/themes/123-dark.js': (await import('@dialpad/dialtone-tokens/themes/123-dark')),
      // '@dialpad/dialtone-tokens/themes/124-light.js': (await import('@dialpad/dialtone-tokens/themes/124-light')),
      // '@dialpad/dialtone-tokens/themes/124-dark.js': (await import('@dialpad/dialtone-tokens/themes/124-dark')),
      // '@dialpad/dialtone-tokens/themes/125-light.js': (await import('@dialpad/dialtone-tokens/themes/125-light')),
      // '@dialpad/dialtone-tokens/themes/125-dark.js': (await import('@dialpad/dialtone-tokens/themes/125-dark')),
      // '@dialpad/dialtone-tokens/themes/126-light.js': (await import('@dialpad/dialtone-tokens/themes/126-light')),
      // '@dialpad/dialtone-tokens/themes/126-dark.js': (await import('@dialpad/dialtone-tokens/themes/126-dark')),
      // '@dialpad/dialtone-tokens/themes/127-light.js': (await import('@dialpad/dialtone-tokens/themes/127-light')),
      // '@dialpad/dialtone-tokens/themes/127-dark.js': (await import('@dialpad/dialtone-tokens/themes/127-dark')),
      // '@dialpad/dialtone-tokens/themes/128-light.js': (await import('@dialpad/dialtone-tokens/themes/128-light')),
      // '@dialpad/dialtone-tokens/themes/128-dark.js': (await import('@dialpad/dialtone-tokens/themes/128-dark')),
      // '@dialpad/dialtone-tokens/themes/129-light.js': (await import('@dialpad/dialtone-tokens/themes/129-light')),
      // '@dialpad/dialtone-tokens/themes/129-dark.js': (await import('@dialpad/dialtone-tokens/themes/129-dark')),
      // '@dialpad/dialtone-tokens/themes/130-light.js': (await import('@dialpad/dialtone-tokens/themes/130-light')),
      // '@dialpad/dialtone-tokens/themes/130-dark.js': (await import('@dialpad/dialtone-tokens/themes/130-dark')),
      // '@dialpad/dialtone-tokens/themes/131-light.js': (await import('@dialpad/dialtone-tokens/themes/131-light')),
      // '@dialpad/dialtone-tokens/themes/131-dark.js': (await import('@dialpad/dialtone-tokens/themes/131-dark')),
      // '@dialpad/dialtone-tokens/themes/132-light.js': (await import('@dialpad/dialtone-tokens/themes/132-light')),
      // '@dialpad/dialtone-tokens/themes/132-dark.js': (await import('@dialpad/dialtone-tokens/themes/132-dark')),
      // '@dialpad/dialtone-tokens/themes/133-light.js': (await import('@dialpad/dialtone-tokens/themes/133-light')),
      // '@dialpad/dialtone-tokens/themes/133-dark.js': (await import('@dialpad/dialtone-tokens/themes/133-dark')),
      // '@dialpad/dialtone-tokens/themes/134-light.js': (await import('@dialpad/dialtone-tokens/themes/134-light')),
      // '@dialpad/dialtone-tokens/themes/134-dark.js': (await import('@dialpad/dialtone-tokens/themes/134-dark')),
      // '@dialpad/dialtone-tokens/themes/135-light.js': (await import('@dialpad/dialtone-tokens/themes/135-light')),
      // '@dialpad/dialtone-tokens/themes/135-dark.js': (await import('@dialpad/dialtone-tokens/themes/135-dark')),
      // '@dialpad/dialtone-tokens/themes/136-light.js': (await import('@dialpad/dialtone-tokens/themes/136-light')),
      // '@dialpad/dialtone-tokens/themes/136-dark.js': (await import('@dialpad/dialtone-tokens/themes/136-dark')),
      '@dialpad/dialtone-tokens/themes/137-light.js': (await import('@dialpad/dialtone-tokens/themes/137-light')),
      '@dialpad/dialtone-tokens/themes/137-dark.js': (await import('@dialpad/dialtone-tokens/themes/137-dark')),

      // High contrast themes
      '@dialpad/dialtone-tokens/themes/high-contrast-light.js': (await import('@dialpad/dialtone-tokens/themes/high-contrast-light')),
      '@dialpad/dialtone-tokens/themes/high-contrast-dark.js': (await import('@dialpad/dialtone-tokens/themes/high-contrast-dark')),
  };
    const themes = {};

    for (const path in dialtoneThemeFiles) {
      const themeName = path.split('/').pop().split('.').shift();

      themes[themeName] = dialtoneThemeFiles[path].default;
    }
    app.provide('themes', themes)
  } catch(error) {
    console.error(`Couldn't import dialtone themes: ${error}`);
  }
}
