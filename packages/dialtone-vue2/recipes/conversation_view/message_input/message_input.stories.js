import { action } from '@storybook/addon-actions';
import { createRenderConfig, getIconNames } from '@/common/storybook_utils';
import DtRecipeMessageInput from './message_input.vue';
import DtRecipeMessageInputDefaultTemplate from './message_input_default.story.vue';
import mentionSuggestion from '@/components/rich_text_editor/mention_suggestion';
import channelSuggestion from '@/components/rich_text_editor/channel_suggestion';
import slashCommandSuggestion from '@/components/rich_text_editor/slash_command_suggestion';

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
};

// Set default values at the story level here.
export const argsData = {
  value: 'Always the Padawan, never the Jedi.',
  top: '',
  middle: '',
  emojiGiphyPicker: '',
  sendButton: '',
  smsCount: '',
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
  sendIcon: undefined,
  showCharacterLimit: {
    count: 1000,
    warning: 500,
    message: 'You have exceeded the character limit',
  },
  showSend: {
    ariaLabel: 'send',
    tooltipLabel: 'Send',
  },
  mentionSuggestion,
  channelSuggestion,
  slashCommandSuggestion,
  onSubmit: action('submit'),
  onFocus: action('focus'),
  onBlur: action('blur'),
  onInput: action('input'),
  onSelectMedia: action('select-media'),
  onSelectedEmoji: action('selected-emoji'),
  onSelectedCommand: action('selected-command'),
  onMeetingPillClose: action('meeting-pill-close'),
  onAddMedia: action('add-media'),
  onPasteMedia: action('paste-media'),
  onNoticeClose: action('notice-close'),
  onSkinTone: action('skin-tone'),
  onCancel: action('cancel'),
};

// Story Collection
export default {
  title: 'Recipes/Conversation View/Message Input',
  component: DtRecipeMessageInput,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Stories
export const Default = {
  render: (argsData) => createRenderConfig(DtRecipeMessageInput, DtRecipeMessageInputDefaultTemplate, argsData),
};

export const SendButtonWithText = {
  render: (argsData) => createRenderConfig(DtRecipeMessageInput, DtRecipeMessageInputDefaultTemplate, argsData),
  args: {
    ...argsData,
    showSend: {
      text: 'Save',
    },
  },
};

export const InitializeWithLineBreaks = {
  render: (argsData) => createRenderConfig(DtRecipeMessageInput, DtRecipeMessageInputDefaultTemplate, argsData),
  args: {
    value: 'Always the Padawan,\n never the Jedi.',
  },
};

export const WithoutExtensions = {
  render: (argsData) => createRenderConfig(DtRecipeMessageInput, DtRecipeMessageInputDefaultTemplate, argsData),
  args: {
    allowBlockquote: false,
    allowBold: false,
    allowBulletList: false,
    allowItalic: false,
    allowStrike: false,
    allowUnderline: false,
    allowCodeblock: false,
  },
};

export const WithMeetingPill = {
  render: (argsData) => createRenderConfig(DtRecipeMessageInput, DtRecipeMessageInputDefaultTemplate, argsData),
  args: {
    slashCommandSuggestion: {
      items: ({ query }) => {
        return [
          {
            command: 'dpm',
            description: 'Start a Dialpad Meeting',
          },
        ];
      },
    },
    value: '<meeting-pill text="Start a meeting" close-button-aria-label="Delete meeting pill"/>',
    preventTyping: true,
  },
};
