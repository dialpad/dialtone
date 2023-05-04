import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import CheckboxDefault from './checkbox_default.story.vue';
import CheckboxVariants from './checkbox_variants.story.vue';

import DtCheckbox from './checkbox.vue';

// Default Prop Values
export const argsData = {
  value: 'Value',
  name: 'Name',
  label: 'Checkbox',
  validationState: '',
  onInput: action('input'),
  onFocusIn: action('focusin'),
  onFocusOut: action('focusout'),
};

// Prop Controls
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
  descriptionSlot: {
    name: 'description',
    description: 'slot for Checkbox Description',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  description: {
    description: 'Describes the checkbox option',
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
    control: {
      type: 'text',
    },
  },
  checked: {
    description: 'Used to set the initial state of the checkbox',
    control: 'boolean',
    table: {
      category: 'props',
      type: {
        summary: 'boolean',
      },
    },
  },
  validationState: {
    table: {
      type: {
        summary: 'string',
      },
    },
    options: ['', ...Object.values(VALIDATION_MESSAGE_TYPES)],
    control: {
      type: 'select',
    },
  },
  labelChildProps: {
    control: null,
  },
  descriptionChildProps: {
    control: null,
  },

  // Directives
  'v-model': {
    description: 'Supported by this component',
    control: null,
    table: {
      category: 'directives',
    },
  },

  // Action Event Handlers
  onInput: {
    table: {
      disable: true,
    },
  },
  onFocusIn: {
    table: {
      disable: true,
    },
  },
  onFocusOut: {
    table: {
      disable: true,
    },
  },

  input: {
    description: 'Native input event',
    table: {
      type: { summary: 'event' },
    },
  },
  focusin: {
    description: 'Native input focusin event',
    table: {
      type: { summary: 'event' },
    },
  },
  focusout: {
    description: 'Native input focusout event',
    table: {
      type: { summary: 'event' },
    },
  },
};

// Story Collection
export default {
  title: 'Components/Checkbox',
  component: DtCheckbox,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Checkbox Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, CheckboxDefault);
const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, CheckboxVariants);

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
