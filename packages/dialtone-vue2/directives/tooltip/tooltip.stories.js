import { createRenderConfig } from '@/common/storybook_utils.js';
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

// Stories
export const Default = {
  render: (argsData) => createRenderConfig('<div></div>', TooltipDirectiveDefaultTemplate, argsData),
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
