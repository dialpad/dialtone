import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtSegmentedControl from './segmented_control.vue';
import DtSegmentedControlDefaultTemplate from './segmented_control_default.story.vue';
import DtSegmentedControlVariantsTemplate from './segmented_control_variants.story.vue';
import {
  SEGMENTED_CONTROL_SIZES,
  SEGMENTED_CONTROL_ORIENTATIONS,
  SEGMENTED_CONTROL_ACTIVATION_MODES,
  SEGMENTED_CONTROL_SPREADS,
} from './segmented_control_constants';

export const argsData = {
  orientation: 'horizontal',
  size: 'sm',
  activationMode: 'auto',
  disabled: false,
  hideDivider: false,
  borderless: false,
  spread: 'grow',
  labelClass: '',
};

export const argTypesData = {
  // Props
  modelValue: {
    control: 'text',
    table: {
      type: { summary: 'String' },
    },
  },
  ariaLabel: {
    control: 'text',
  },
  orientation: {
    defaultValue: 'horizontal',
    control: 'select',
    options: SEGMENTED_CONTROL_ORIENTATIONS,
  },
  size: {
    defaultValue: 'sm',
    control: 'select',
    options: SEGMENTED_CONTROL_SIZES,
  },
  activationMode: {
    defaultValue: 'auto',
    control: 'select',
    options: SEGMENTED_CONTROL_ACTIVATION_MODES,
  },
  disabled: {
    control: 'boolean',
  },
  hideDivider: {
    control: 'boolean',
  },
  borderless: {
    control: 'boolean',
  },
  spread: {
    defaultValue: 'grow',
    control: 'select',
    options: SEGMENTED_CONTROL_SPREADS,
  },
  labelClass: {
    control: 'text',
  },

  // Slots
  default: {
    control: 'text',
    table: {
      type: { summary: 'VNode' },
    },
  },

  // Events
  'update:modelValue': {
    action: 'update:modelValue',
    table: {
      type: { summary: 'event' },
    },
  },
};

// Story Collection
export default {
  title: 'Components/Segmented Control',
  component: DtSegmentedControl,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtSegmentedControlDefaultTemplate,
);

const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtSegmentedControlVariantsTemplate,
);

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: {
    controls: { disable: true },
  },
};
