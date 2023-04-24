/* eslint-disable max-len */
// import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { ROOT_LAYOUT_RESPONSIVE_BREAKPOINTS, ROOT_LAYOUT_SIDEBAR_POSITIONS } from './root_layout_constants';
import DtRootLayout from './root_layout';
import DtRootLayoutMdx from './root_layout.mdx';
import DtRootLayoutDefaultTemplate from './root_layout_default.story.vue';

// Default Prop Values
export const argsData = {
  header: '<div class="d-bgc-purple-200 d-h100p">Header</div>',
  footer: '<div class="d-bgc-gold-200 d-h100p">Footer</div>',
  sidebar: '<div class="d-bgc-black-200 d-hmn100p"><div>Sidebar item 1</div><div>Sidebar item 2</div><div>Sidebar item 3</div></div>',
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
    description: 'Slot for main content',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  header: {
    description: 'Slot for header content',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  sidebar: {
    description: 'Slot for sidebar content',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  footer: {
    description: 'Slot for footer content',
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
    defaultValue: 'left',
    control: {
      type: 'select',
      options: Object.values(ROOT_LAYOUT_SIDEBAR_POSITIONS),
    },
  },

  responsiveBreakpoint: {
    defaultValue: null,
    control: {
      type: 'select',
      options: ROOT_LAYOUT_RESPONSIVE_BREAKPOINTS,
    },
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
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtRootLayoutMdx,
    },
    options: {
      showPanel: true,
    },
    layout: 'fullscreen',
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRootLayoutDefaultTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  default: argsData.default.repeat(40),
};

export const StickyHeader = DefaultTemplate.bind({});
StickyHeader.args = {
  headerSticky: true,
  fixed: false,
  default: argsData.default.repeat(40),
};
