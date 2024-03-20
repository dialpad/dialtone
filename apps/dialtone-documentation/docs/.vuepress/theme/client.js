import { defineClientConfig } from '@vuepress/client';
import Layout from './layouts/Layout.vue';
import NotFound from './layouts/NotFound.vue';

// CSS
import '@dialpad/dialtone-css/lib/dist/dialtone.css';
import './assets/less/dialtone-docs.less';
import './assets/less/dialtone-syntax.less';
import { onBeforeMount, provide, ref } from 'vue';

export default defineClientConfig({
  async enhance ({ app, router }) {
    // Register libraries
    if (!__VUEPRESS_SSR__) {
      await registerDialtoneVue(app);
      await registerDialtoneCombinator(app);
    }
    router.options.scrollBehavior = (to, from, savedPosition) => {
      if (to.hash) {
        const html = document.querySelector('html');
        // vue-router does not incorporate scroll-padding-top on its own.
        if (html) {
          const top = parseFloat(getComputedStyle(html).scrollPaddingTop);
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
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      const preferredTheme = localStorage.getItem('preferredTheme') || 'system';

      const currentTheme = ref(preferredTheme);

      if (currentTheme.value !== 'system') {
        document.body.className = `dialtone-theme-${currentTheme.value}`;
      } else {
        document.body.className = systemPrefersDark.matches ? 'dialtone-theme-dark' : 'dialtone-theme-light';
      }

      provide('currentTheme', currentTheme);
      provide('systemPrefersDark', systemPrefersDark);
    });
  },
  layouts: {
    Layout,
    NotFound,
  },
});

async function registerDialtoneVue (app) {
  const module = await import('@dialpad/dialtone-vue');
  const dialtoneComponents = Object.keys(module).filter((key) => (key.startsWith('Dt') && !key.endsWith('Directive')));
  const dialtoneDirectives = Object.keys(module).filter((key) => (key.startsWith('Dt') && key.endsWith('Directive')));
  const dialtoneConstants = Object
    .keys(module)
    .filter((key) => /^[A-Z_]+$/.test(key))
    .reduce((res, key) => {
      res[key] = module[key];
      return res;
    }, {});

  dialtoneComponents.forEach(key => {
    app.component(key, module[key]);
  });

  dialtoneDirectives.forEach(directive => {
    app.use(directive);
  });

  app.provide('dialtoneComponents', dialtoneComponents);

  window.DIALTONE_CONSTANTS = dialtoneConstants;
}

async function registerDialtoneCombinator (app) {
  const module = await import('@dialpad/dialtone-combinator');
  app.component('DtcCombinator', module.DtcCombinator);
  app.component('DtcSection', module.DtcSection);
  app.provide('variantBank', module.variantBank());
}
