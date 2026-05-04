import { action } from 'storybook/actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeGroupRow from './GroupRow.vue';

import DtRecipeGroupRowDefaultTemplate from './GroupRowDefault.story.vue';
import DtRecipeGroupRowVariantsTemplate from './GroupRowVariants.story.vue';

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
  template: `<div style="background-color: var(--dt-shell-color-surface-default)" class="d-wmx-400 d-p-100"><story />
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

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtRecipeGroupRowDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtRecipeGroupRowVariantsTemplate);

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
