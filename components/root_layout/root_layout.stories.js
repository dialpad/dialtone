/* eslint-disable max-len */
// import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { ROOT_LAYOUT_SIDEBAR_POSITIONS } from './root_layout_constants';
import DtRootLayout from './root_layout';
import DtRootLayoutMdx from './root_layout.mdx';
import DtRootLayoutDefaultTemplate from './root_layout_default.story.vue';
import DtRootLayoutStickyTemplate from './root_layout_sticky.story.vue';

// Default Prop Values
export const argsData = {
  header: '<div class="d-h100p d-bgc-purple-100">Header</div>',
  footer: '<div class="d-h100p d-bgc-gold-100">Footer</div>',
  sidebar: '<div class="d-h100p d-bgc-black-100"><div>Sidebar item 1</div><div>Sidebar item 2</div><div>Sidebar item 3</div></div>',
  default: '<div class="d-h100p">Content</div>',
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
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRootLayoutDefaultTemplate,
);

const StickyTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRootLayoutStickyTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Sticky = StickyTemplate.bind({});
Sticky.args = {
  headerSticky: 'true',
};
