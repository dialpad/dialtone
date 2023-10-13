/* eslint-disable max-len */
// import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import {
  ROOT_LAYOUT_RESPONSIVE_BREAKPOINTS,
  ROOT_LAYOUT_SIDEBAR_POSITIONS,
} from './root_layout_constants';
import DtRootLayout from './root_layout.vue';

import DtRootLayoutDefaultTemplate from './root_layout_default.story.vue';
import DtRootLayoutStickyTemplate from './root_layout_sticky.story.vue';

// Default Prop Values
export const argsData = {
  sidebarPosition: 'left',
  header: '<div class="d-bgc-purple-200 d-h64">Header</div>',
  footer: '<div class="d-bgc-gold-200 d-h64">Footer</div>',
  sidebar:
    '<div class="d-bgc-black-200 d-wmn264 d-h100p"><div>Sidebar item 1</div><div>Sidebar item 2</div><div>Sidebar item 3</div></div>',
  default: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim eleifend condimentum.
  Vestibulum euismod leo at finibus mattis. Integer ut dui id ligula tincidunt pellentesque. Vestibulum a ullamcorper
  risus. Ut tristique sapien eget magna lacinia, non interdum lacus malesuada. Proin augue lacus, finibus eget aliquam
  eu, efficitur sit amet magna. Suspendisse a nunc volutpat, maximus enim vitae, pretium dui. Suspendisse pretium
  faucibus posuere. Aenean consequat imperdiet laoreet. Pellentesque habitant morbi tristique senectus et netus et
  malesuada fames ac turpis egestas. Aliquam elit lacus, venenatis ac risus at, ullamcorper tempor tortor. Ut sed
  pulvinar mi, vitae vehicula odio. Fusce ornare vestibulum rhoncus. In vel ante arcu. Nunc pharetra libero non
  enim dapibus efficitur. Suspendisse dolor ante, pulvinar et faucibus quis, condimentum at dui.`,
};

/**
 * example prop description decorator
 */

/*
  Controls
  ========

  Here we define any custom controls or control overrides for our components.

  By default storybook will attempt to provide an appropriate control of the same name for each property in the
  component as well as include any description provided using a prop decorator within your component (see above).

  Storybook will also attempt to provide an appropriate control for each slot in the component as well as include any
  description provided using a slot decorator within your component (see below).

  <!-- @slot example slot decorator -->
*/
export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  header: {
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  sidebar: {
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  footer: {
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  sidebarPosition: {
    options: Object.values(ROOT_LAYOUT_SIDEBAR_POSITIONS),
    control: {
      type: 'select',
    },
  },

  responsiveBreakpoint: {
    defaultValue: null,
    options: ROOT_LAYOUT_RESPONSIVE_BREAKPOINTS,
    control: {
      type: 'select',
    },
  },

  headerSticky: {
    control: 'boolean',
  },

  fixed: {
    control: 'boolean',
  },
};

// Story Collection
export default {
  title: 'Components/Root Layout',
  component: DtRootLayout,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    layout: 'fullscreen',
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtRootLayoutDefaultTemplate);
const StickyTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtRootLayoutStickyTemplate);

export const Default = {
  render: DefaultTemplate,

  args: {
    default: argsData.default.repeat(40),
  },
};

export const StickyHeader = {
  render: StickyTemplate,

  args: {
    headerSticky: true,
    fixed: false,
    default: argsData.default.repeat(40),
  },
};
