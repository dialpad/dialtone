import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import ToggleDefault from './toggle_default.story.vue';
import ToggleVariants from './toggle_variants.story.vue';

import DtToggle from './toggle.vue';
import { TOGGLE_CHECKED_VALUES, TOGGLE_SIZE_MODIFIERS } from '@/components/toggle/toggle_constants';

// Default Prop Values
export const argsData = {
  default: 'Toggle Default',
  checked: false,
  onChange: action('change'),
  labelClass: 'd-mr6',
};

// Prop Controls
export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    description: 'Used as a way to set either a label or a label element for the toggle',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  checked: {
    description:
      'Used to set the initial state of the toggle. Setting "mixed" means it gets the indeterminate state.',
    options: TOGGLE_CHECKED_VALUES,
    control: {
      type: 'select',
    },
    table: {
      category: 'props',
      type: {
        summary: 'boolean | "mixed"',
      },
      defaultValue: {
        summary: false,
      },
    },
  },

  size: {
    description: 'Used to set the size of the toggle',
    options: Object.keys(TOGGLE_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },

  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },

  // Directives
  'v-model': {
    description: 'Supported by this component',
    control: null,
    table: {
      category: 'directives',
    },
  },

  disabled: {
    description: 'Used to disabled the toggle',
    control: 'boolean',
    table: {
      category: 'props',
      type: {
        summary: 'boolean',
      },
    },
  },

  labelChildProps: {
    control: null,
  },

  // Action Event Handlers
  onChange: {
    table: {
      disable: true,
    },
  },

  change: {
    description: 'Toggle Change event',
    table: {
      type: { summary: 'event' },
    },
  },
};

// Default
export default {
  title: 'Components/Toggle',
  component: DtToggle,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Toggle Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(args, ToggleDefault);
const VariantsTemplate = (args) => createTemplateFromVueFile(args, ToggleVariants);

export const Default = {
  render: DefaultTemplate,
  args: {},

  parameters: {
    a11y: {
      config: {
        rules: [
          // TODO: it's possible to pass a custom aria-label but adding a built-in label can cover most of cases
          {
            id: 'button-name',
            enabled: false,
          },
        ],
      },
    },
  },
};

export const Variants = {
  render: VariantsTemplate,
  args: {},

  parameters: {
    options: {
      showPanel: false,
    },
    a11y: Default.parameters.a11y,
  },
};
