import { createApp } from 'vue';
import App from './App.vue';

import '@dialpad/dialtone-css';
import '@dialpad/dialtone-vue/css';
import './assets/transitions.less';

import { setTheme } from '@dialpad/dialtone-tokens/themes/config';
import DpLight from '@dialpad/dialtone-tokens/themes/dp-light';

setTheme(DpLight);

createApp(App).mount('#app');
