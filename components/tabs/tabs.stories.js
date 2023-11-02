import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtTabGroup from './tab_group.vue';

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
    description:
      'Change tab event with the arguments: `selected` id of the current tab and `disabled` value',
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

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
