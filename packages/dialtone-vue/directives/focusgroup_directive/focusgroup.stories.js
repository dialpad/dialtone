import { createTemplateFromVueFile } from '@/common/storybook_utils.js';
import FocusgroupDirectiveDefaultTemplate from './focusgroup_directive_default.story.vue';
import FocusgroupDirectiveVariantsTemplate from './focusgroup_directive_variants.story.vue';

export const argsData = {};

export const argTypesData = {};

// Story Collection
export default {
  title: 'Directives/Focusgroup',
  component: FocusgroupDirectiveDefaultTemplate,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, FocusgroupDirectiveDefaultTemplate);

const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, FocusgroupDirectiveVariantsTemplate);

// Stories
export const Default = {
  render: DefaultTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};

export const Variants = {
  render: VariantsTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
