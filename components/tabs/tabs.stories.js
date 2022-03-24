import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
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
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  tabs: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  size: {
    defaultValue: 'default',
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

  change: {
    description: 'Change tab event with the arguments: `selected` id of the current tab and `disabled` value',
    table: {
      type: { summary: 'event' },
    },
  },
};

// Story Collection
export default {
  title: 'Components/Tabs',
  component: DtTabGroup,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtTabsMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtTabsDefaultTemplate,
);
const VariantsTemplate = (args) => createTemplateFromVueFile(
  args,
  DtTabsVariantsTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
