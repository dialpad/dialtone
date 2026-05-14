import { createApp, h, defineComponent } from 'vue';
import * as dialtoneVue from '@dialpad/dialtone-vue';
import * as dialtoneIcons from '@dialpad/dialtone-icons/vue';
import { COMPONENT_DEFAULTS } from './component-defaults.js';

// Full Dialtone CSS bundle — includes utility classes, component styles,
// normalize, body baseline (typography, surface, color), everything. Explicit
// path to avoid ambiguity with the package's exports map.
import '@dialpad/dialtone-css/lib/dist/dialtone.min.css';

// Layered tokens — provides the var(--dt-*) values that dialtone-css references.
import '@dialpad/dialtone-tokens/layered/tokens-core.css';
import '@dialpad/dialtone-tokens/layered/tokens-base-colors.css';
import '@dialpad/dialtone-tokens/layered/tokens-dp-colors.css';

import { setMode } from '@dialpad/dialtone-tokens/themes/config';

const params = new URLSearchParams(window.location.search);
const componentName = params.get('thumb') || 'DtButton';
const mode = params.get('mode') || 'dark';

setMode(mode);

// dialtone-css's body{} rule applies `background-color: var(--dt-color-surface-primary)`
// — override here so the captured PNG has a transparent alpha channel and can sit on
// any wall card / material surface.
document.documentElement.style.background = 'transparent';
document.body.style.background = 'transparent';

const ComponentClass = dialtoneVue[componentName];
if (!ComponentClass) {
  document.getElementById('thumb-root').textContent = `Unknown: ${componentName}`;
} else {
  const ThumbRoot = defineComponent({
    name: 'ThumbRoot',
    render () {
      const cfg = COMPONENT_DEFAULTS[componentName] ?? { props: {}, slot: 'Label' };
      if (typeof cfg.renderFn === 'function') {
        return cfg.renderFn(h, ComponentClass, dialtoneVue);
      }
      const slot = cfg.slot != null ? { default: () => cfg.slot } : {};
      return h(ComponentClass, cfg.props ?? {}, slot);
    },
  });

  // Router-link stub — prevents "Unknown component: RouterLink" warnings for
  // components (DtButton with :to, DtLink) that use router-link internally.
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
    if (name.startsWith('Dt') && typeof comp === 'object' && comp?.name) {
      app.component(name, comp);
    } else if (name.endsWith('Directive') && comp?.install) {
      app.use(comp);
    }
  });

  Object.entries(dialtoneIcons).forEach(([name, comp]) => {
    if (name.startsWith('DtIcon')) app.component(name, comp);
  });

  app.mount('#thumb-root');
}
