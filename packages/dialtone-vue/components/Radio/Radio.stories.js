import { action } from 'storybook/actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import RadioDefault from './RadioDefault.story.vue';
import RadioVariants from './RadioVariants.story.vue';

import DtRadio from './Radio.vue';

// Default Prop Values
export const argsData = {
  value: 'Value',
  name: 'Name',
  label: 'Radio',
  description: '',
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
    description: 'slot for Radio Description',
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
    description: 'Describes the radio option',
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
    description: 'Used to set the initial state of the radio',
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
  title: 'Components/Radio',
  component: DtRadio,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Radio Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, RadioDefault);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, RadioVariants);

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
