import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtCodeblock from './codeblock.vue';

import DtCodeblockDefaultTemplate from './codeblock_default.story.vue';
import DtCodeblockVariantsTemplate from './codeblock_variants.story.vue';

export const argTypesData = {
  // Props
  text: {
    description: 'The text to include in the codeblock',
    control: {
      type: 'text',
    },
  },
  bordered: {
    control: { type: 'boolean' },
  },

  size: {
    control: { type: 'select' },
    options: ['xs', 'sm', 'md', 'lg'],
  },
};

// Story Collection
export default {
  title: 'Components/Codeblock',
  component: DtCodeblock,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtCodeblockDefaultTemplate,
);

const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtCodeblockVariantsTemplate,
);

export const Default = {
  render: DefaultTemplate,

  args: {
    text: 'function someFunction() {\n  return "some result";\n}',
    bordered: false,
    size: 'sm',
  },
};

export const Variants = {
  render: VariantsTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
