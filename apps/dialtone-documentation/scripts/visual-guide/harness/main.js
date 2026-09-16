import { createApp } from 'vue';
import * as dialtoneVue from '@dialpad/dialtone-vue';
// `/vue3` is the subpath that exists on BOTH branches (next also exports
// `/vue`, staging does not — the harness must resolve in a staging worktree).
import * as dialtoneIcons from '@dialpad/dialtone-icons/vue3';
import App from './App.vue';

/* global __DT_ROOT__ */
import '@dialpad/dialtone-css/lib/dist/dialtone.min.css';
// Token custom properties are NOT bundled in dialtone.min.css on either
// branch — the default-theme bundle carries them, keyed on data-dt-theme
// (staging) / data-dt-mode (next), so one static import serves both.
import '@dialpad/dialtone-css/lib/dist/dialtone-default-theme.min.css';
// Shared branch-neutral chrome (.vg-scene, .vg-heading, .vg-label, .vg-mono).
import './scene-chrome.css';

// --- Theming (cross-branch) -------------------------------------------------
// `next` themes via the layered API (initDialtoneTheme / setMode, data-dt-mode).
// `staging` uses the legacy API (setTheme, data-dt-theme). We set BOTH root
// attributes directly (each branch's CSS reads only the one it knows, ignoring
// the other) AND best-effort call whichever JS API the loaded build exposes —
// so the same harness renders correctly when copied into a staging worktree.
const mode = new URLSearchParams(window.location.search).get('mode') || 'light';
const root = document.documentElement;
root.setAttribute('data-dt-theme', mode);
root.setAttribute('data-dt-mode', mode);
root.setAttribute('data-dt-brand', 'dp');
root.setAttribute('data-dt-contrast', 'default');
root.setAttribute('data-dt-material', 'sandstone');

// On next, the default-theme bundle only carries partial dark coverage — the
// full mode palette is applied at runtime by initDialtoneTheme from
// @dialpad/dialtone-tokens/themes/*. Those subpaths don't exist on staging,
// and Vite 8 hard-fails the whole module transform when a literal dynamic
// import can't be resolved — so the built files are loaded through /@fs/ URLs
// with @vite-ignore: resolved only at runtime, and the staging worktree's 404
// lands in the catch (staging is fully covered by the static CSS above).
let themedViaJs = false;
try {
  const fsBase = `/@fs${__DT_ROOT__}/packages/dialtone-tokens/dist/themes`;
  const themeConfig = await import(/* @vite-ignore */ `${fsBase}/config.js`);
  const Dp = (await import(/* @vite-ignore */ `${fsBase}/dp.js`)).default;
  themeConfig.initDialtoneTheme?.(Dp, mode);
  themedViaJs = true;
} catch {
  // No theme JS in this build (staging) — fall through to static token CSS.
}

// Staging's default-theme bundle only carries partial dark overrides; the full
// per-mode palette ships as :root-keyed files in dialtone-tokens dist. Load
// them only when the JS path is unavailable so the (verified) next-side
// rendering stays untouched. Awaited so capture never races the stylesheet.
if (!themedViaJs) {
  await Promise.all(['base', 'dp'].map(kind => new Promise((done) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/@fs${__DT_ROOT__}/packages/dialtone-tokens/dist/css/tokens-${kind}-${mode}.css`;
    link.onload = link.onerror = done;
    document.head.appendChild(link);
  })));
}

// Paint the page in the mode's primary surface so shadows and overlay surfaces
// read against a realistic background.
document.documentElement.style.background = 'var(--dt-color-surface-primary)';
document.body.style.background = 'var(--dt-color-surface-primary)';

// --- Component registration -------------------------------------------------
// Scenes reference Dt components/icons by tag without importing them, so every
// Dt* name has to be available on the app instance (matches the thumbs harness).
const app = createApp(App);

Object.entries(dialtoneVue).forEach(([name, comp]) => {
  if (name.endsWith('Directive') && typeof comp?.install === 'function') {
    app.use(comp);
  } else if (name.startsWith('Dt') && typeof comp === 'object' && comp !== null) {
    app.component(name, comp);
  }
});

Object.entries(dialtoneIcons).forEach(([name, comp]) => {
  if (name.startsWith('DtIcon') || name.startsWith('DtIllustration')) {
    app.component(name, comp);
  }
});

app.mount('#vg-root');
