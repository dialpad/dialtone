import { defineClientConfig } from '@vuepress/client';

// Common views
import Icons from './views/Icons.vue';
import ColorsCatalog from './views/ColorsCatalog.vue';
import BorderColorTable from './views/BorderColorTable.vue';
import ThemeColorTable from './views/ThemeColorTable.vue';
import Overview from './views/Overview.vue';

// Base components
import CodeWellHeader from './baseComponents/CodeWellHeader.vue';
import UtilityClassTable from './baseComponents/UtilityClassTable.vue';
import ComponentClassTable from './baseComponents/ComponentClassTable.vue';
import TokenTable from './baseComponents/TokenTable.vue';
import ComponentVueApi from './baseComponents/ComponentVueApi.vue';
import ComponentAccessibleTable from './baseComponents/ComponentAccessibleTable.vue';
import ComponentCombinator from './baseComponents/ComponentCombinator.vue';
import ExampleTabs from './baseComponents/ExampleTabs.vue';
import SvgLoader from './baseComponents/SvgLoader.vue';

export default defineClientConfig({
  enhance ({ app, router, siteData }) {
    // Common views
    app.component('Icons', Icons);
    app.component('ColorsCatalog', ColorsCatalog);
    app.component('BorderColorTable', BorderColorTable);
    app.component('ThemeColorTable', ThemeColorTable);
    app.component('Overview', Overview);

    // Base components
    app.component('CodeWellHeader', CodeWellHeader);
    app.component('UtilityClassTable', UtilityClassTable);
    app.component('ComponentClassTable', ComponentClassTable);
    app.component('TokenTable', TokenTable);
    app.component('ComponentVueApi', ComponentVueApi);
    app.component('ComponentAccessibleTable', ComponentAccessibleTable);
    app.component('ComponentCombinator', ComponentCombinator);
    app.component('ExampleTabs', ExampleTabs);
    app.component('SvgLoader', SvgLoader);
  },
  setup () {},
  rootComponents: [],
});
