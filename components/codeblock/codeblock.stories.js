import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtCodeblock from './codeblock.vue';

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
  parameters: {},
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtCodeblockDefaultTemplate,
);

export const Default = {
  render: DefaultTemplate,

  args: {
    text: 'function someFunction() {\n  return "some result";\n}',
  },
};
