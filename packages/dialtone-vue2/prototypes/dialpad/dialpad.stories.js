import { createRenderConfig } from '@/common/storybook_utils';
import DialpadLayout from './dialpad_layout.vue';
import DialpadDefaultTemplate from './dialpad_default.story.vue';

// Story Collection
export default {
  title: 'Prototypes/Dialpad',
  component: DialpadLayout,
  args: {},
  argTypes: {},
  excludeStories: /.*Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(DialpadLayout, DialpadDefaultTemplate, argsData),
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
