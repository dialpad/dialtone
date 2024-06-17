import DtIllustration from './illustration.vue';
import DtIllustrationDefaultTemplate from './illustration_default.story.vue';
import { createTemplateFromVueFile, getIllustrationNames } from '@/common/storybook_utils';

const illustrationsList = getIllustrationNames();

export const argTypesData = {
  name: {
    options: illustrationsList,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
};

export const argsData = {};

export default {
  title: 'Components/Illustration',
  component: DtIllustration,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtIllustrationDefaultTemplate,
);

export const Default = {
  render: DefaultTemplate,

  args: {
    name: 'mind',
  },
};
