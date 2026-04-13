/* eslint-disable max-lines */
import { action } from 'storybook/actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtInput from './input.vue';
import { INPUT_SIZES, INPUT_TYPES } from './input_constants';

import InputDefault from './input_default.story.vue';
import InputSearchVariant from './input_search_variant.story.vue';

const iconsList = getIconNames();

export const argsData = {
  type: DtInput.props.type.default,
  size: INPUT_SIZES.DEFAULT,
  placeholder: 'placeholder',
  label: 'Label',
  onBlur: action('blur'),
  onInput: action('input'),
  onClear: action('clear'),
  onFocus: action('focus'),
  onFocusIn: action('focusin'),
  onFocusOut: action('focusout'),
  onUpdateLength: action('update:length'),
  onUpdateIsInvalid: action('update:invalid'),
};

// Controls
export const argTypesData = {
  // Slots
  description: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  startIcon: {
    options: iconsList,
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  endIcon: {
    options: iconsList,
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  leftIcon: {
    table: {
      disable: true,
    },
  },
  rightIcon: {
    table: {
      disable: true,
    },
  },
  labelSlot: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },

  // Props
  modelValue: {
    control: 'text',
  },
  type: {
    control: 'select',
    options: [null, ...Object.values(INPUT_TYPES)],
    table: {
      defaultValue: {
        summary: DtInput.props.type.default,
      },
    },
  },
  messages: {
    control: 'object',
  },
  size: {
    control: 'select',
    options: Object.values(INPUT_SIZES),
    table: {
      defaultValue: {
        summary: INPUT_SIZES.DEFAULT,
      },
    },
  },
  inputClass: {
    control: 'text',
  },
  messagesChildProps: { control: null },
  label: {
    control: {
      type: 'text',
    },
  },
  currentLength: {
    control: 'number',
    table: {
      defaultValue: {
        summary: 'null',
      },
    },
  },
  validate: {
    control: 'object',
    table: {
      defaultValue: {
        summary: 'null',
      },
    },
  },
  disabled: {
    control: { type: 'boolean' },
  },
  hidden: {
    control: { type: 'boolean' },
  },
  labelVisible: {
    control: { type: 'boolean' },
  },
  retainWarning: {
    control: { type: 'boolean' },
  },
  name: {
    control: { type: 'text' },
  },
  inputWrapperClass: {
    control: 'text',
  },

  // HTML attributes
  placeholder: {
    description: 'HTML input placeholder attribute',
    table: {
      category: 'html attributes',
    },
    control: 'text',
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
  onBlur: {
    table: {
      disable: true,
    },
  },
  onInput: {
    table: {
      disable: true,
    },
  },
  onClear: {
    table: {
      disable: true,
    },
  },
  onFocus: {
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
  onUpdateLength: {
    table: {
      disable: true,
    },
  },
  onUpdateIsInvalid: {
    table: {
      disable: true,
    },
  },

  blur: {
    description: 'Native input blur event',
    table: {
      type: { summary: 'event' },
    },
  },
  input: {
    description: 'Native input event',
    table: {
      type: { summary: 'event' },
    },
  },
  clear: {
    description: 'Native input clear event',
    table: {
      type: { summary: 'event' },
    },
  },
  focus: {
    description: 'Native input focus event',
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
  'update:length': {
    description: 'Length of the input when currentLength prop is not passed',
    table: {
      type: { summary: 'event' },
    },
  },
  'update:invalid': {
    description: 'Result of the input validation',
    table: {
      type: { summary: 'event' },
    },
  },
  'update:modelValue': {
    table: {
      disable: true,
    },
  },
};

const decorator = () => ({
  template: '<div style="width: 500px"><story /></div>',
});

export default {
  title: 'Components/Input',
  component: DtInput,
  decorators: [decorator],
  excludeStories: /.*Data$/,
  argTypes: argTypesData,
  args: argsData,
};

export const Default = {
  render: (args, { argTypes }) => {
    return createTemplateFromVueFile(args, argTypes, InputDefault);
  },
};

export const WithDescription = {
  ...Default,
  args: {
    label: 'Label',
    description: 'Description',
  },
};

export const WithStartIcon = {
  ...Default,
  args: {
    startIcon: 'send',
  },
};

export const WithEndIcon = {
  ...Default,
  args: {
    endIcon: 'lock-filled',
  },
};

export const WithBothIcons = {
  ...Default,
  args: {
    startIcon: 'send',
    endIcon: 'lock-filled',
  },
};

export const WithWarning = {
  ...Default,
  args: {
    messages: [{ message: 'This is a warning message', type: 'warning' }],
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
    },
  },
};

export const WithCritical = {
  ...Default,
  args: {
    messages: [{ message: 'This is a critical message', type: 'critical' }],
  },
};

export const WithPositive = {
  ...Default,
  args: {
    messages: [{ message: 'This is a positive message', type: 'positive' }],
  },
};

export const WithMultipleMessages = {
  ...Default,
  args: {
    messages: [
      { message: 'This is the first message', type: 'critical' },
      { message: 'This is the second message', type: 'critical' },
      { message: 'This is the third message', type: 'critical' },
    ],
  },
};

export const ExtraSmall = {
  ...Default,
  args: {
    size: 100,
  },
};

export const Small = {
  ...Default,
  args: {
    size: 200,
  },
};

export const Large = {
  ...Default,
  args: {
    size: 400,
  },
};

export const ExtraLarge = {
  ...Default,
  args: {
    size: 500,
  },
};

export const WithLengthValidation = {
  ...Default,
  args: {
    validate: {
      length: {
        description: 'Max 25 characters.',
        max: 25,
        warn: 15,
        limitMaxLength: false,
      },
    },
  },
};

const SearchVariantTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  InputSearchVariant,
);

export const SearchVariant = {
  render: SearchVariantTemplate,
  args: {
    type: 'search',
  },
};
