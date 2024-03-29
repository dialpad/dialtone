import { action } from '@storybook/addon-actions';
import { createRenderConfig } from '@/common/storybook_utils';
import DtRecipeGroupRow from './group_row.vue';

import DtRecipeGroupRowDefaultTemplate from './group_row_default.story.vue';
import DtRecipeGroupRowVariantsTemplate from './group_row_variants.story.vue';

// Default Prop Values
export const argsData = {
  onClick: action('click'),
  names: 'Jaqueline Nackos, Lori Smith',
};

export const argTypesData = {
  // Slots

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },

  click: {
    table: {
      type: { summary: 'event' },
    },
  },
};

const decorator = () => ({
  template: `<div style="background-color: var(--dt-theme-sidebar-color-background)" class="d-wmx264 d-p8"><story />
  </div>`,
});

// Story Collection
export default {
  title: 'Recipes/Leftbar/Group Row',
  component: DtRecipeGroupRow,
  args: argsData,
  argTypes: argTypesData,
  decorators: [decorator],
  excludeStories: /.*Data$/,
};
export const Default = {
  render: (argsData) => createRenderConfig(DtRecipeGroupRow, DtRecipeGroupRowDefaultTemplate, argsData),
  args: {},
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtRecipeGroupRow, DtRecipeGroupRowVariantsTemplate, argsData),
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
