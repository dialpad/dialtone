import { generateTemplate } from '@/common/storybook_utils';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import DtValidationMessages from './validation_messages.vue';

// Constants
const VALIDATION_MESSAGES = [
  {
    message: 'Validation Message',
    type: VALIDATION_MESSAGE_TYPES.SUCCESS,
  },
];

// Default Prop Values
export const argsData = {
  validationMessages: VALIDATION_MESSAGES,
};

// Manual Prop Controls
export const argTypesData = {
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
};

// Story Collection
export default {
  title: 'Components/Validation Messages',
  component: DtValidationMessages,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Validation Messages Template
const baseRadioTemplate = generateTemplate(DtValidationMessages, {});
const Template = (_args, { argTypes }) => {
  return {
    components: { DtValidationMessages },
    template: baseRadioTemplate,
    props: Object.keys(argTypes),
  };
};

export const Default = {
  render: Template,
};

// Variants Story
const VariantsTemplate = () => {
  return {
    components: { DtValidationMessages },
    template: `
      <div id="components-validation-messages--variants-container">
        <dt-validation-messages
          :validationMessages="[{ message: 'With Success Validation Message', type: 'success' }]"
        />
        <br />
        <dt-validation-messages
          :validationMessages="[{ message: 'With Warning Validation Message', type: 'warning' }]"
        />
        <br />
        <dt-validation-messages
          :validationMessages="[{ message: 'With Error Validation Message', type: 'error' }]"
        />
        <br />
      </div>
    `,
  };
};

export const Variants = {
  render: VariantsTemplate,

  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
    },
  },
};
