import { action } from 'storybook/actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { TEXT_SIZE_MODIFIERS, TEXT_STRENGTH_MODIFIERS } from '@/components/Text';
import DtSlider from './Slider.vue';
import { SLIDER_ORIENTATIONS, SLIDER_READOUT_MODES } from './SliderConstants';

import SliderDefaultTemplate from './SliderDefault.story.vue';
import SliderVariantsTemplate from './SliderVariants.story.vue';

// Default Prop Values
export const argsData = {
  modelValue: 50,
  min: 0,
  max: 100,
  step: 1,
  snapPoints: undefined,
  disabled: false,
  orientation: 'horizontal',
  showTicks: 10,
  minGapSteps: 0,
  label: 'Slider label',
  showLabel: true,
  labelSize: undefined,
  labelStrength: undefined,
  name: '',
  largeStep: 10,
  fillOrigin: 'start',
  readout: 'tooltip',
  'onUpdate:modelValue': action('update:modelValue'),
  onChange: action('change'),
  onFocus: action('focus'),
  onBlur: action('blur'),
};

// Controls
export const argTypesData = {
  // Slots
  labelSlot: {
    name: 'label',
    description: 'Slot for the label. Defaults to the label prop. Required for accessibility.',
    control: 'text',
    table: {
      category: 'slots',
      type: { summary: 'VNode' },
    },
  },
  startSlot: {
    name: 'start',
    description: 'Optional content at the inline-start end of the track (aka left).',
    control: 'text',
    table: {
      category: 'slots',
      type: { summary: 'VNode' },
    },
  },
  endSlot: {
    name: 'end',
    description: 'Optional content at the inline-end end of the track (aka right).',
    control: 'text',
    table: {
      category: 'slots',
      type: { summary: 'VNode' },
    },
  },

  // Props
  modelValue: {
    description: 'Controlled value. A Number enables single-thumb mode; a Number[] enables range mode.',
    control: { type: 'object' },
    table: {
      category: 'props',
      type: { summary: 'Number | Number[]' },
    },
  },
  min: {
    description: 'Minimum allowed value.',
    control: { type: 'number' },
    table: {
      category: 'props',
      type: { summary: 'Number' },
    },
  },
  max: {
    description: 'Maximum allowed value.',
    control: { type: 'number' },
    table: {
      category: 'props',
      type: { summary: 'Number' },
    },
  },
  step: {
    description: 'Increment/decrement step.',
    control: { type: 'number' },
    table: {
      category: 'props',
      type: { summary: 'Number' },
    },
  },
  snapPoints: {
    description: 'Magnetic snap points the thumb pulls toward while dragging (pointer only — keyboard stepping is unaffected). A Number sets an evenly spaced interval (e.g. 25); a Number[] sets arbitrary, not-necessarily-even values (e.g. [10, 42, 90]). Unlike step, this doesn\'t restrict which values are selectable — a value just outside the snap radius stays freely reachable.',
    control: { type: 'object' },
    table: {
      category: 'props',
      type: { summary: 'Number | Number[]' },
      defaultValue: { summary: 'undefined' },
    },
  },
  disabled: {
    description: 'Disables the slider.',
    control: 'boolean',
    table: {
      category: 'props',
      type: { summary: 'Boolean' },
    },
  },
  orientation: {
    description: 'Track orientation.',
    control: { type: 'select' },
    options: SLIDER_ORIENTATIONS,
    table: {
      category: 'props',
      type: { summary: 'String' },
      defaultValue: { summary: 'horizontal' },
    },
  },
  fillOrigin: {
    description: 'Which end the indicator fills from toward the thumb — start (the default, aka left) or end (aka right). Pass a Number instead to fill outward from that value toward the thumb, useful for balance/pan controls (:fill-origin="50" on a 0–100 range) or deviation displays. Ignored in range mode; a numeric origin is clamped to [min, max].',
    control: { type: 'text' },
    table: {
      category: 'props',
      type: { summary: 'Number | String' },
      defaultValue: { summary: 'start' },
    },
  },
  readout: {
    description: 'Controls the live value readout: a tooltip-styled bubble above the thumb (the default), always visible below the track, never shown, or shown below the track only while hovering, dragging, or focusing that thumb.',
    control: { type: 'select' },
    options: SLIDER_READOUT_MODES,
    table: {
      category: 'props',
      type: { summary: 'String' },
      defaultValue: { summary: 'tooltip' },
    },
  },
  showTicks: {
    description: 'Renders tick marks along the track — true for one per step, or a Number for a custom interval.',
    control: { type: 'text' },
    table: {
      category: 'props',
      type: { summary: 'Boolean | Number' },
      defaultValue: { summary: 'false' },
    },
  },
  minGapSteps: {
    description: 'Minimum gap (in steps) between thumbs in range mode.',
    control: { type: 'number' },
    table: {
      category: 'props',
      type: { summary: 'Number' },
    },
  },
  label: {
    description: 'Visible label text. Required for accessibility.',
    control: 'text',
    table: {
      category: 'props',
      type: { summary: 'String' },
    },
  },
  showLabel: {
    description: 'When false, hides the label visually while keeping it in the DOM for screen readers.',
    control: 'boolean',
    table: {
      category: 'props',
      type: { summary: 'Boolean' },
    },
  },
  labelSize: {
    description: 'Overrides the label text size.',
    control: { type: 'select' },
    options: TEXT_SIZE_MODIFIERS.label,
    table: {
      category: 'props',
      type: { summary: 'Number | String' },
      defaultValue: { summary: '300' },
    },
  },
  labelStrength: {
    description: 'Overrides the label font weight.',
    control: { type: 'select' },
    options: Object.keys(TEXT_STRENGTH_MODIFIERS),
    table: {
      category: 'props',
      type: { summary: 'String' },
      defaultValue: { summary: 'semibold (DtText\'s own default for kind="label")' },
    },
  },
  name: {
    description: 'Native name attribute for form submission. In range mode, both inputs share this name.',
    control: 'text',
    table: {
      category: 'props',
      type: { summary: 'String' },
    },
  },
  largeStep: {
    description: 'Approximate distance (same units as step) to move on Page Up/Page Down or Shift+Arrow, rounded to a whole number of steps (at least one).',
    control: { type: 'number' },
    table: {
      category: 'props',
      type: { summary: 'Number' },
      defaultValue: { summary: '10' },
    },
  },
  showMarks: {
    description: 'Text annotations below the track. Off by default; true = min/max only; a Number[] generates marks with auto-text; a { value, text }[] uses custom text.',
    control: { type: 'object' },
    table: {
      category: 'props',
      type: { summary: 'Boolean | Number[] | { value: Number, text: String }[]' },
      defaultValue: { summary: 'false' },
    },
  },
  labelClass: {
    control: 'text',
    table: { category: 'props' },
  },
  startClass: {
    control: 'text',
    table: { category: 'props' },
  },
  endClass: {
    control: 'text',
    table: { category: 'props' },
  },
  getValueText: {
    description: 'Function formatting a value for the readout and aria-valuetext (not marks — see showMarks). Signature: (value, index?) => string. Takes precedence over prefix/suffix.',
    control: null,
    table: {
      category: 'props',
      type: { summary: 'Function' },
    },
  },
  prefix: {
    description: 'Text prepended to the raw number wherever it\'s displayed. Always applied to marks; ignored by the readout/aria-valuetext when getValueText is set.',
    control: 'text',
    table: { category: 'props' },
  },
  suffix: {
    description: 'Text appended to the raw number wherever it\'s displayed. Always applied to marks; ignored by the readout/aria-valuetext when getValueText is set.',
    control: 'text',
    table: { category: 'props' },
  },

  // Directives
  'v-model': {
    description: 'Supported by this component',
    control: null,
    table: { category: 'directives' },
  },

  // Action Event Handlers
  'onUpdate:modelValue': {
    table: { disable: true },
  },
  onChange: {
    table: { disable: true },
  },
  onFocus: {
    table: { disable: true },
  },
  onBlur: {
    table: { disable: true },
  },
};

// Story Collection
export default {
  title: 'Components/Slider',
  component: DtSlider,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, SliderDefaultTemplate);

const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, SliderVariantsTemplate);

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
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
