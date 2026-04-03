import { createTemplateFromVueFile } from '@/common/storybook_utils.js';
import ScrollbarDirectiveDefaultTemplate from './scrollbar_directive_default.story.vue';

export const argsData = {};

export const argTypesData = {};

// Story Collection
export default {
  title: 'Directives/Scrollbar',
  component: ScrollbarDirectiveDefaultTemplate,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ScrollbarDirectiveDefaultTemplate);

// Stories
export const Default = {
  render: DefaultTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
