import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DialpadDefaultTemplate from './dialpad_default.story.vue';

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
