import { defineClientConfig } from 'vuepress/client';
import { provide, shallowRef } from 'vue';

// Common views
import Icons from './views/Icons.vue';
import Overview from './views/Overview.vue';

// Base components
import CodeWellHeader from './baseComponents/CodeWellHeader.vue';
import UtilityClassTable from './baseComponents/UtilityClassTable.vue';
import NewUtilityClassTable from './baseComponents/NewUtilityClassTable.vue';
import ComponentClassTable from './baseComponents/ComponentClassTable.vue';
import TokenTable from './baseComponents/tokens/TokenTable.vue';
import ComponentVueApi from './baseComponents/ComponentVueApi.vue';
import ComponentAccessibleTable from './baseComponents/ComponentAccessibleTable.vue';
import ComponentCombinator from './baseComponents/ComponentCombinator.vue';
import CodeExampleTabs from './baseComponents/CodeExampleTabs.vue';
import SvgLoader from './baseComponents/SvgLoader.vue';
import DialtoneUsage from './baseComponents/DialtoneUsage.vue';
import FlexStackNotice from './baseComponents/FlexStackNotice.vue';

export default defineClientConfig({
  enhance ({ app }) {
    // Common views
    app.component('Icons', Icons);
    app.component('Overview', Overview);

    // Base components
    app.component('CodeWellHeader', CodeWellHeader);
    app.component('UtilityClassTable', UtilityClassTable);
    app.component('NewUtilityClassTable', NewUtilityClassTable);
    app.component('ComponentClassTable', ComponentClassTable);
    app.component('TokenTable', TokenTable);
    app.component('ComponentVueApi', ComponentVueApi);
    app.component('ComponentAccessibleTable', ComponentAccessibleTable);
    app.component('ComponentCombinator', ComponentCombinator);
    app.component('CodeExampleTabs', CodeExampleTabs);
    app.component('SvgLoader', SvgLoader);
    app.component('DialtoneUsage', DialtoneUsage);
    app.component('FlexStackNotice', FlexStackNotice);
  },
  setup () {
    const headers = shallowRef([]);
    provide('headers', { headers })
  },
});
