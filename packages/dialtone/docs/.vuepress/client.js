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
import WeatherCodesTable from './baseComponents/WeatherCodesTable.vue';
import IconSizesTable from './baseComponents/IconSizesTable.vue';
import ComponentAccessibleTable from './baseComponents/ComponentAccessibleTable.vue';
import ComponentCombinator from './baseComponents/ComponentCombinator.vue';
import ExampleTabs from './baseComponents/ExampleTabs.vue';
import SvgLoader from './baseComponents/SvgLoader.vue';

// Common icons
import IconInfo from '@svgIcons/IconInfo.vue';
import IconLightbulb from '@svgIcons/IconLightbulb.vue';
import IconCheckCircle from '@svgIcons/IconCheckCircle.vue';
import IconWarning from '@svgIcons/IconWarning.vue';
import IconError from '@svgIcons/IconError.vue';
import IconClose from '@svgIcons/IconClose.vue';
import IconCheckmark from '@svgIcons/IconCheckmark.vue';
import IconPhone from '@svgIcons/IconPhone.vue';

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
    app.component('WeatherCodesTable', WeatherCodesTable);
    app.component('IconSizesTable', IconSizesTable);
    app.component('ComponentAccessibleTable', ComponentAccessibleTable);
    app.component('ComponentCombinator', ComponentCombinator);
    app.component('ExampleTabs', ExampleTabs);
    app.component('SvgLoader', SvgLoader);

    // Common icons
    app.component('IconInfo', IconInfo);
    app.component('IconPhone', IconPhone);
    app.component('IconLightbulb', IconLightbulb);
    app.component('IconCheckCircle', IconCheckCircle);
    app.component('IconWarning', IconWarning);
    app.component('IconError', IconError);
    app.component('IconClose', IconClose);
    app.component('IconCheckmark', IconCheckmark);
  },
  setup () {},
  rootComponents: [],
});
