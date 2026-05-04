import { createTemplateFromVueFile } from '@/common/StorybookUtils';
import { ICON_SIZE_MODIFIERS } from '@/components/icon/IconConstants';
import DtEmoji from './emoji.vue';

import DtEmojiDefaultTemplate from './EmojiDefault.story.vue';
import DtEmojiVariantsTemplate from './EmojiVariants.story.vue';

// Default Prop Values
export const argsData = {
  code: ':smile:',
};

export const argTypesData = {
  size: {
    options: Object.keys(ICON_SIZE_MODIFIERS),
    control: {
      type: 'select',
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

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const CustomEmoji = {
  render: DefaultTemplate,

  args: {
    code: ':shipit:',
  },
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
