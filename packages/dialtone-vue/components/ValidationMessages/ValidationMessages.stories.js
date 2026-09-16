import { ref } from 'vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import DtValidationMessages from './ValidationMessages.vue';
import DtInput from '@/components/Input/Input.vue';
import DtSelectMenu from '@/components/SelectMenu/SelectMenu.vue';
import DtRadioGroup from '@/components/RadioGroup/RadioGroup.vue';
import DtRadio from '@/components/Radio/Radio.vue';
import DtCheckboxGroup from '@/components/CheckboxGroup/CheckboxGroup.vue';
import DtCheckbox from '@/components/Checkbox/Checkbox.vue';
import DtStack from '@/components/Stack/Stack.vue';
import DtButton from '@/components/Button/Button.vue';
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
  iconClass: {
    description: 'Additional class name for the icon wrapper element.',
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
        <dt-validation-messages
          :validationMessages="[{ message: 'With Info Validation Message', type: 'info' }]"
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

const InteractiveFormTemplate = () => {
  return {
    components: { DtInput, DtSelectMenu, DtRadioGroup, DtRadio, DtCheckboxGroup, DtCheckbox, DtStack, DtButton },
    setup () {
      const nameValue = ref('');
      const emailValue = ref('');
      const usernameValue = ref('');
      const countryValue = ref('');
      const contactValue = ref('');
      const interestsValue = ref([]);

      const nameMessages = ref([]);
      const emailMessages = ref([]);
      const usernameMessages = ref([]);
      const countryMessages = ref([]);
      const contactMessages = ref([]);
      const interestsMessages = ref([]);

      const usernameChecking = ref(false);

      function validateName () {
        if (!nameValue.value) {
          nameMessages.value = [{ message: 'Name is required', type: VALIDATION_MESSAGE_TYPES.CRITICAL }];
        } else if (nameValue.value.length < 2) {
          nameMessages.value = [{ message: 'Name must be at least 2 characters', type: VALIDATION_MESSAGE_TYPES.CRITICAL }];
        } else {
          nameMessages.value = [{ message: 'Looks good!', type: VALIDATION_MESSAGE_TYPES.POSITIVE }];
        }
      }

      function validateEmail () {
        if (!emailValue.value) {
          emailMessages.value = [{ message: 'Email is required', type: VALIDATION_MESSAGE_TYPES.CRITICAL }];
        } else if (!/.+@.+\..+/.test(emailValue.value)) {
          emailMessages.value = [{ message: 'Please enter a valid email address', type: VALIDATION_MESSAGE_TYPES.CRITICAL }];
        } else {
          emailMessages.value = [{ message: 'Email looks good!', type: VALIDATION_MESSAGE_TYPES.POSITIVE }];
        }
      }

      let usernameTimer = null;

      function validateUsername () {
        clearTimeout(usernameTimer);
        usernameMessages.value = [{ message: 'Checking availability…', type: VALIDATION_MESSAGE_TYPES.INFO }];
        usernameChecking.value = true;

        usernameTimer = setTimeout(() => {
          usernameChecking.value = false;
          if (!usernameValue.value) {
            usernameMessages.value = [{ message: 'Username is required', type: VALIDATION_MESSAGE_TYPES.CRITICAL }];
          } else if (usernameValue.value.includes('taken')) {
            usernameMessages.value = [{ message: 'Username already taken', type: VALIDATION_MESSAGE_TYPES.CRITICAL }];
          } else {
            usernameMessages.value = [{ message: 'Username is available', type: VALIDATION_MESSAGE_TYPES.POSITIVE }];
          }
        }, 1500);
      }

      function validateCountry () {
        if (!countryValue.value) {
          countryMessages.value = [{ message: 'Please select a country', type: VALIDATION_MESSAGE_TYPES.CRITICAL }];
        } else {
          countryMessages.value = [{ message: 'Country selected', type: VALIDATION_MESSAGE_TYPES.POSITIVE }];
        }
      }

      function validateContact (value) {
        if (!value) {
          contactMessages.value = [{ message: 'Please select a contact method', type: VALIDATION_MESSAGE_TYPES.CRITICAL }];
        } else {
          contactMessages.value = [{ message: 'Contact method selected', type: VALIDATION_MESSAGE_TYPES.POSITIVE }];
        }
      }

      function validateInterests (value) {
        if (!value || value.length === 0) {
          interestsMessages.value = [{ message: 'Please select at least one interest', type: VALIDATION_MESSAGE_TYPES.CRITICAL }];
        } else {
          interestsMessages.value = [{ message: `${value.length} interest(s) selected`, type: VALIDATION_MESSAGE_TYPES.POSITIVE }];
        }
      }

      function clearAll () {
        clearTimeout(usernameTimer);
        nameValue.value = '';
        emailValue.value = '';
        usernameValue.value = '';
        countryValue.value = '';
        contactValue.value = '';
        interestsValue.value = [];
        nameMessages.value = [];
        emailMessages.value = [];
        usernameMessages.value = [];
        countryMessages.value = [];
        contactMessages.value = [];
        interestsMessages.value = [];
        usernameChecking.value = false;
      }

      return {
        nameValue,
        emailValue,
        usernameValue,
        countryValue,
        contactValue,
        interestsValue,
        nameMessages,
        emailMessages,
        usernameMessages,
        countryMessages,
        contactMessages,
        interestsMessages,
        usernameChecking,
        validateName,
        validateEmail,
        validateUsername,
        validateCountry,
        validateContact,
        validateInterests,
        clearAll,
      };
    },
    template: `
      <dt-stack direction="column" gap="500" style="max-width: 400px">
        <dt-input
          v-model="nameValue"
          label="Name"
          placeholder="Enter your name"
          :messages="nameMessages"
          @blur="validateName"
        />
        <dt-input
          v-model="emailValue"
          label="Email"
          placeholder="Enter your email"
          type="email"
          :messages="emailMessages"
          @blur="validateEmail"
        />
        <dt-input
          v-model="usernameValue"
          label="Username"
          placeholder="Enter a username (try 'taken')"
          :disabled="usernameChecking"
          :messages="usernameMessages"
          @blur="validateUsername"
        />
        <dt-select-menu
          v-model="countryValue"
          label="Country"
          :messages="countryMessages"
          :options="[
            { value: 'ca', label: 'Canada' },
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
          ]"
          @update:model-value="validateCountry"
        />
        <dt-radio-group
          v-model="contactValue"
          name="contact"
          legend="Preferred contact"
          :messages="contactMessages"
          @update:model-value="validateContact"
        >
          <dt-radio value="email" label="Email" />
          <dt-radio value="phone" label="Phone" />
          <dt-radio value="sms" label="SMS" />
        </dt-radio-group>
        <dt-checkbox-group
          v-model="interestsValue"
          name="interests"
          legend="Interests"
          :messages="interestsMessages"
          @update:model-value="validateInterests"
        >
          <dt-checkbox value="design" label="Design" />
          <dt-checkbox value="engineering" label="Engineering" />
          <dt-checkbox value="product" label="Product" />
        </dt-checkbox-group>
        <dt-button kind="muted" importance="outlined" @click="clearAll">Clear</dt-button>
      </dt-stack>
    `,
  };
};

export const InteractiveForm = {
  render: InteractiveFormTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    docs: {
      description: {
        story: 'Interactive form to verify VoiceOver announces validation messages (DLT-3430). Enable VoiceOver (Cmd+F5), tab through the fields, and blur each one to trigger messages. The live-region container is always present in the DOM so VoiceOver detects mutations on a stable node.',
      },
    },
  },
};
