import { createApp } from 'vue';
import App from './App.vue';
import * as dialtoneVue from '@dialpad/dialtone-vue';
import * as dialtoneIcons from '@dialpad/dialtone-icons/vue';

import '@dialpad/dialtone-css';
import './assets/transitions.less';

import '@dialpad/dialtone-tokens/layered/tokens-core.css';
import '@dialpad/dialtone-tokens/layered/tokens-base-colors.css';
import '@dialpad/dialtone-tokens/layered/tokens-dp-colors.css';
import '@dialpad/dialtone-tokens/themes/dp';
import { setMode } from '@dialpad/dialtone-tokens/themes/config';

import 'overlayscrollbars/overlayscrollbars.css';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setMode(prefersDark ? 'dark' : 'light');

const app = createApp(App);

// Register all Dt* components globally
Object.entries(dialtoneVue).forEach(([name, component]) => {
  if (name.startsWith('Dt') && typeof component === 'object' && component.name) {
    app.component(name, component);
  } else if (name.endsWith('Directive')) {
    app.use(component);
  }
});

// Register all DtIcon* components globally
Object.entries(dialtoneIcons).forEach(([name, component]) => {
  if (name.startsWith('DtIcon')) {
    app.component(name, component);
  }
});

app.mount('#app');
