import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtText from './text.vue';
import DtTextDefault from './text_default.story.vue';
import DtTextVariants from './text_variants.story.vue';
import {
  TEXT_KIND_MODIFIERS,
  TEXT_SIZE_MODIFIERS,
  TEXT_STRENGTH_MODIFIERS,
  TEXT_DENSITY_MODIFIERS,
  TEXT_WEIGHT_MODIFIERS,
  TEXT_ALIGN_MODIFIERS,
} from './text_constants';

const kindOptions = Object.keys(TEXT_KIND_MODIFIERS);
const sizeOptions = Array.from(new Set(Object.values(TEXT_SIZE_MODIFIERS).flat()));
const strengthOptions = [undefined, ...TEXT_STRENGTH_MODIFIERS];
const densityOptions = [undefined, ...TEXT_DENSITY_MODIFIERS];
const weightOptions = [undefined, ...Object.keys(TEXT_WEIGHT_MODIFIERS)];
const alignOptions = [undefined, ...Object.keys(TEXT_ALIGN_MODIFIERS)];

export const argsData = {
  default: 'The quick brown fox jumps over the lazy dog.',
  as: 'span',
  kind: 'body',
  size: 'md',
  strength: undefined,
  density: undefined,
  weight: undefined,
  tone: undefined,
  align: undefined,
  truncate: false,
  maxLines: undefined,
  numeric: false,
  textProp: undefined,
  onClick: action('click'),
};

export const argTypesData = {
  default: {
    control: 'text',
    table: {
      type: { summary: 'VNode' },
    },
  },
  as: {
    control: 'text',
  },
  kind: {
    options: kindOptions,
    control: { type: 'select' },
  },
  size: {
    options: sizeOptions,
    control: { type: 'select' },
  },
  strength: {
    options: strengthOptions,
    control: { type: 'select' },
  },
  density: {
    options: densityOptions,
    control: { type: 'select' },
  },
  weight: {
    options: weightOptions,
    control: { type: 'select' },
  },
  tone: {
    control: 'text',
  },
  align: {
    options: alignOptions,
    control: { type: 'select' },
  },
  truncate: {
    control: 'boolean',
  },
  maxLines: {
    control: { type: 'number', min: 1 },
  },
  numeric: {
    control: 'boolean',
  },
  textProp: {
    control: 'text',
    table: {
      category: 'props',
      summary: 'string',
    },
  },
  onClick: {
    table: {
      disable: true,
    },
  },
};

export default {
  title: 'Components/Text',
  component: DtText,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtTextDefault);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtTextVariants);

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: {
    controls: { disable: true },
    options: { showPanel: false },
  },
};
