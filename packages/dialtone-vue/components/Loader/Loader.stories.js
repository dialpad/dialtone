import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtLoader from './Loader.vue';
import DtLoaderDefaultTemplate from './LoaderDefault.story.vue';
import DtLoaderVariantsTemplate from './LoaderVariants.story.vue';
import { ICON_SIZE_MODIFIERS } from '@/components/Icon';

const argTypesData = {
  size: {
    options: Object.keys(ICON_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
};

const argsData = {};

// Story Collection
export default {
  title: 'Components/Loader',
  component: DtLoader,
  args: argsData,
  argTypes: argTypesData,
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtLoaderDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtLoaderVariantsTemplate);

// Stories
export const Default = {
  render: Template,
  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};
