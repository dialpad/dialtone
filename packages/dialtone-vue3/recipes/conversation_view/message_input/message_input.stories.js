import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtRecipeMessageInput from './message_input.vue';
import DtRecipeMessageInputDefaultTemplate from './message_input_default.story.vue';
import mentionSuggestion from '@/components/rich_text_editor/mention_suggestion';
import channelSuggestion from '@/components/rich_text_editor/channel_suggestion';
import slashCommandSuggestion from '@/components/rich_text_editor/slash_command_suggestion';
import customEmojiJson from '@/common/custom-emoji.json';

const iconsList = getIconNames();

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
  // Slots
  emojiGiphyPicker: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  customActionIcons: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  middle: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  sendIcon: {
    table: {
      type: { summary: 'VNode' },
    },
    options: iconsList,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  top: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  sendButton: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  scheduleMessage: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  smsCount: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },

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

  onJsonInput: {
    table: {
      disable: true,
    },
  },

  onHtmlInput: {
    table: {
      disable: true,
    },
  },

  onTextInput: {
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

  onMeetingPillClose: {
    table: {
      disable: true,
    },
  },

  onSelectedCommand: {
    table: {
      disable: true,
    },
  },

  onAddEmoji: {
    table: {
      disable: true,
    },
  },

  onEmojiScrollBottomReached: {
    table: {
      disable: true,
    },
  },
};

// Set default values at the story level here.
export const argsData = {
  modelValue: 'Always the Padawan, never the Jedi.',
  top: '',
  middle: '',
  emojiGiphyPicker: '',
  customActionIcons: '',
  sendButton: '',
  scheduleMessage: '',
  smsCount: '',
  placeholder: 'New message',
  inputAriaLabel: 'Input text field',
  maxHeight: '40vh',
  emojiPickerProps: {
    skinTone: 'Default',
  },
  setLinkPlaceholder: 'e.g. https://www.dialpad.com',
  sendIcon: undefined,
  showCharacterLimit: {
    count: 1000,
    warning: 500,
    message: 'You have exceeded the character limit',
  },
  showSend: {
    text: '',
  },
  mentionSuggestion,
  channelSuggestion,
  slashCommandSuggestion,
  onSubmit: action('submit'),
  onFocus: action('focus'),
  onBlur: action('blur'),
  onInput: action('input'),
  onJsonInput: action('json-input'),
  onHtmlInput: action('html-input'),
  onTextInput: action('text-input'),
  onAddEmoji: action('add-emoji'),
  onSelectMedia: action('select-media'),
  onSelectedEmoji: action('selected-emoji'),
  onSelectedCommand: action('selected-command'),
  onMeetingPillClose: action('meeting-pill-close'),
  onAddMedia: action('add-media'),
  onPasteMedia: action('paste-media'),
  onNoticeClose: action('notice-close'),
  onSkinTone: action('skin-tone'),
  onCancel: action('cancel'),
  onEmojiScrollBottomReached: action('emoji-scroll-bottom-reached'),
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

export const SendButtonWithText = {
  render: DefaultTemplate,
  args: {
    ...argsData,
    showSend: {
      text: 'Save',
    },
  },
};

export const InitializeWithLineBreaks = {
  render: DefaultTemplate,
  args: {
    modelValue: 'Always the Padawan,\n never the Jedi.',
  },
};

export const WithoutExtensions = {
  render: DefaultTemplate,
  args: {
    richText: false,
  },
};

export const WithMeetingPill = {
  render: DefaultTemplate,
  args: {
    slashCommandSuggestion: {
      items: () => {
        return [
          {
            command: 'dpm',
            description: 'Start a Dialpad Meeting',
          },
        ];
      },
    },
    modelValue: '<meeting-pill text="Start a meeting"/>',
    preventTyping: true,
  },
};

export const WithCustomEmoji = {
  render: DefaultTemplate,
  args: {
    value: 'This is a test with custom emojis',
    emojiPickerProps: {
      skinTone: 'Default',
      customEmojis: customEmojiJson,
    },
  },
};
