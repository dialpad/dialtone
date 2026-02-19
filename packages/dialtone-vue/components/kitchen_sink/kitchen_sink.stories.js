import KitchenSinkTemplate from './kitchen_sink.story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';

export default {
  title: 'Kitchen Sink',
  tags: ['!autodocs'],
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    percy: { skip: true },
  },
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, KitchenSinkTemplate);

export const Default = {
  render: Template,
  args: {},
};
