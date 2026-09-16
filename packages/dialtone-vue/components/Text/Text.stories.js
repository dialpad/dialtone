import { action } from 'storybook/actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtText from './Text.vue';
import DtTextDefault from './TextDefault.story.vue';
import DtTextVariants from './TextVariants.story.vue';
import {
  TEXT_KIND_MODIFIERS,
  TEXT_VARIANT_MODIFIERS,
  TEXT_FONT_SIZE_MODIFIERS,
  TEXT_FAMILY_MODIFIERS,
  TEXT_ALIGN_MODIFIERS,
  TEXT_TONE_MODIFIERS,
  TEXT_STRENGTH_MODIFIERS,
  TEXT_DENSITY_MODIFIERS,
  TEXT_WRAP_MODIFIERS,
  TEXT_BOX_TRIM_MODIFIERS,
} from './TextConstants';

const kindOptions = [undefined, ...Object.keys(TEXT_KIND_MODIFIERS)];
const variantOptions = [undefined, ...Object.keys(TEXT_VARIANT_MODIFIERS)];
const sizeOptions = [undefined, ...Object.keys(TEXT_FONT_SIZE_MODIFIERS)];
const familyOptions = [undefined, ...Object.keys(TEXT_FAMILY_MODIFIERS)];
const alignOptions = [undefined, ...Object.keys(TEXT_ALIGN_MODIFIERS)];
const strengthOptions = [undefined, ...Object.keys(TEXT_STRENGTH_MODIFIERS)];
const densityOptions = [undefined, ...Object.keys(TEXT_DENSITY_MODIFIERS)];
const wrapOptions = [undefined, ...Object.keys(TEXT_WRAP_MODIFIERS)];
const toneOptions = [undefined, ...Object.keys(TEXT_TONE_MODIFIERS)];
const textBoxTrimOptions = [undefined, ...Object.keys(TEXT_BOX_TRIM_MODIFIERS)];

export const argsData = {
  default: 'The quick brown fox jumps over the lazy dog.',
  as: 'span',
  kind: undefined,
  variant: 'body-md',
  size: undefined,
  family: undefined,
  italic: false,
  strength: undefined,
  density: undefined,
  tone: undefined,
  align: undefined,
  truncate: false,
  maxLines: undefined,
  numeric: false,
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
    description: 'Legacy composition prop. Prefer variant for new usage.',
  },
  variant: {
    options: variantOptions,
    control: { type: 'select' },
  },
  size: {
    options: sizeOptions,
    control: { type: 'select' },
  },
  family: {
    options: familyOptions,
    control: { type: 'select' },
  },
  italic: {
    control: 'boolean',
  },
  strength: {
    options: strengthOptions,
    control: { type: 'select' },
  },
  density: {
    options: densityOptions,
    control: { type: 'select' },
  },
  tone: {
    options: toneOptions,
    control: { type: 'select' },
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
  wrap: {
    options: wrapOptions,
    control: { type: 'select' },
    description:
      'wrap: default | nowrap: prevent wrapping | balance: even line lengths | pretty: avoid orphans/widows',
  },
  textBoxTrim: {
    options: textBoxTrimOptions,
    control: { type: 'select' },
    description:
      'start: trim above | end: trim below | both: trim above and below. CSS text-box-trim for tighter layouts.',
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
  parameters: {
    docs: {
      description: {
        component:
          'The Dialtone typography primitive. `DtText` maps `variant`, `size`, `tone`, and `align` to token-backed classes and supports structural helpers like `as`, truncation, multi-line clamping, and numeric tabular figures. `kind` remains available as legacy composition syntax.',
      },
    },
  },
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtTextDefault);
const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtTextVariants);

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
