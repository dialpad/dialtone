import { createApp, h, defineComponent } from 'vue';
import * as dialtoneVue from '@dialpad/dialtone-vue';
import * as dialtoneIcons from '@dialpad/dialtone-icons/vue';
import { getDefaultConfig } from './component-defaults.js';
import { exportNameToSlug, slugToExportName } from '../name-map.mjs';
import { isOnWall, frontmatterToSlug, wallSlugToComponentSlug } from '../wall.mjs';

// Mirror generate.mjs's wall-slug discovery. Vite glob with `?raw` because
// there's no Node fs in this browser-side bundle, and the slug comes from
// frontmatter (not the filename — see frontmatterToSlug).
const wallPageContents = import.meta.glob('../../../docs/components/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const wallSlugs = new Set(
  Object.entries(wallPageContents)
    .filter(([path]) => !path.endsWith('/index.md'))
    .map(([, content]) => frontmatterToSlug(content))
    .filter(Boolean),
);

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

// overlayscrollbars CSS — required by `v-dt-scrollbar` directive to render
// the scrollbar visuals. Without it the directive initializes silently and
// the scrollbar is invisible. Matches the Storybook preview's import.
import 'overlayscrollbars/overlayscrollbars.css';

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

// Routing — none of these are captured, all preview-only:
//   ?thumb=DtX&mode=…  → mount a single component
//   ?gallery           → grid of every wall PNG at current mode
//   (no params)        → picker list
if (params.has('gallery')) {
  renderGallery();
} else if (!requestedThumb) {
  renderPicker();
} else {
  mountComponent(requestedThumb);
}

function renderPicker () {
  document.body.classList.add('picker-mode');
  // Filter to components that actually appear on the wall — same rule as
  // generate.mjs's batch filter. Excludes mixins (DtCheckableInputMixin),
  // recipes (DtRecipe*), directives, and leaf parts of composite components.
  const names = Object.keys(dialtoneVue)
    .filter(n => n.startsWith('Dt') && typeof dialtoneVue[n] === 'object' && dialtoneVue[n] !== null)
    .filter(n => isOnWall(exportNameToSlug(n), wallSlugs))
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
      <p>
        <a href="?gallery&mode=${mode}">View all thumbs in one grid →</a>
      </p>
      <div class="d-h-600 d-of-auto">
        <ul class="picker__list">${rows}</ul>
      </div>
    </div>`;
}

// Grid of every captured wall PNG at the current mode. Reads from the
// publicDir-served `/assets/images/components/<slug>-<mode>.png` (so the
// images shown here are the same bytes the docs wall consumes).
function renderGallery () {
  document.body.classList.add('gallery-mode');
  const slugs = [...wallSlugs].sort();
  const otherMode = mode === 'dark' ? 'light' : 'dark';
  const cells = slugs.map(slug => {
    const exportName = slugToExportName(wallSlugToComponentSlug(slug));
    return `
      <a class="gallery__cell" href="?thumb=${exportName}&mode=${mode}">
        <img class="gallery__img" src="/assets/images/components/${slug}-${mode}.png" alt="${slug}" loading="lazy">
        <span class="gallery__caption">${slug}</span>
      </a>
    `;
  }).join('');

  document.getElementById('thumb-root').innerHTML = `
    <div class="gallery">
      <h1>Thumb Gallery (${mode}, ${slugs.length} components)</h1>
      <p>
        Showing the captured PNG for each wall component.
        <a href="?gallery&mode=${otherMode}">switch to ${otherMode}</a>
        · <a href="?mode=${mode}">back to picker</a>
      </p>
      <div class="gallery__grid">${cells}</div>
    </div>`;
}

function mountComponent (componentName) {
  const ComponentClass = dialtoneVue[componentName];
  const Override = getOverride(componentName);

  // Some wall slugs (e.g. `table`, `scrollbar`) have no corresponding Dt*
  // Vue component — they document CSS primitives or directives. An override
  // file is the only way to render those, so we only bail when BOTH the
  // override and the component class are missing.
  if (!ComponentClass && !Override) {
    document.getElementById('thumb-root').textContent = `Unknown: ${componentName}`;
    return;
  }

  const ThumbRoot = defineComponent({
    name: 'ThumbRoot',
    render () {
      if (Override) return h(Override);
      const cfg = getDefaultConfig(componentName);
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

  // Directive check first — `Dt*Directive` exports must go through app.use,
  // not app.component, even though they also start with `Dt`.
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

  app.mount('#thumb-root');
}
