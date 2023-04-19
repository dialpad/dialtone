import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRichTextEditor from './rich_text_editor';
import DtRichTextEditorMdx from './rich_text_editor.mdx';
import DtRichTextEditorDefaultTemplate from './rich_text_editor_default.story.vue';
import {
  RICH_TEXT_EDITOR_OUTPUT_FORMATS,
  RICH_TEXT_EDITOR_AUTOFOCUS_TYPES,
} from './rich_text_editor_constants';

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
    defaultValue: false,
    table: {
      defaultValue: {
        summary: false,
      },
    },
  },

  outputFormat: {
    control: 'select',
    options: Object.values(RICH_TEXT_EDITOR_OUTPUT_FORMATS),
    defaultValue: 'text',
    table: {
      defaultValue: {
        summary: 'text',
      },
    },
  },

  value: {
    control: 'text',
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

// Default Prop Values
export const argsData = {
  value: `I’m not a standalone component, please use Message Input instead 🙏!`,
  editable: true,
  inputAriaLabel: 'This is a descriptive label',
  autoFocus: false,
  onBlur: action('blur'),
  onInput: action('input'),
  onFocus: action('focus'),
};

// Story Collection
export default {
  title: 'Components/Rich Text Editor',
  component: DtRichTextEditor,
  argTypes: argTypesData,
  args: argsData,
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtRichTextEditorMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRichTextEditorDefaultTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
