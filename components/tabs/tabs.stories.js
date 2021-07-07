import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '../storybook_utils';
import DtTabGroup from './tab_group';
import DtTabsMdx from './tabs.mdx';
import DtTabsDefaultTemplate from './tabs_default.story.vue';
import DtTabsVariantsTemplate from './tabs_variants.story.vue';
import { TAB_LIST_SIZES } from './tabs_constants';

// Default Prop Values
export const argsData = {
  onChange: action('change'),
};

export const argTypesData = {
  // Action Event Handlers
  size: {
    defaultValue: '',
    control: {
      type: 'select',
      options: TAB_LIST_SIZES,
    },
  },

  // Action Event Handlers
  onChange: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Elements/Tabs',
  component: DtTabGroup,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      page: DtTabsMdx,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtTabsDefaultTemplate,
);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtTabsVariantsTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
