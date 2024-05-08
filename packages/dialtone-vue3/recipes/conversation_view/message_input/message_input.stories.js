import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeMessageInput from './message_input.vue';
import DtRecipeMessageInputDefaultTemplate from './message_input_default.story.vue';
import mentionSuggestion from '@/components/rich_text_editor/mention_suggestion';
import channelSuggestion from '@/components/rich_text_editor/channel_suggestion';

/*
  Controls
  ========

  Here we define any custom configuration for props / slots / events in storybook

  By default storybook will display any props / slots / events from the associated component. It will also use jsdoc
  comments on the component to populate details such as description and default value. You should only enter config
  here if it was not possible to add into the jsdoc of the component itself.

  See https://storybook.js.org/docs/vue/api/argtypes#manual-specification

  To set the description of a slot, add the below comment to the line above where the slot is defined:
  <!-- @slot example slot decorator -->
*/

export const argTypesData = {
  // Events
  onSubmit: {
    table: {
      disable: true,
    },
  },

  onFocus: {
    table: {
      disable: true,
    },
  },

  onBlur: {
    table: {
      disable: true,
    },
  },

  onInput: {
    table: {
      disable: true,
    },
  },

  onAddMedia: {
    table: {
      disable: true,
    },
  },

  onPasteMedia: {
    table: {
      disable: true,
    },
  },

  onNoticeClose: {
    table: {
      disable: true,
    },
  },

  onSelectMedia: {
    table: {
      disable: true,
    },
  },

  onSelectedEmoji: {
    table: {
      disable: true,
    },
  },

  onCancel: {
    table: {
      disable: true,
    },
  },

  onSkinTone: {
    table: {
      disable: true,
    },
  },
};

// Set default values at the story level here.
export const argsData = {
  modelValue: 'Always the Padawan, never the Jedi.',
  placeholder: 'New message',
  inputAriaLabel: 'Input text field',
  maxHeight: '40vh',
  emojiPickerProps: {
    searchNoResultsLabel: 'No results',
    searchResultsLabel: 'Search results',
    searchPlaceholderLabel: 'Search...',
    skinSelectorButtonTooltipLabel: 'Change default skin tone',
    tabSetLabels: [
      'Most recently used',
      'Smileys and people',
      'Nature',
      'Food',
      'Activity',
      'Travel',
      'Objects',
      'Symbols',
      'Flags',
    ],
    skinTone: 'Default',
  },
  showCharacterLimit: {
    count: 1000,
    warning: 500,
    message: 'You have exceeded the character limit',
  },
  showSend: {
    icon: 'send',
    ariaLabel: 'send',
  },
  mentionSuggestion,
  channelSuggestion,
  onSubmit: action('submit'),
  onFocus: action('focus'),
  onBlur: action('blur'),
  onInput: action('input'),
  onSelectMedia: action('select-media'),
  onSelectedEmoji: action('selected-emoji'),
  onAddMedia: action('add-media'),
  onPasteMedia: action('paste-media'),
  onNoticeClose: action('notice-close'),
  onSkinTone: action('skin-tone'),
  onCancel: action('cancel'),
  onHandleKeydown: action('keydown'),
};

// Story Collection
export default {
  title: 'Recipes/Conversation View/Message Input',
  component: DtRecipeMessageInput,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeMessageInputDefaultTemplate,
);

// Stories
export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const WithoutExtensions = {
  render: DefaultTemplate,
  args: {
    allowBlockquote: false,
    allowBold: false,
    allowBulletList: false,
    allowItalic: false,
    allowStrike: false,
    allowUnderline: false,
  },
};
