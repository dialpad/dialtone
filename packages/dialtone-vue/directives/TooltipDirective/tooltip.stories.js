import { createTemplateFromVueFile } from '@/common/StorybookUtils.js';
import TooltipDirectiveDefaultTemplate from './TooltipDirectiveDefault.story.vue';

export const argsData = {};

export const argTypesData = {};

// Story Collection
export default {
  title: 'Directives/Tooltip',
  component: TooltipDirectiveDefaultTemplate,
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
