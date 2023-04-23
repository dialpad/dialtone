import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtTabGroup from './tab_group.vue';
import DtTabPanel from './tab_panel.vue';
import DtTab from './tab.vue';

import DtTabsDefaultTemplate from './tabs_default.story.vue';
import DtTabsVariantsTemplate from './tabs_variants.story.vue';
import { TAB_LIST_SIZES } from './tabs_constants';

// Default Prop Values
export const argsData = {
  size: 'default',
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
    options: TAB_LIST_SIZES,
    control: {
      type: 'select',
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
    options: {
      showPanel: true,
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

const TabPanelTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtTabPanel,
);

const TabTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtTab,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { options: { showPanel: false } };

export const TabPanel = TabPanelTemplate.bind({});
TabPanel.args = {};

export const Tab = TabTemplate.bind({});
Tab.args = {};
