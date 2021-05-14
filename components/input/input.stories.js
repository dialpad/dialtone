import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '../storybook_utils';
import HsInput from './input';
import InputMdx from './input.mdx';
import InputDefault from './input_default.story.vue';

// Controls
export const argTypesData = {
  // Props
  value: {
    control: 'text',
  },
  type: {
    defaultValue: HsInput.props.type.default,
    control: {
      type: 'select',
      options: ['text', 'textarea', 'password', 'email', 'number'],
    },
    table: {
      defaultValue: {
        summary: HsInput.props.type.default,
      },
    },
  },
  messages: {
    control: 'object',
  },
  size: {
    control: {
      type: 'select',
      options: ['xs', 'sm', '', 'lg', 'xl'],
    },
  },
  messagesChildProps: { control: null },

  // Native Props
  placeholder: {
    description: 'native input placeholder',
    table: {
      category: 'native props',
      defaultValue: {
        summary: '\'\'',
      },
    },
    control: 'text',
  },

  // Slots
  label: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },

  description: {
    description: 'slot for description, defaults to description prop',
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },

  icon: {
    table: {
      type: { summary: 'VNode' },
    },
  },

  innerLeft: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'select',
      options: getIconNames(),
    },
  },

  innerRight: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'select',
      options: getIconNames(),
    },
  },

  // Action Event Handlers
  onInput: {
    table: {
      disable: true,
    },
  },

  onClear: {
    table: {
      disable: true,
    },
  },
};

export const argsData = {
  placeholder: 'placeholder',
  label: 'Label',
  onInput: action('input'),
  onClear: action('clear'),
};

const decorator = () => ({
  template: '<div style="width: 500px"><story /></div>',
});

export default {
  title: 'Forms/Input',
  component: HsInput,
  parameters: {
    docs: {
      page: InputMdx,
    },
  },
  decorators: [decorator],
  excludeStories: /.*Data$/,
  argTypes: argTypesData,
  args: argsData,
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, InputDefault);

export const Default = Template.bind({});
Default.parameters = {
  docs: {
    source: {
      code: '<hs-input label="Label" />',
    },
  },
};

export const WithDescription = Template.bind({});
WithDescription.args = {
  label: 'Label',
  description: 'Description',
};

export const WithClearButton = Template.bind({});
WithClearButton.args = {
  label: 'Label',
  showClearButton: true,
};

export const WithWarn = Template.bind({});
WithWarn.args = {
  messages: [{ message: 'This is a warning message', type: 'warning' }],
};
WithWarn.parameters = {
  docs: {
    source: {
      code: '<hs-input :messages="[{ message: \'This is a warning message\', type: \'warning\' }]" />',
    },
  },
};

export const WithError = Template.bind({});
WithError.args = {
  messages: [{ message: 'This is an error message', type: 'error' }],
};
WithError.parameters = {
  docs: {
    source: {
      code: '<hs-input :messages="[{ message: \'This is an error message\', type: \'error\' }]" />',
    },
  },
};

export const WithSuccess = Template.bind({});
WithSuccess.args = {
  messages: [{ message: 'This is a success message', type: 'success' }],
};
WithSuccess.parameters = {
  docs: {
    source: {
      code: '<hs-input :messages="[{ message: \'This is a success message\', type: \'success\' }]" />',
    },
  },
};

export const WithMultipleMessages = Template.bind({});
WithMultipleMessages.args = {
  messages: [
    { message: 'This is the first message', type: 'error' },
    { message: 'This is the second message', type: 'error' },
    { message: 'This is the third message', type: 'error' },
  ],
};

export const ExtraSmall = Template.bind({});
ExtraSmall.args = { size: 'xs' };
export const Small = Template.bind({});
Small.args = { size: 'sm' };
export const Large = Template.bind({});
Large.args = { size: 'lg' };
export const ExtraLarge = Template.bind({});
ExtraLarge.args = { size: 'xl' };
