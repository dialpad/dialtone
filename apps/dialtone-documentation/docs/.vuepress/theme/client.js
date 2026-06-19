
import { defineClientConfig } from 'vuepress/client';
import Layout from './layouts/Layout.vue';
import NotFound from './layouts/NotFound.vue';
import Blank from './layouts/Blank.vue';
import customEmojis from '@data/custom-emoji';
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import { onBeforeMount, provide, ref, onMounted } from 'vue';
import { flushPromises } from '@workspaceRoot/common/utils/client.mjs';
import { syncBrowserThemeColor } from './utils/browserThemeColor.js';

// Layered Theming System - Base layers (always loaded). Material override CSS
// loads here so all materials are available for attribute-driven switching;
// brand CSS (dp by default) loads after, so brand wins at the same specificity.
//
// Sandstone has no override file — it's the default ramp baked into
// `tokens-base-colors.css` and applies whenever `data-dt-material` is absent
// or set to `'sandstone'` (no `[data-dt-material="sandstone"]` selector exists
// to match against, so the bare base selectors govern).
import '@dialpad/dialtone-tokens/layered/tokens-core.css';
import '@dialpad/dialtone-tokens/layered/tokens-base-colors.css';
import '@dialpad/dialtone-tokens/layered/material/tokens-steel.css';
import '@dialpad/dialtone-tokens/layered/material/tokens-graphite.css';
import '@dialpad/dialtone-tokens/layered/material/tokens-iron.css';
import '@dialpad/dialtone-tokens/layered/material/tokens-amethyst.css';
import '@dialpad/dialtone-tokens/layered/material/tokens-jade.css';
import '@dialpad/dialtone-tokens/layered/tokens-dp-colors.css';

import { VALID_MATERIALS } from '@dialpad/dialtone-tokens/themes/config';

// Normalize stale localStorage values from removed/renamed entries (e.g.
// bronze → sandstone). preferredTheme has its own force-reset in onBeforeMount.
const VALID_PREFS = {
  preferredMode: { valid: ['system', 'light', 'dark'], fallback: 'system' },
  preferredContrast: { valid: ['default', 'high'], fallback: 'default' },
  preferredMaterial: { valid: [...VALID_MATERIALS], fallback: 'sandstone' },
};
if (typeof localStorage !== 'undefined') {
  for (const [key, { valid, fallback }] of Object.entries(VALID_PREFS)) {
    const stored = localStorage.getItem(key);
    if (stored !== null && !valid.includes(stored)) {
      localStorage.setItem(key, fallback);
    }
  }
}

// Pre-mount bootstrap: apply the persisted material via the data-dt-material
// attribute before Vue hydrates so the page paints with the user's saved choice.
// All material CSS is loaded above; the attribute selects which set wins.
if (typeof document !== 'undefined' && typeof localStorage !== 'undefined') {
  const saved = localStorage.getItem('preferredMaterial');
  if (saved) {
    document.documentElement.setAttribute('data-dt-material', saved);
  }
}

// Legacy CSS (still needed for components)
import '@dialpad/dialtone-css/lib/dist/dialtone.css';
import '@dialpad/dialtone-combinator/css';
import './assets/less/dialtone-docs.less';
import './assets/less/dialtone-syntax.less';

// Import DP theme synchronously so it's available immediately on page load
import '@dialpad/dialtone-tokens/themes/dp';
import { setMode } from '@dialpad/dialtone-tokens/themes/config';

// Apply default theme immediately to prevent FOUC (Flash of Unstyled Content)
if (typeof document !== 'undefined') {
  // Set default mode (light/dark) based on system preference or localStorage
  const preferredMode = typeof localStorage !== 'undefined'
    ? localStorage.getItem('preferredMode') || 'system'
    : 'system';

  let actualMode = preferredMode;
  if (preferredMode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    actualMode = prefersDark ? 'dark' : 'light';
  }

  // Apply mode immediately
  setMode(actualMode, document.documentElement);

  // Set data attributes immediately
  document.documentElement.setAttribute('data-dt-brand', 'dp');

  syncBrowserThemeColor();
}

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

    if (!__VUEPRESS_SSR__) {
      // View Transitions API integration
      let resolveViewTransition;

      router.beforeEach((to, from, next) => {
        // Resolve any pending transition before starting a new one
        resolveViewTransition?.();

        // Skip view transitions for same-page hash navigation (e.g. TOC clicks)
        if (document.startViewTransition && to.path !== from.path) {
          const domUpdatePromise = new Promise(resolve => {
            resolveViewTransition = resolve;
          });

          document.startViewTransition(async () => {
            await domUpdatePromise;
          });
        }
        next();
      });

      router.afterEach(async () => {
        await flushPromises();
        resolveViewTransition?.();
      });

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
    }
  },
  setup () {
    const currentMode = ref('system');
    const currentTheme = ref('dp');
    const currentContrast = ref('default');
    const currentMaterial = ref('sandstone');
    provide('currentMode', currentMode);
    provide('currentTheme', currentTheme);
    provide('currentContrast', currentContrast);
    provide('currentMaterial', currentMaterial);

    onBeforeMount(() => {
      // Keep localStorage in sync with the canonical theme (dp is the only brand).
      localStorage.setItem('preferredTheme', 'dp');

      currentMode.value = localStorage.getItem('preferredMode') || 'system';
      currentContrast.value = localStorage.getItem('preferredContrast') || 'default';
      currentMaterial.value = localStorage.getItem('preferredMaterial') || 'sandstone';
    });
    onMounted(() => {
      // Reveal the app now that Vue has hydrated and components are registered
      document.documentElement.setAttribute('data-app-ready', '');
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

  const dialtoneConstants = {};
  const dialtoneComponents = {};
  const dialtoneUtils = {};

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
  const icons = await import('@dialpad/dialtone-icons/vue');

  const dialtoneIcons = {};
  const dialtoneIllustrations = {};

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
      // Material overrides are not theme modules — material switching is
      // attribute-driven against pre-bundled CSS imported at the top of this file.
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

    const brandCount = Object.keys(themes).length - 1; // minus high-contrast
    console.info(`Successfully loaded ${brandCount} themes + high contrast`);

    app.provide('themes', themes);
  } catch (error) {
    console.error(`Couldn't import dialtone themes: ${error}`);
  }
}
