import { createTemplateFromVueFile } from '@/common/storybook_utils';
import {
  DT_TEXT_LIST_DEFAULT_GAP,
  DT_TEXT_LIST_GAP,
  DT_TEXT_LIST_MARKER_TONES,
  DT_TEXT_LIST_MARKERS,
  DT_TEXT_LIST_TYPES,
} from './TextListConstants';
import DtTextList from './TextList.vue';
import DtTextListDefault from './TextListDefault.story.vue';
import DtTextListVariants from './TextListVariants.story.vue';

const markerOptions = [undefined, ...DT_TEXT_LIST_MARKERS];
const markerToneOptions = [undefined, ...DT_TEXT_LIST_MARKER_TONES];

export const argsData = {
  type: 'unordered',
  marker: undefined,
  markerTone: undefined,
  gap: DT_TEXT_LIST_DEFAULT_GAP,
  start: undefined,
  reversed: false,
  items: [
    'Collaborative inboxes',
    'AI-powered call summaries',
    'Unified customer history',
  ],
  itemValues: [],
};

export const argTypesData = {
  type: {
    options: DT_TEXT_LIST_TYPES,
    control: { type: 'radio' },
  },
  marker: {
    options: markerOptions,
    control: { type: 'select' },
  },
  markerTone: {
    options: markerToneOptions,
    control: { type: 'select' },
  },
  gap: {
    options: DT_TEXT_LIST_GAP,
    control: { type: 'select' },
  },
  start: {
    control: { type: 'number', min: 1 },
  },
  reversed: {
    control: 'boolean',
  },
  items: {
    control: 'object',
    table: {
      type: { summary: 'string[]' },
    },
  },
  itemValues: {
    control: 'object',
    table: {
      type: { summary: 'number[]' },
    },
  },
};

export default {
  title: 'Components/Text List',
  component: DtTextList,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtTextListDefault);
const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtTextListVariants);

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
