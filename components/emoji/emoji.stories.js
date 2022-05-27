import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { EMOJI_SIZES } from './emoji_constants';
import DtEmoji from './emoji';
import DtEmojiMdx from './emoji.mdx';
import DtEmojiDefaultTemplate from './emoji_default.story.vue';
import DtEmojiVariantsTemplate from './emoji_variants.story.vue';

// Default Prop Values
export const argsData = {
  code: ':smile:',
};

export const argTypesData = {
  size: {
    control: {
      type: 'select',
      options: Object.values(EMOJI_SIZES),
    },
    defaultValue: EMOJI_SIZES.SIZE_20,
    table: {
      defaultValue: {
        summary: EMOJI_SIZES.SIZE_20,
      },
    },
  },
};

// Story Collection
export default {
  title: 'Components/Emoji',
  component: DtEmoji,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtEmojiMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtEmojiDefaultTemplate,
);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtEmojiVariantsTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
