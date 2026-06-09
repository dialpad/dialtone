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
    // Register Dialtone components and icons for both SSR and client so the
    // layout shell (DtRootLayout, DtStack, DtButton, etc.) renders server-side.
    await registerDialtoneVue(app);
    await registerDialtoneIcons(app);

    await importDocumentation(app);
    await importDialtoneThemes(app);

    if (!__VUEPRESS_SSR__) {
      await initOverlayScrollbars();
      await registerDialtoneCombinator(app);
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
    const currentMode = ref('system');
    const currentTheme = ref('dp');
    provide('currentMode', currentMode);
    provide('currentTheme', currentTheme);

    onBeforeMount(() => {
      // Keep localStorage in sync with the canonical theme (dp is the only brand).
      localStorage.setItem('preferredTheme', 'dp');
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
      if (!__VUEPRESS_SSR__) {
        // Full installation client-side (may touch document at install time).
        app.use(module[key]);
      } else {
        // During SSR, register a no-op stub under the directive's name so
        // resolveDirective() never returns undefined. Without this,
        // ssrGetDirectiveProps(ctx, undefined) throws when the directive is
        // applied to a native HTML element in a docs page.
        // Derive the kebab-case name: DtScrollbarDirective → dt-scrollbar.
        const stubName = 'dt-' + key
          .replace(/^Dt/, '')
          .replace(/Directive$/, '')
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase();
        app.directive(stubName, {});
      }
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
  // Provide constants via inject so page setup functions can access them in
  // both SSR and client contexts without referencing window.
  app.provide('dialtoneConstants', dialtoneConstants);

  if (!__VUEPRESS_SSR__) {
    const { setCustomEmojiUrl, setCustomEmojiJson } = dialtoneUtils;
    setCustomEmojiUrl('https://github.githubassets.com/images/icons/emoji/');
    setCustomEmojiJson(customEmojis);
  }
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
    const dialtoneThemeFiles = {
      '@dialpad/dialtone-tokens/themes/dp-light.js': (await import('@dialpad/dialtone-tokens/themes/dp-light')),
      '@dialpad/dialtone-tokens/themes/dp-dark.js': (await import('@dialpad/dialtone-tokens/themes/dp-dark')),
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
