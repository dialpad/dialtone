import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import DtValidationMessages from './ValidationMessages.vue';
import {
  DtIconBell,
} from '@dialpad/dialtone-icons/vue';

// Constants
const VALIDATION_MESSAGES = [
  {
    message: 'Validation Message',
    type: VALIDATION_MESSAGE_TYPES.POSITIVE,
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
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtValidationMessages);

export const Default = {
  render: DefaultTemplate,
};

// Variants Story
const VariantsTemplate = () => {
  return {
    components: { DtValidationMessages },
    template: `
      <div id="components-validation-messages--variants-container">
        <dt-validation-messages
          :validationMessages="[{ message: 'With Positive Validation Message', type: 'positive' }]"
        />
        <br />
        <dt-validation-messages
          :validationMessages="[{ message: 'With Warning Validation Message', type: 'warning' }]"
        />
        <br />
        <dt-validation-messages
          :validationMessages="[{ message: 'With Critical Validation Message', type: 'critical' }]"
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

const WithCustomIconTemplate = () => {
  return {
    components: { DtValidationMessages, DtIconBell },
    template: `
      <dt-validation-messages
        :validationMessages="[{ message: 'Custom icon override', type: 'warning' }]"
      >
        <template #icon>
          <dt-icon-bell size="300" />
        </template>
      </dt-validation-messages>
    `,
  };
};

export const WithCustomIcon = {
  render: WithCustomIconTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
