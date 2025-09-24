import { createApp } from 'vue';
import App from './App.vue';

import '@dialpad/dialtone-css';
import './assets/transitions.less';

import { setTheme } from '@dialpad/dialtone-tokens/themes/config';
import DpLight from '@dialpad/dialtone-tokens/themes/dp-light';

import 'overlayscrollbars/overlayscrollbars.css';
import { DtScrollbarDirective, DtTooltipDirective } from '@dialpad/dialtone-vue';

setTheme(DpLight);

createApp(App)
  .use(DtScrollbarDirective)
  .use(DtTooltipDirective)
  .mount('#app');
