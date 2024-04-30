import { action } from '@storybook/addon-actions';
import { createRenderConfig } from '@/common/storybook_utils';
import DtRecipeContactCentersRow from './contact_centers_row.vue';
import DtRecipeContactCentersRowDefaultTemplate from './contact_centers_row_default.story.vue';
import DtRecipeContactCentersRowVariantsTemplate from './contact_centers_row_variants.story.vue';

// Default Prop Values
export const argsData = {
  description: 'Ai Contact Centers',
  menuButtonAriaLabel: 'Menu button',
  click: action('click'),
  clickMenu: action('click-menu'),
};

export const argTypesData = {
  // Slots
  right: {
    name: 'right',
    description: 'Slot right hand side content. Ex. agent on duty status component',
    table: {
      category: 'slots',
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },

  // Action Event Handlers
  click: {
    description: 'Native click event on the row itself',
    table: {
      category: 'events',
      type: { summary: 'event' },
    },
  },

  'click-menu': {
    description: 'Native click event on the menu button',
    table: {
      category: 'events',
      type: { summary: 'event' },
    },
  },

  clickMenu: {
    table: {
      disable: true,
    },
  },
};

const decorator = () => ({
  template: `<div style="background-color: var(--dt-theme-sidebar-color-background)" class="d-wmx264 d-p8"><story />
  </div>`,
});

// Story Collection
export default {
  title: 'Recipes/Leftbar/Contact Centers Row',
  component: DtRecipeContactCentersRow,
  args: argsData,
  argTypes: argTypesData,
  decorators: [decorator],
  excludeStories: /.*Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(
    DtRecipeContactCentersRow,
    DtRecipeContactCentersRowDefaultTemplate,
    argsData,
  ),
  args: {},
};

export const Variants = {
  render: (argsData) => createRenderConfig(
    DtRecipeContactCentersRow,
    DtRecipeContactCentersRowVariantsTemplate,
    argsData,
  ),
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
