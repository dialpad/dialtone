import { createTemplateFromVueFile } from '@/common/storybook_utils';
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

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const CustomEmoji = DefaultTemplate.bind({});
CustomEmoji.args = {
  code: ':shipit:',
};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { options: { showPanel: false }, controls: { disable: true } };
