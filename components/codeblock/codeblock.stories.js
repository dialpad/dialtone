import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtCodeblock from './codeblock';
import DtCodeblockMdx from './codeblock.mdx';
import DtCodeblockDefaultTemplate from './codeblock_default.story.vue';

export const argTypesData = {
  // Props
  text: {
    description: 'The text to include in the codeblock',
    control: {
      type: 'text',
    },
  },
};

// Story Collection
export default {
  title: 'Components/Codeblock',
  component: DtCodeblock,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      page: DtCodeblockMdx,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtCodeblockDefaultTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  text: 'function someFunction() {\n  return "some result";\n}',
};
