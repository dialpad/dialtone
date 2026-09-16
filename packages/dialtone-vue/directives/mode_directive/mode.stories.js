import { createTemplateFromVueFile } from '@/common/storybook_utils.js';
import ModeDirectiveDefaultTemplate from './mode_directive_default.story.vue';

export const argsData = {};

export const argTypesData = {};

// Story Collection
export default {
  title: 'Directives/Mode',
  component: ModeDirectiveDefaultTemplate,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ModeDirectiveDefaultTemplate);

// Stories
export const Default = {
  render: DefaultTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
