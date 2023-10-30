import { defineClientConfig } from '@vuepress/client';
import Layout from './layouts/Layout.vue';
import NotFound from './layouts/NotFound.vue';

// CSS
import '@projectRoot/lib/dist/css/dialtone.css';
import './assets/less/dialtone-docs.less';
import './assets/less/dialtone-syntax.less';
import { onBeforeMount, provide, ref } from 'vue';

export default defineClientConfig({
  async enhance ({ app, router }) {
    // Register libraries
    if (!__VUEPRESS_SSR__) {
      await registerDialtoneVue(app);
      await registerEmojiDialtoneVue(app);
      await registerDialtoneCombinator(app);
    }
    router.options.scrollBehavior = (to, from, savedPosition) => {
      return to.hash
        ? { el: to.hash, behavior: 'smooth', top: 64 }
        : { top: 0 };
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
  const dialtoneComponents = Object.keys(module).filter((key) => key.startsWith('Dt'));
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
  app.provide('dialtoneComponents', dialtoneComponents);
  window.DIALTONE_CONSTANTS = dialtoneConstants;
}

async function registerEmojiDialtoneVue (app) {
  const emojiModule = await import('@dialpad/dialtone-vue/emoji');
  const dialtoneEmojiComponents = Object.keys(emojiModule).filter((key) => key.startsWith('Dt'));
  dialtoneEmojiComponents.forEach((key) => {
    app.component(key, emojiModule[key]);
  });
  app.provide('dialtoneEmojiComponents', dialtoneEmojiComponents);
}

async function registerDialtoneCombinator (app) {
  const module = await import('@dialpad/dialtone-combinator');
  app.component('DtcCombinator', module.DtcCombinator);
  app.component('DtcSection', module.DtcSection);
  app.provide('variantBank', module.variantBank());
}
