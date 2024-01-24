import { createRenderConfig } from '@/common/storybook_utils';
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

export const Default = {
  render: (argsData) => createRenderConfig(DtCodeblock, DtCodeblockDefaultTemplate, argsData),

  args: {
    text: 'function someFunction() {\n  return "some result";\n}',
  },
};
