// STABLE HARNESS

import { createApp, h, defineComponent } from 'vue';
import * as dialtoneVue from '@dialpad/dialtone-vue';
import * as dialtoneIcons from '@dialpad/dialtone-icons/vue';
import { getDefaultConfig } from './component-defaults.js';
import { exportNameToSlug } from '../name-map.mjs';

// Discover hand-authored thumbnail overrides under apps/dialtone-documentation/thumbs/.
// Used for components whose default render isn't viable as a thumbnail (skeleton has
// no inherent size, root-layout needs full viewport, etc.). One .vue file per slug.
const overrideComponents = import.meta.glob('../../../thumbs/*.vue', {
  eager: true,
  import: 'default',
});

function getOverride (exportName) {
  return overrideComponents[`../../../thumbs/${exportNameToSlug(exportName)}.vue`] ?? null;
}

// Explicit path to avoid ambiguity with the package's exports map.
import '@dialpad/dialtone-css/lib/dist/dialtone.min.css';

// Layered tokens — provides the var(--dt-*) values that dialtone-css references.
import '@dialpad/dialtone-tokens/layered/tokens-core.css';
import '@dialpad/dialtone-tokens/layered/tokens-base-colors.css';
import '@dialpad/dialtone-tokens/layered/tokens-dp-colors.css';

import { setMode } from '@dialpad/dialtone-tokens/themes/config';

const params = new URLSearchParams(window.location.search);
const requestedThumb = params.get('thumb');
const mode = params.get('mode') || 'dark';

setMode(mode);

// dialtone-css's body{} rule applies `background-color: var(--dt-color-surface-primary)`
// — override here so the captured PNG has a transparent alpha channel and can sit on
// any wall card / material surface.
document.documentElement.style.background = 'transparent';
document.body.style.background = 'transparent';

// No ?thumb= param → render a component picker (preview-only, never captured).
if (!requestedThumb) {
  renderPicker();
} else {
  mountComponent(requestedThumb);
}

function renderPicker () {
  document.body.classList.add('picker-mode');
  // Match the global-registration filter in mountComponent() so components like
  // DtResizable* (which lack .name because they're <script setup> without
  // defineOptions) also appear in the picker list.
  const names = Object.keys(dialtoneVue)
    .filter(n => n.startsWith('Dt') && typeof dialtoneVue[n] === 'object' && dialtoneVue[n] !== null)
    .sort();

  const otherMode = mode === 'dark' ? 'light' : 'dark';
  const rows = names.map(name => {
    const slug = exportNameToSlug(name);
    const hasOverride = !!overrideComponents[`../../../thumbs/${slug}.vue`];
    return `
      <li>
        <a href="?thumb=${name}&mode=${mode}">${name}</a>
        <span class="picker__meta">
          · <a href="?thumb=${name}&mode=${otherMode}">${otherMode}</a>
          ${hasOverride ? ` · <em class="picker__badge">override</em>` : ''}
        </span>
      </li>`;
  }).join('');

  document.getElementById('thumb-root').innerHTML = `
    <div class="picker">
      <h1>Thumb Preview Harness</h1>
      <p>
        Pick a component to preview at 400×225. Currently showing in <strong>${mode}</strong>.
        Toggle via the per-row link.
      </p>
      <p>
        Override the rendering by adding <code>apps/dialtone-documentation/thumbs/&lt;slug&gt;.vue</code> —
        edits hot-reload.
      </p>
      <div class="d-h-600 d-of-auto">
        <ul class="picker__list">${rows}</ul>
      </div>
    </div>`;
}

function mountComponent (componentName) {
  const ComponentClass = dialtoneVue[componentName];
  if (!ComponentClass) {
    document.getElementById('thumb-root').textContent = `Unknown: ${componentName}`;
    return;
  }


  // defines ThumbRoot + RouterLinkStub together; splitting into separate files
  // would add unnecessary indirection for a dev-only single-purpose app.
  const ThumbRoot = defineComponent({
    name: 'ThumbRoot',
    render () {
      const Override = getOverride(componentName);
      if (Override) return h(Override);

      const cfg = getDefaultConfig(componentName);
      if (typeof cfg.renderFn === 'function') {
        return cfg.renderFn(h, ComponentClass, dialtoneVue);
      }
      return h(ComponentClass, cfg.props ?? {}, cfg.slots ?? {});
    },
  });

  // Router-link stub — prevents "Unknown component: RouterLink" warnings for
  // components (DtButton with :to, DtLink) that use router-link internally.
  // eslint-disable-next-line vue/one-component-per-file
  const RouterLinkStub = defineComponent({
    name: 'RouterLink',
    props: {
      to: { type: [String, Object], default: '#' },
    },

    render () {
      const href = typeof this.to === 'string' ? this.to : '#';
      return h('a', { href }, this.$slots.default?.());
    },
  });

  const app = createApp(ThumbRoot);
  app.component('RouterLink', RouterLinkStub);

  Object.entries(dialtoneVue).forEach(([name, comp]) => {
    // Directives first — they're also exported with a `Dt` prefix
    // (DtModeDirective, DtTooltipDirective, etc.) so the order matters:
    // checking `name.endsWith('Directive')` before the component branch
    // ensures `app.use(plugin)` runs instead of registering them as components.
    if (name.endsWith('Directive') && typeof comp?.install === 'function') {
      app.use(comp);
    } else if (name.startsWith('Dt') && typeof comp === 'object' && comp !== null) {
      // Note: Resizable components use `<script setup>` without `defineOptions({ name })`,
      // so `comp.name` is undefined. The Dt prefix is sufficient to isolate components.
      app.component(name, comp);
    }
  });

  Object.entries(dialtoneIcons).forEach(([name, comp]) => {
    if (name.startsWith('DtIcon') || name.startsWith('DtIllustration')) {
      app.component(name, comp);
    }
  });

  app.mount('#thumb-root');
}
