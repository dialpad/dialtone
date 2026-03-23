import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtSegmentedControl from './segmented_control.vue';
import DtSegmentedControlDefaultTemplate from './segmented_control_default.story.vue';
import DtSegmentedControlVariantsTemplate from './segmented_control_variants.story.vue';
import {
  SEGMENTED_CONTROL_SIZES,
  SEGMENTED_CONTROL_SIZE_DEFAULT,
  SEGMENTED_CONTROL_ORIENTATIONS,
  SEGMENTED_CONTROL_ORIENTATION_DEFAULT,
  SEGMENTED_CONTROL_ACTIVATION_MODES,
  SEGMENTED_CONTROL_ACTIVATION_MODE_DEFAULT,
  SEGMENTED_CONTROL_SPREADS,
  SEGMENTED_CONTROL_SPREAD_DEFAULT,
} from './segmented_control_constants';

export const argsData = {
  orientation: SEGMENTED_CONTROL_ORIENTATION_DEFAULT,
  size: SEGMENTED_CONTROL_SIZE_DEFAULT,
  activationMode: SEGMENTED_CONTROL_ACTIVATION_MODE_DEFAULT,
  disabled: false,
  hideDivider: false,
  borderless: false,
  spread: SEGMENTED_CONTROL_SPREAD_DEFAULT,
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
    defaultValue: SEGMENTED_CONTROL_ORIENTATION_DEFAULT,
    control: 'select',
    options: SEGMENTED_CONTROL_ORIENTATIONS,
  },
  size: {
    defaultValue: SEGMENTED_CONTROL_SIZE_DEFAULT,
    control: 'select',
    options: SEGMENTED_CONTROL_SIZES,
  },
  activationMode: {
    defaultValue: SEGMENTED_CONTROL_ACTIVATION_MODE_DEFAULT,
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
    defaultValue: SEGMENTED_CONTROL_SPREAD_DEFAULT,
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
  change: {
    action: 'change',
    table: {
      type: { summary: 'event' },
    },
  },
  'before-change': {
    action: 'before-change',
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
