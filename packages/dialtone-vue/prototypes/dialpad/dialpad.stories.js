import { createTemplateFromVueFile } from '@/common/StorybookUtils';
import DialpadDefaultTemplate from './DialpadDefault.story.vue';

// Story Collection
export default {
  title: 'Prototypes/Dialpad',
  args: {},
  argTypes: {},
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DialpadDefaultTemplate,
);

export const Default = {
  render: DefaultTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
