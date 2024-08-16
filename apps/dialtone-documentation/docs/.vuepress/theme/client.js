import { defineClientConfig } from '@vuepress/client';
import Layout from './layouts/Layout.vue';
import NotFound from './layouts/NotFound.vue';
import customEmojis from '@data/custom-emoji.json';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import { onBeforeMount, provide, ref } from 'vue';
import { flushPromises } from '@workspaceRoot/common/utils';

// CSS
import '@dialpad/dialtone-css/lib/dist/dialtone.css';
import '@dialpad/dialtone/vue3/css';
import './assets/less/dialtone-docs.less';
import './assets/less/dialtone-syntax.less';

// The default scrollbar exists outside of the vue instance on the body so
// we cannot use the vue directive for our custom scrollbar. Init it manually here.
const initOverlayScrollbars = () => {
  return new Promise((resolve) => {
    const body = document.body;
    document.documentElement.setAttribute('data-overlayscrollbars-initialize', '');
    body.setAttribute('data-overlayscrollbars-initialize', '');
    body.classList.add('scrollbar');

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
      // await registerDialtoneCombinator(app);
    }
    router.options.scrollBehavior = async (to, from, savedPosition) => {
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
      const preferredTheme = localStorage.getItem('preferredTheme') || 'system';
      const currentTheme = ref(preferredTheme);
      provide('currentTheme', currentTheme);
    });
  },
  layouts: {
    Layout,
    NotFound,
  },
});

async function registerDialtoneVue (app) {
  const module = await import('@dialpad/dialtone-vue');
  const dialtoneConstants = [];
  const dialtoneComponents = [];

  Object.keys(module).forEach(key => {
    if (/^[A-Z_]+$/.test(key)) {
      dialtoneConstants[key] = module[key];
    } else if (key.endsWith('Directive')) {
      app.use(module[key]);
    } else {
      dialtoneComponents[key] = module[key];
      app.component(key, module[key]);
    }
  });

  app.provide('dialtoneComponents', dialtoneComponents);

  window.DIALTONE_CONSTANTS = dialtoneConstants;

  // setup custom emojis
  const { setCustomEmojiUrl, setCustomEmojiJson } = dialtoneComponents;
  setCustomEmojiUrl('https://github.githubassets.com/images/icons/emoji/');
  setCustomEmojiJson(customEmojis);
}

// This is commented because we are currently not using the combinator and it's
// adding some wrong styles to the page for the dt-list-item component.

// async function registerDialtoneCombinator (app) {
//   const module = await import('@dialpad/dialtone-combinator');
//   app.component('DtcCombinator', module.DtcCombinator);
//   app.component('DtcSection', module.DtcSection);
//   app.provide('variantBank', module.variantBank());
// }
