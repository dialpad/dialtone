import { action } from 'storybook/actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import CheckboxDefault from './CheckboxDefault.story.vue';
import CheckboxVariants from './CheckboxVariants.story.vue';

import DtCheckbox from './Checkbox.vue';

// Default Prop Values
export const argsData = {
  value: 'Value',
  name: 'Name',
  label: 'Checkbox',
  validationState: '',
  'onUpdate:modelValue': action('update:modelValue'),
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
  modelValue: {
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
    control: 'select',
    options: ['', ...Object.values(VALIDATION_MESSAGE_TYPES)],
  },
  label: {
    control: { type: 'text' },
  },
  name: {
    control: { type: 'text' },
  },
  value: {
    control: { type: 'text' },
  },
  disabled: {
    control: { type: 'boolean' },
  },
  indeterminate: {
    control: { type: 'boolean' },
  },
  showLabel: {
    control: { type: 'boolean' },
  },
  labelSize: {
    options: ['100', '200', '300', '400'],
    control: { type: 'select' },
  },
  labelStrength: {
    options: ['bold', 'semibold', 'medium', 'normal'],
    control: { type: 'select' },
  },
  inputClass: {
    description: 'Used to customize the input element',
  },
  labelClass: {
    description: 'Used to customize the label container',
  },
  descriptionClass: {
    description: 'Used to customize the description container',
  },
  messagesClass: {
    description: 'Used to customize the validation messages component',
  },
  showMessages: {
    control: { type: 'boolean' },
  },
  messages: {
    control: 'object',
  },
  labelChildProps: {
    control: null,
  },
  descriptionChildProps: {
    control: null,
  },
  messagesChildProps: {
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
  'onUpdate:modelValue': {
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

  'update:modelValue': {
    description: 'Event fired to sync the modelValue prop with the parent component',
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
