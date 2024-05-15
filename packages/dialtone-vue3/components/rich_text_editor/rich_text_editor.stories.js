import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRichTextEditor from './rich_text_editor.vue';
import DtRichTextEditorDefaultTemplate from './rich_text_editor_default.story.vue';
import {
  RICH_TEXT_EDITOR_OUTPUT_FORMATS,
  RICH_TEXT_EDITOR_AUTOFOCUS_TYPES,
} from './rich_text_editor_constants';

import mentionSuggestion from './mention_suggestion';
import channelSuggestion from './channel_suggestion';
import slashCommandSuggestion from './slash_command_suggestion';

// Default Prop Values
export const argsData = {
  modelValue: `I am not a standalone component, please use Message Input instead :v_tone3::robot:!`,
  editable: true,
  inputAriaLabel: 'This is a descriptive label',
  outputFormat: 'text',
  autoFocus: false,
  placeholder: 'Type here...',
  link: true,
  onBlur: action('blur'),
  onInput: action('input'),
  onFocus: action('focus'),
};

export const argTypesData = {
  editable: {
    control: 'boolean',
  },

  inputClass: {
    control: 'text',
  },

  autoFocus: {
    control: 'select',
    options: [...Object.values(RICH_TEXT_EDITOR_AUTOFOCUS_TYPES), false, true],
    table: {
      defaultValue: {
        summary: false,
      },
    },
  },

  outputFormat: {
    control: 'select',
    options: Object.values(RICH_TEXT_EDITOR_OUTPUT_FORMATS),
    table: {
      defaultValue: {
        summary: 'text',
      },
    },
  },

  modelValue: {
    control: 'text',
  },

  link: {
    control: 'boolean',
  },

  // Directives
  'v-model': {
    description: 'Supported by this component',
    control: null,
    table: {
      category: 'directives',
    },
  },

  // Action Event Handlers
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
  onFocus: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Components/Rich Text Editor',
  component: DtRichTextEditor,
  argTypes: argTypesData,
  args: argsData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRichTextEditorDefaultTemplate,
);

export const Default = {
  render: DefaultTemplate,
};

export const WithLinks = {
  ...Default,
  args: {
    link: true,
    modelValue: 'The editor can autolink URLs: dialpad.com, https://www.dialpad.com/about-us/, ' +
    'IP addresses: 192.158.1.38, email addresses: noreply@dialpad.com and phone numbers: (778) 765-8813, +17787658813!',
  },
};

export const WithMentionSuggestions = {
  ...Default,
  args: {
    modelValue: 'The editor can also suggest mentions: @test.person, @test.person2! and channel suggestions: #dialpad.',
    mentionSuggestion,
    channelSuggestion,
    slashCommandSuggestion,
  },
};

export const WithCustomExtensions = {
  ...Default,
  args: {
    allowBlockquote: false,
    allowBold: false,
    allowBulletList: false,
    allowItalic: false,
    allowStrike: false,
    allowUnderline: false,
  },
};
