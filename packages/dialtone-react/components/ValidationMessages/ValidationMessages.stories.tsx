import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import type { ValidationMessage } from '../../common/utils';
import { DtButton } from '../Button/Button';
import { DtCheckbox } from '../Checkbox/Checkbox';
import { DtCheckboxGroup } from '../CheckboxGroup/CheckboxGroup';
import { DtInput } from '../Input/Input';
import { DtRadio } from '../Radio/Radio';
import { DtRadioGroup } from '../RadioGroup/RadioGroup';
import { DtIconBell } from '../../icons';
import { DtSelectMenu } from '../SelectMenu/SelectMenu';
import { DtStack } from '../Stack/Stack';
import { DtValidationMessages, type DtValidationMessagesProps } from './ValidationMessages';

// Constants
const VALIDATION_MESSAGES: ValidationMessage[] = [
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
} satisfies Meta<DtValidationMessagesProps>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Validation Messages',
  component: DtValidationMessages,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<DtValidationMessagesProps>;

export default meta;
type Story = StoryObj<DtValidationMessagesProps>;

// Vue's Default renders the component itself with the args, not ValidationMessagesDefault.story.vue.
export const Default: Story = {
  render: args => <DtValidationMessages {...args} />,
};

// Variants Story
export const Variants: Story = {
  render: () => (
    <div id="components-validation-messages--variants-container">
      <DtValidationMessages
        validationMessages={[{ message: 'With Positive Validation Message', type: 'positive' }]}
      />
      <br />
      <DtValidationMessages
        validationMessages={[{ message: 'With Warning Validation Message', type: 'warning' }]}
      />
      <br />
      <DtValidationMessages
        validationMessages={[{ message: 'With Critical Validation Message', type: 'critical' }]}
      />
      <br />
      <DtValidationMessages
        validationMessages={[{ message: 'With Info Validation Message', type: 'info' }]}
      />
      <br />
    </div>
  ),

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

export const WithCustomIcon: Story = {
  render: () => (
    <DtValidationMessages
      validationMessages={[{ message: 'Custom icon override', type: 'warning' }]}
      icon={<DtIconBell size="300" />}
    />
  ),
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};

const COUNTRY_OPTIONS = [
  { value: 'ca', label: 'Canada' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
];
const CONTACT_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'sms', label: 'SMS' },
];
const INTEREST_OPTIONS = [
  { value: 'design', label: 'Design', messagesId: 'dt12' },
  { value: 'engineering', label: 'Engineering', messagesId: 'dt13' },
  { value: 'product', label: 'Product', messagesId: 'dt14' },
];

