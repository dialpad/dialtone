import { action } from 'storybook/actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtSlider from './Slider.vue';
import { SLIDER_SIZE_MODIFIERS, SLIDER_ORIENTATIONS } from './SliderConstants';

import SliderDefaultTemplate from './SliderDefault.story.vue';
import SliderVariantsTemplate from './SliderVariants.story.vue';

// Default Prop Values
export const argsData = {
  modelValue: 50,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  orientation: 'horizontal',
  inverted: false,
  showTicks: false,
  tickInterval: null,
  minStepsBetweenValues: 0,
  size: 300,
  label: 'Slider label',
  labelHidden: false,
  name: '',
  largeStep: 10,
  marks: false,
  fillOrigin: null,
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
    description: 'Optional content at the inline-start end of the track (aka left in LTR).',
    control: 'text',
    table: {
      category: 'slots',
      type: { summary: 'VNode' },
    },
  },
  endSlot: {
    name: 'end',
    description: 'Optional content at the inline-end end of the track (aka right in LTR).',
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
  inverted: {
    description: 'Reverses fill direction — fills from the max end toward the thumb. Ignored when fillOrigin is set.',
    control: 'boolean',
    table: {
      category: 'props',
      type: { summary: 'Boolean' },
    },
  },
  fillOrigin: {
    description: 'Fill grows outward from this value toward the thumb. Useful for balance/pan controls (:fill-origin="50" on a 0–100 range) or deviation displays. Ignored in range mode. Clamped to [min, max].',
    control: { type: 'number' },
    table: {
      category: 'props',
      type: { summary: 'Number' },
      defaultValue: { summary: 'null' },
    },
  },
  showTicks: {
    description: 'Renders a tick mark at every tickInterval.',
    control: 'boolean',
    table: {
      category: 'props',
      type: { summary: 'Boolean' },
    },
  },
  tickInterval: {
    description: 'Distance between tick marks (same units as step). Defaults to step when null.',
    control: { type: 'number' },
    table: {
      category: 'props',
      type: { summary: 'Number' },
      defaultValue: { summary: 'null (uses step)' },
    },
  },
  minStepsBetweenValues: {
    description: 'Minimum gap (in steps) between thumbs in range mode.',
    control: { type: 'number' },
    table: {
      category: 'props',
      type: { summary: 'Number' },
    },
  },
  size: {
    description: 'Size of the slider thumb and track.',
    control: { type: 'select' },
    options: Object.keys(SLIDER_SIZE_MODIFIERS).filter((k) => !isNaN(Number(k))).map(Number),
    table: {
      category: 'props',
      type: { summary: 'Number | String' },
      defaultValue: { summary: '300' },
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
  labelHidden: {
    description: 'Hides the label visually while keeping it in the DOM for screen readers.',
    control: 'boolean',
    table: {
      category: 'props',
      type: { summary: 'Boolean' },
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
    description: 'Number of steps to move on Page Up / Page Down.',
    control: { type: 'number' },
    table: {
      category: 'props',
      type: { summary: 'Number' },
      defaultValue: { summary: '10' },
    },
  },
  marks: {
    description: 'Text annotations below the track. true = one mark per tick; a Number[] generates marks with auto-text; a { value, text }[] uses custom text.',
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
  getAriaValueText: {
    description: 'Function returning aria-valuetext for a thumb. Signature: (value, index) => string.',
    control: null,
    table: {
      category: 'props',
      type: { summary: 'Function' },
    },
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
