import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeGroupRow from './group_row';
import DtRecipeGroupRowMdx from './group_row.mdx';
import DtRecipeGroupRowDefaultTemplate from './group_row_default.story.vue';
import DtRecipeGroupRowVariantsTemplate from './group_row_variants.story.vue';

// Default Prop Values
export const argsData = {
  onClick: action('click'),
};

export const argTypesData = {
  names: {
    defaultValue: 'Jaqueline Nackos, Lori Smith',
  },

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
  template: '<div class="d-w264 d-theme-sidebar-bgc d-p8"><story /></div>',
});

// Story Collection
export default {
  title: 'Recipes/Leftbar/Group Row',
  component: DtRecipeGroupRow,
  args: argsData,
  argTypes: argTypesData,
  decorators: [decorator],
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtRecipeGroupRowMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(args, DtRecipeGroupRowDefaultTemplate);
const VariantsTemplate = (args) => createTemplateFromVueFile(args, DtRecipeGroupRowVariantsTemplate);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
