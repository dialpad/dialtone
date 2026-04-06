import { defineClientConfig } from 'vuepress/client';
import { provide, shallowRef } from 'vue';

// Common views
import Icons from './views/Icons.vue';
import Overview from './views/Overview.vue';
import UiKitsOverview from './views/UiKitsOverview.vue';

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
import CodeExample from './baseComponents/CodeExample.vue';
import SvgLoader from './baseComponents/SvgLoader.vue';
import DialtoneUsage from './baseComponents/DialtoneUsage.vue';
import UiKitsComparisonTable from './baseComponents/UiKitsComparisonTable.vue';

export default defineClientConfig({
  enhance ({ app }) {
    // Common views
    app.component('Icons', Icons);
    app.component('Overview', Overview);
    app.component('UiKitsOverview', UiKitsOverview);

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
    app.component('CodeExample', CodeExample);
    app.component('SvgLoader', SvgLoader);
    app.component('DialtoneUsage', DialtoneUsage);
    app.component('UiKitsComparisonTable', UiKitsComparisonTable);
  },
  setup () {
    const headers = shallowRef([]);
    provide('headers', { headers })
  },
});
