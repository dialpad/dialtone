
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

const DOCSEARCH_CONFIG = {
  apiKey: '6436ebddb959748daeec411eb388a99d',
  indexName: 'dialpad',
  appId: 'Y5HG9UX6KM',
  placeholder: 'Search',
  container: '#docsearch',
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

        // Re-initialize docsearch when layout switch recreates the #docsearch container
        const container = document.querySelector('#docsearch');
        if (container && !container.children.length) {
          const docsearchModule = await import('@docsearch/js');
          docsearchModule.default(DOCSEARCH_CONFIG);
        }
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
    onMounted(async () => {
      // Reveal the app now that Vue has hydrated and components are registered
      document.documentElement.setAttribute('data-app-ready', '');

      const docsearch = (await import('@docsearch/js'))?.default;
      docsearch(DOCSEARCH_CONFIG);
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
    // Kicked off before the await below so all 50 modules load concurrently.
    const highContrastImport = import('@dialpad/dialtone-tokens/themes/high-contrast');

    // Keep every import path literal so Vite can resolve the complete theme set.
    // Material overrides are not theme modules — material switching is
    // attribute-driven against pre-bundled CSS imported at the top of this file.
    const brandModules = await Promise.all([
      // Base theme
      import('@dialpad/dialtone-tokens/themes/dp'),
      // Partner themes
      import('@dialpad/dialtone-tokens/themes/tmo'),
      // Color assistive themes
      import('@dialpad/dialtone-tokens/themes/prota-deuter'),
      import('@dialpad/dialtone-tokens/themes/trita'),
      // Standard themes (alphabetical)
      import('@dialpad/dialtone-tokens/themes/aegean'),
      import('@dialpad/dialtone-tokens/themes/alpine'),
      import('@dialpad/dialtone-tokens/themes/arctic'),
      import('@dialpad/dialtone-tokens/themes/aurora'),
      import('@dialpad/dialtone-tokens/themes/autumn'),
      import('@dialpad/dialtone-tokens/themes/blue-hour'),
      import('@dialpad/dialtone-tokens/themes/botany'),
      import('@dialpad/dialtone-tokens/themes/brick'),
      import('@dialpad/dialtone-tokens/themes/buttercream'),
      import('@dialpad/dialtone-tokens/themes/cactus-bloom'),
      import('@dialpad/dialtone-tokens/themes/cayenne'),
      import('@dialpad/dialtone-tokens/themes/cedar-grove'),
      import('@dialpad/dialtone-tokens/themes/cobalt'),
      import('@dialpad/dialtone-tokens/themes/copper'),
      import('@dialpad/dialtone-tokens/themes/coral-reef'),
      import('@dialpad/dialtone-tokens/themes/dragonfruit'),
      import('@dialpad/dialtone-tokens/themes/eucalyptus'),
      import('@dialpad/dialtone-tokens/themes/fjord'),
      import('@dialpad/dialtone-tokens/themes/high-desert'),
      import('@dialpad/dialtone-tokens/themes/inkberry'),
      import('@dialpad/dialtone-tokens/themes/kiln'),
      import('@dialpad/dialtone-tokens/themes/lavender'),
      import('@dialpad/dialtone-tokens/themes/marigold'),
      import('@dialpad/dialtone-tokens/themes/melon'),
      import('@dialpad/dialtone-tokens/themes/mulberry'),
      import('@dialpad/dialtone-tokens/themes/mushroom'),
      import('@dialpad/dialtone-tokens/themes/nightshade'),
      import('@dialpad/dialtone-tokens/themes/paprika'),
      import('@dialpad/dialtone-tokens/themes/peach-blossom'),
      import('@dialpad/dialtone-tokens/themes/plum'),
      import('@dialpad/dialtone-tokens/themes/poppy-field'),
      import('@dialpad/dialtone-tokens/themes/raincloud'),
      import('@dialpad/dialtone-tokens/themes/rhubarb'),
      import('@dialpad/dialtone-tokens/themes/rust-harbor'),
      import('@dialpad/dialtone-tokens/themes/sea-glow'),
      import('@dialpad/dialtone-tokens/themes/seashell'),
      import('@dialpad/dialtone-tokens/themes/solstice'),
      import('@dialpad/dialtone-tokens/themes/storm'),
      import('@dialpad/dialtone-tokens/themes/sunflower'),
      import('@dialpad/dialtone-tokens/themes/tropical-night'),
      import('@dialpad/dialtone-tokens/themes/verdant-haze'),
      import('@dialpad/dialtone-tokens/themes/wildflower'),
      import('@dialpad/dialtone-tokens/themes/wineberry'),
      import('@dialpad/dialtone-tokens/themes/winter-gold'),
      import('@dialpad/dialtone-tokens/themes/woodland'),
    ]);
    const highContrast = (await highContrastImport).default;

    // Each brand module carries its own id at brand.name, so there is no
    // separate list of ids to keep in sync with the imports above.
    const themes = {
      ...Object.fromEntries(brandModules.map(({ default: theme }) => [theme.brand.name, theme])),
      'high-contrast': highContrast,
    };

    console.info(`Loaded ${brandModules.length} brand themes + high contrast`);

    app.provide('themes', themes);
  } catch (error) {
    console.error(`Couldn't import dialtone themes: ${error}`);
  }
}
