import { createTemplateFromVueFile } from '@/common/storybook_utils.js';
import TooltipDirectiveDefaultTemplate from './tooltip_directive_default.story.vue';

export const argsData = {};

export const argTypesData = {};

// Story Collection
export default {
  title: 'Directives/Tooltip',
  component: '<div></div>',
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, TooltipDirectiveDefaultTemplate);

// Stories
export const Default = {
  render: DefaultTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
