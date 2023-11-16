import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeMessageInput from './message_input.vue';
import DtRecipeMessageInputDefaultTemplate from './message_input_default.story.vue';

import { NOTICE_KINDS } from '@/components/notice/notice_constants';

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
  // Props
  noticeKind: {
    options: NOTICE_KINDS,
    control: {
      type: 'select',
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

  onCancel: {
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
  noticeMessage: 'Files must be less than 32 MB to be sent as Dialpad messages.',
  maxHeight: '40vh',
  characterLimitWarningMessage: 'You have reached the character limit.',
  isEdit: false,
  onSubmit: action('submit'),
  onFocus: action('focus'),
  onBlur: action('blur'),
  onInput: action('input'),
  onSelectMedia: action('select-media'),
  onAddMedia: action('add-media'),
  onNoticeClose: action('notice-close'),
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