function InteractiveFormTemplate () {
  const [nameValue, setNameValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [usernameValue, setUsernameValue] = useState('');
  const [countryValue, setCountryValue] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [interestsValue, setInterestsValue] = useState<string[]>([]);

  const [nameMessages, setNameMessages] = useState<ValidationMessage[]>([]);
  const [emailMessages, setEmailMessages] = useState<ValidationMessage[]>([]);
  const [usernameMessages, setUsernameMessages] = useState<ValidationMessage[]>([]);
  const [countryMessages, setCountryMessages] = useState<ValidationMessage[]>([]);
  const [contactMessages, setContactMessages] = useState<ValidationMessage[]>([]);
  const [interestsMessages, setInterestsMessages] = useState<ValidationMessage[]>([]);

  const [usernameChecking, setUsernameChecking] = useState(false);
  const usernameTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(usernameTimer.current), []);

  function validateName () {
    if (!nameValue) {
      setNameMessages([{ message: 'Name is required', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]);
    } else if (nameValue.length < 2) {
      setNameMessages([{ message: 'Name must be at least 2 characters', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]);
    } else {
      setNameMessages([{ message: 'Looks good!', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]);
    }
  }

  function validateEmail () {
    if (!emailValue) {
      setEmailMessages([{ message: 'Email is required', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]);
    } else if (!/.+@.+\..+/.test(emailValue)) {
      setEmailMessages([{ message: 'Please enter a valid email address', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]);
    } else {
      setEmailMessages([{ message: 'Email looks good!', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]);
    }
  }

  function validateUsername () {
    clearTimeout(usernameTimer.current);
    setUsernameMessages([{ message: 'Checking availability…', type: VALIDATION_MESSAGE_TYPES.INFO }]);
    setUsernameChecking(true);

    // The value as it was on blur, as in Vue (the field is disabled while checking).
    const value = usernameValue;
    usernameTimer.current = setTimeout(() => {
      setUsernameChecking(false);
      if (!value) {
        setUsernameMessages([{ message: 'Username is required', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]);
      } else if (value.includes('taken')) {
        setUsernameMessages([{ message: 'Username already taken', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]);
      } else {
        setUsernameMessages([{ message: 'Username is available', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]);
      }
    }, 1500);
  }

  function validateCountry (value: string) {
    if (!value) {
      setCountryMessages([{ message: 'Please select a country', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]);
    } else {
      setCountryMessages([{ message: 'Country selected', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]);
    }
  }

  function validateContact (value: string) {
    if (!value) {
      setContactMessages([{ message: 'Please select a contact method', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]);
    } else {
      setContactMessages([{ message: 'Contact method selected', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]);
    }
  }

  function validateInterests (value: string[]) {
    if (!value || value.length === 0) {
      setInterestsMessages([{ message: 'Please select at least one interest', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]);
    } else {
      setInterestsMessages([{ message: `${value.length} interest(s) selected`, type: VALIDATION_MESSAGE_TYPES.POSITIVE }]);
    }
  }

  function clearAll () {
    clearTimeout(usernameTimer.current);
    setNameValue('');
    setEmailValue('');
    setUsernameValue('');
    setCountryValue('');
    setContactValue('');
    setInterestsValue([]);
    setNameMessages([]);
    setEmailMessages([]);
    setUsernameMessages([]);
    setCountryMessages([]);
    setContactMessages([]);
    setInterestsMessages([]);
    setUsernameChecking(false);
  }

  const inputs: {
    label: string;
    placeholder: string;
    type: 'text' | 'email';
    value: string;
    setValue: (value: string) => void;
    messages: ValidationMessage[];
    onBlur: () => void;
    disabled: boolean;
  }[] = [
    { label: 'Name', placeholder: 'Enter your name', type: 'text', value: nameValue, setValue: setNameValue, messages: nameMessages, onBlur: validateName, disabled: false },
    { label: 'Email', placeholder: 'Enter your email', type: 'email', value: emailValue, setValue: setEmailValue, messages: emailMessages, onBlur: validateEmail, disabled: false },
    { label: 'Username', placeholder: "Enter a username (try 'taken')", type: 'text', value: usernameValue, setValue: setUsernameValue, messages: usernameMessages, onBlur: validateUsername, disabled: usernameChecking },
  ];

  return (
    <DtStack gap="500" style={{ maxWidth: '400px' }}>
        {inputs.map(input => (
          <DtInput
            key={input.label}
            label={input.label}
            type={input.type}
            placeholder={input.placeholder}
            value={input.value}
            disabled={input.disabled}
            messages={input.messages}
            onValueChange={value => input.setValue(String(value))}
            onBlur={input.onBlur}
          />
        ))}
        <DtSelectMenu
          label="Country"
          options={COUNTRY_OPTIONS}
          value={countryValue}
          messages={countryMessages}
          onValueChange={(value) => {
            setCountryValue(value);
            validateCountry(value);
          }}
        />
        <DtRadioGroup
          name="contact"
          legend="Preferred contact"
          value={contactValue}
          messages={contactMessages}
          onValueChange={(value) => {
            const next = String(value);
            setContactValue(next);
            validateContact(next);
          }}
        >
          {CONTACT_OPTIONS.map(option => (
            <DtRadio key={option.value} value={option.value} label={option.label} />
          ))}
        </DtRadioGroup>
        <DtCheckboxGroup
          name="interests"
          legend="Interests"
          value={interestsValue}
          messages={interestsMessages}
          onValueChange={(value) => {
            const next = value as string[];
            setInterestsValue(next);
            validateInterests(next);
          }}
        >
          {INTEREST_OPTIONS.map(option => (
            <DtCheckbox key={option.value} value={option.value} label={option.label} />
          ))}
        </DtCheckboxGroup>
        <DtButton importance="outlined" kind="muted" onClick={clearAll}>Clear</DtButton>
    </DtStack>
  );
}

export const InteractiveForm: Story = {
  render: () => <InteractiveFormTemplate />,
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
