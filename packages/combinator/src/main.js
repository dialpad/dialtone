import { createApp } from 'vue';
import App from './App.vue';

import '@dialpad/dialtone-css/lib/dist/dialtone.css';
import '@dialpad/dialtone-vue/css';

import { setTheme } from '@dialpad/dialtone-tokens/themes/config';
import DpLight from '@dialpad/dialtone-tokens/themes/dp-light.js';

setTheme(DpLight);

createApp(App).mount('#app');
