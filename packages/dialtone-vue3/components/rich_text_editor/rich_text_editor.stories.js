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
  modelValue: '<p>I am not a standalone component, please use Message Input instead ✌🏽🤖!</p>',
  editable: true,
  inputAriaLabel: 'This is a descriptive label',
  autoFocus: false,
  placeholder: 'Type here...',
  link: true,
  onBlur: action('blur'),
  onInput: action('input'),
  onFocus: action('focus'),
  onEnter: action('enter'),
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
  onEnter: {
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
    modelValue: '<p>The editor can autolink URLs: <a target="_blank" rel="noopener noreferrer nofollow" class="d-link d-wb-break-all" href="http://dialpad.com">dialpad.com</a>, <a target="_blank" rel="noopener noreferrer nofollow" class="d-link d-wb-break-all" href="https://www.dialpad.com/about-us/">https://www.dialpad.com/about-us/</a>, email addresses: <a target="_blank" rel="noopener noreferrer nofollow" class="d-link d-wb-break-all" href="mailto:noreply@dialpad.com">noreply@dialpad.com</a></p>',
  },
};

export const WithMentionSuggestions = {
  ...Default,
  args: {
    modelValue: '<p>The editor can also suggest mentions: <mention-component name="Test Person" avatarsrc="" id="test.person"></mention-component>, <mention-component name="Test Person 2" avatarsrc="" id="test.person2"></mention-component>! and channel suggestions: <channel-component name="dialpad" id="dialpad" locked="false"></channel-component>. The suggestions dropdown will wait 1000ms to simulate an API call.</p>',
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
    allowCodeblock: false,
  },
};
