import { createRenderConfig } from '@/common/storybook_utils';
import { ICON_SIZE_MODIFIERS } from '@/components/icon/icon_constants';
import DtEmoji from './emoji.vue';

import DtEmojiDefaultTemplate from './emoji_default.story.vue';
import DtEmojiVariantsTemplate from './emoji_variants.story.vue';

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
  showSkeleton: {
    control: {
      type: 'boolean',
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

export const Default = {
  render: (argsData) => createRenderConfig(DtEmoji, DtEmojiDefaultTemplate, argsData),
  args: {},
};

export const CustomEmoji = {
  render: (argsData) => createRenderConfig(DtEmoji, DtEmojiDefaultTemplate, argsData),

  args: {
    code: ':shipit:',
  },
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtEmoji, DtEmojiVariantsTemplate, argsData),
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
