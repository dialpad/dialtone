import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeEmojiRow from './emoji_row.vue';
import DtRecipeEmojiRowDefaultTemplate from './emoji_row_default.story.vue';

// Default Prop Values
export const argsData = {
  onEmojiClicked: action('emoji-clicked'),
  onEmojiHovered: action('emoji-hovered'),
};

export const sharedEmojiReactionsData = [
  {
    emojiUnicodeOrShortname: '😀',
    isSelected: true,
    ariaLabel: 'Emoji aria label',
    tooltip: 'You reacted with 😀',
    num: 1,
  },
  {
    emojiUnicodeOrShortname: '😒',
    isSelected: false,
    ariaLabel: 'Emoji aria label',
    tooltip: 'You reacted with 😒',
    num: 1,
  },
  {
    emojiUnicodeOrShortname: '🙃',
    isSelected: false,
    ariaLabel: 'Emoji aria label',
    tooltip: 'You reacted with 🙃',
    num: 99,
  },
];

export const argTypesData = {
  // Props
  reactions: {
    table: {
      type: {
        detail: `[{
          "emojiUnicodeOrShortname": string,
          "isSelected": boolean,
          "ariaLabel": string,
          "tooltip": string,
          "num": number,
        }]`,
      },
    },
  },

  // Action Event Handlers
  onEmojiClicked: {
    table: {
      disable: true,
    },
  },
  onEmojiHovered: {
    table: {
      disable: true,
    },
  },
  emojiClicked: {
    table: {
      disable: true,
    },
  },
  emojiHovered: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Recipes/Conversation View/Emoji Row',
  component: DtRecipeEmojiRow,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeEmojiRowDefaultTemplate,
);

// Stories
export const Default = {
  render: DefaultTemplate,

  args: {
    reactions: sharedEmojiReactionsData,
  },
};
