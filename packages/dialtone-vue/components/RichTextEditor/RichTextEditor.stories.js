import { action } from 'storybook/actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRichTextEditor from './RichTextEditor.vue';
import DtRichTextEditorDefaultTemplate from './RichTextEditorDefault.story.vue';
import {
  RICH_TEXT_EDITOR_OUTPUT_FORMATS,
  RICH_TEXT_EDITOR_AUTOFOCUS_TYPES,
} from './RichTextEditorConstants';

import mentionSuggestion from './MentionSuggestion';
import channelSuggestion from './ChannelSuggestion';
import slashCommandSuggestion from './SlashCommandSuggestion';

// Default Prop Values
export const argsData = {
  modelValue: '<p>I am not a standalone component, please use Message Input instead ✌🏽🤖!</p>',
  editable: true,
  inputAriaLabel: 'This is a descriptive label',
  autoFocus: false,
  placeholder: 'Type here...',
  link: true,
  onBlur: action('blur'),
  'onUpdate:modelValue': action('update:modelValue'),
  onFocus: action('focus'),
  onEnter: action('enter'),
  onJsonInput: action('json-input'),
  onHtmlInput: action('html-input'),
  onTextInput: action('text-input'),
  onMarkdownInput: action('markdown-input'),
  onPhoneClick: action('phone-click'),
  onEditLink: action('edit-link'),
  onSelectedCommand: action('selected-command'),
  onMentionClick: action('mention-click'),
  onMentionHover: action('mention-hover'),
  onMentionLeave: action('mention-leave'),
  onChannelClick: action('channel-click'),
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
  'onUpdate:modelValue': {
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
  onMarkdownInput: {
    table: {
      disable: true,
    },
  },
  onPhoneClick: {
    table: {
      disable: true,
    },
  },
  onEditLink: {
    table: {
      disable: true,
    },
  },
  onSelectedCommand: {
    table: {
      disable: true,
    },
  },
  onMentionClick: {
    table: {
      disable: true,
    },
  },
  onChannelClick: {
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
    allowCode: false,
    allowCodeblock: false,
    link: false,
    useDivTags: false,
  },
};

export const WithLinkedPhoneNumbers = {
  ...Default,
  args: {
    editable: false,
    modelValue: '<p>You can reach our support team at (714) 410-7035 or toll-free at (800) 555-0199. Click either number to handle the call.</p>',
    linkPhoneNumbers: ['(714) 410-7035', '(800) 555-0199'],
  },
};

export const WithSignatureFeatures = {
  ...Default,
  args: {
    modelValue: '<p>This editor has signature features enabled: font controls, tables, inline images with resizing, and variables.</p>',
    allowFontColor: true,
    allowBackgroundColor: true,
    allowFontSize: true,
    allowFontFamily: true,
    allowLineHeight: true,
    allowTables: true,
    allowInlineImages: true,
    allowImageResize: true,
    allowVariable: true,
    useDivTags: true,
  },
};
