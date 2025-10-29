import { defineClientConfig } from 'vuepress/client';
import Layout from './layouts/Layout.vue';
import NotFound from './layouts/NotFound.vue';
import Blank from './layouts/Blank.vue';
import customEmojis from '@data/custom-emoji';
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import { onBeforeMount, provide, ref, onMounted } from 'vue';
import { flushPromises } from '@workspaceRoot/common/utils/client.mjs';

// CSS
import '@docsearch/css';

// Layered Theming System - Base layers (always loaded)
import '@dialpad/dialtone-tokens/layered/tokens-core.css';
import '@dialpad/dialtone-tokens/layered/tokens-base-colors.css';
import '@dialpad/dialtone-tokens/layered/tokens-dp-colors.css';

// Legacy CSS (still needed for components)
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
    Blank,
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
    console.info('Importing layered theme system - ALL 51 THEMES!');

    // Import all themes explicitly (Vite doesn't like dynamic imports)
    const themeModules = await Promise.all([
      // Base theme
      import('@dialpad/dialtone-tokens/themes/dp'),
      // Partner themes
      import('@dialpad/dialtone-tokens/themes/tmo'),
      // Color assistive themes
      import('@dialpad/dialtone-tokens/themes/prota-deuter'),
      import('@dialpad/dialtone-tokens/themes/trita'),
      // Named themes
      import('@dialpad/dialtone-tokens/themes/aegean'),
      import('@dialpad/dialtone-tokens/themes/botany'),
      import('@dialpad/dialtone-tokens/themes/buttercream'),
      import('@dialpad/dialtone-tokens/themes/ceruleo'),
      import('@dialpad/dialtone-tokens/themes/high-desert'),
      import('@dialpad/dialtone-tokens/themes/melon'),
      import('@dialpad/dialtone-tokens/themes/plum'),
      import('@dialpad/dialtone-tokens/themes/sunflower'),
      import('@dialpad/dialtone-tokens/themes/verdant-haze'),
      // Numbered themes (not yet named)
      import('@dialpad/dialtone-tokens/themes/101'),
      import('@dialpad/dialtone-tokens/themes/102'),
      import('@dialpad/dialtone-tokens/themes/103'),
      import('@dialpad/dialtone-tokens/themes/104'),
      import('@dialpad/dialtone-tokens/themes/105'),
      import('@dialpad/dialtone-tokens/themes/106'),
      import('@dialpad/dialtone-tokens/themes/107'),
      import('@dialpad/dialtone-tokens/themes/108'),
      import('@dialpad/dialtone-tokens/themes/109'),
      import('@dialpad/dialtone-tokens/themes/110'),
      import('@dialpad/dialtone-tokens/themes/111'),
      import('@dialpad/dialtone-tokens/themes/112'),
      import('@dialpad/dialtone-tokens/themes/113'),
      import('@dialpad/dialtone-tokens/themes/114'),
      import('@dialpad/dialtone-tokens/themes/115'),
      import('@dialpad/dialtone-tokens/themes/116'),
      import('@dialpad/dialtone-tokens/themes/117'),
      import('@dialpad/dialtone-tokens/themes/118'),
      import('@dialpad/dialtone-tokens/themes/119'),
      import('@dialpad/dialtone-tokens/themes/120'),
      import('@dialpad/dialtone-tokens/themes/121'),
      import('@dialpad/dialtone-tokens/themes/122'),
      import('@dialpad/dialtone-tokens/themes/123'),
      import('@dialpad/dialtone-tokens/themes/124'),
      import('@dialpad/dialtone-tokens/themes/125'),
      import('@dialpad/dialtone-tokens/themes/126'),
      import('@dialpad/dialtone-tokens/themes/127'),
      import('@dialpad/dialtone-tokens/themes/128'),
      import('@dialpad/dialtone-tokens/themes/129'),
      import('@dialpad/dialtone-tokens/themes/130'),
      import('@dialpad/dialtone-tokens/themes/131'),
      import('@dialpad/dialtone-tokens/themes/132'),
      import('@dialpad/dialtone-tokens/themes/133'),
      import('@dialpad/dialtone-tokens/themes/134'),
      import('@dialpad/dialtone-tokens/themes/135'),
      import('@dialpad/dialtone-tokens/themes/136'),
      import('@dialpad/dialtone-tokens/themes/137'),
      // High contrast
      import('@dialpad/dialtone-tokens/themes/high-contrast'),
    ]);

    // Build themes object with same order as in Navbar
    const themes = {
      'dp': themeModules[0].default,
      'tmo': themeModules[1].default,
      'prota-deuter': themeModules[2].default,
      'trita': themeModules[3].default,
      'aegean': themeModules[4].default,
      'botany': themeModules[5].default,
      'buttercream': themeModules[6].default,
      'ceruleo': themeModules[7].default,
      'high-desert': themeModules[8].default,
      'melon': themeModules[9].default,
      'plum': themeModules[10].default,
      'sunflower': themeModules[11].default,
      'verdant-haze': themeModules[12].default,
      '101': themeModules[13].default,
      '102': themeModules[14].default,
      '103': themeModules[15].default,
      '104': themeModules[16].default,
      '105': themeModules[17].default,
      '106': themeModules[18].default,
      '107': themeModules[19].default,
      '108': themeModules[20].default,
      '109': themeModules[21].default,
      '110': themeModules[22].default,
      '111': themeModules[23].default,
      '112': themeModules[24].default,
      '113': themeModules[25].default,
      '114': themeModules[26].default,
      '115': themeModules[27].default,
      '116': themeModules[28].default,
      '117': themeModules[29].default,
      '118': themeModules[30].default,
      '119': themeModules[31].default,
      '120': themeModules[32].default,
      '121': themeModules[33].default,
      '122': themeModules[34].default,
      '123': themeModules[35].default,
      '124': themeModules[36].default,
      '125': themeModules[37].default,
      '126': themeModules[38].default,
      '127': themeModules[39].default,
      '128': themeModules[40].default,
      '129': themeModules[41].default,
      '130': themeModules[42].default,
      '131': themeModules[43].default,
      '132': themeModules[44].default,
      '133': themeModules[45].default,
      '134': themeModules[46].default,
      '135': themeModules[47].default,
      '136': themeModules[48].default,
      '137': themeModules[49].default,
      'high-contrast': themeModules[50].default,
    };

    console.log(`Successfully loaded ${Object.keys(themes).length - 1} themes + high contrast`);

    app.provide('themes', themes);
    app.provide('layeredTokensEnabled', true);
  } catch (error) {
    console.error(`Couldn't import dialtone themes: ${error}`);
  }
}

// OLD LEGACY CODE REMOVED
