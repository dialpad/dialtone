import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StandIn } from '../../.storybook/StandIn';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import type { ValidationMessage } from '../../common/utils';
import { DtCheckbox } from '../Checkbox/Checkbox';
import { DtIconBell } from '../../icons';
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
  { value: 'email', label: 'Email', messagesId: 'dt7' },
  { value: 'phone', label: 'Phone', messagesId: 'dt8' },
  { value: 'sms', label: 'SMS', messagesId: 'dt9' },
];
const INTEREST_OPTIONS = [
  { value: 'design', label: 'Design', messagesId: 'dt12' },
  { value: 'engineering', label: 'Engineering', messagesId: 'dt13' },
  { value: 'product', label: 'Product', messagesId: 'dt14' },
];

// The form fields are stand-ins: Vue's initial DOM, with the story's handlers on their native elements and a real
// DtValidationMessages where each field renders its messages. What the real components change with their messages
// (d-input--critical, aria-invalid, aria-describedby) doesn't happen here until they are ported.
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

  const inputs = [
    { label: 'Name', placeholder: 'Enter your name', type: 'text', value: nameValue, setValue: setNameValue, messages: nameMessages, onBlur: validateName, disabled: false },
    { label: 'Email', placeholder: 'Enter your email', type: 'email', value: emailValue, setValue: setEmailValue, messages: emailMessages, onBlur: validateEmail, disabled: false },
    { label: 'Username', placeholder: "Enter a username (try 'taken')", type: 'text', value: usernameValue, setValue: setUsernameValue, messages: usernameMessages, onBlur: validateUsername, disabled: usernameChecking },
  ];

  return (
    <StandIn for="stack">
      <div data-qa="dt-stack" className="d-stack d-stack--gap-500 d-stack--justify-start" style={{ maxWidth: '400px' }}>
        {inputs.map(input => (
          <StandIn for="input" key={input.label}>
            <div className="d-input__root" data-qa="dt-input">
              <label className="d-input__label" data-qa="dt-input-label-wrapper">
                <span data-qa="dt-input-label" className="d-text d-text-label--md d-text--tone-secondary d-input__label-text">{input.label}</span>
                <div className="d-input__wrapper">
                  <span className="d-input-icon d-input-icon--left" data-qa="dt-input-left-icon-wrapper"></span>
                  <input
                    name=""
                    type={input.type}
                    autoComplete="off"
                    className="d-input__input d-input"
                    data-qa="dt-input-input"
                    placeholder={input.placeholder}
                    value={input.value}
                    disabled={input.disabled}
                    onChange={event => input.setValue(event.target.value)}
                    onBlur={input.onBlur}
                  />
                  <span className="d-input-icon d-input-icon--right" data-qa="dt-input-right-icon-wrapper"></span>
                </div>
              </label>
              <DtValidationMessages data-qa="dt-input-messages" validationMessages={input.messages} />
            </div>
          </StandIn>
        ))}
        <StandIn for="select-menu">
          <div className="">
            <label>
              <div data-qa="dt-select-label" className="d-text d-text-label--md d-text--tone-secondary d-select__label-text">Country</div>
              <div className="d-select" data-qa="dt-select-wrapper">
                <select
                  className="d-select__input"
                  data-qa="dt-select"
                  value={countryValue}
                  onChange={(event) => {
                    setCountryValue(event.target.value);
                    validateCountry(event.target.value);
                  }}
                >
                  {COUNTRY_OPTIONS.map(option => (
                    <option key={option.value} className="" value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </label>
            <DtValidationMessages data-qa="dt-select-messages" validationMessages={countryMessages} />
          </div>
        </StandIn>
        <StandIn for="radio-group">
          <fieldset className="d-input-group__fieldset" data-qa="radio-group">
            <legend data-qa="radio-group-legend" className="d-text d-text-label--md d-text--tone-secondary d-input-group__legend-text">Preferred contact</legend>
            {CONTACT_OPTIONS.map(option => (
              <StandIn for="radio" key={option.value}>
                <div className="">
                  <label className="d-radio-group">
                    <div className="d-radio__input">
                      <input
                        name="contact"
                        type="radio"
                        className="d-radio"
                        value={option.value}
                        checked={contactValue === option.value}
                        onChange={() => {
                          setContactValue(option.value);
                          validateContact(option.value);
                        }}
                      />
                    </div>
                    <div data-qa="radio-label" className="d-text d-text-label--md d-text--tone-primary d-text--fw-normal d-radio__copy d-radio__label">{option.label}</div>
                  </label>
                  <div className="d-radio__messages" data-qa="radio-description-messages">
                    <div id={option.messagesId} aria-live="assertive" className="base-input__messages d-validation-message__container" data-qa="dt-radio-validation-messages"></div>
                  </div>
                </div>
              </StandIn>
            ))}
            <DtValidationMessages data-qa="radio-group-messages" validationMessages={contactMessages} />
          </fieldset>
        </StandIn>
        <StandIn for="checkbox-group">
          <fieldset className="d-input-group__fieldset" data-qa="checkbox-group">
            <legend data-qa="checkbox-group-legend" className="d-text d-text-label--md d-text--tone-secondary d-input-group__legend-text">Interests</legend>
            {INTEREST_OPTIONS.map(option => (
              <DtCheckbox
                key={option.value}
                name="interests"
                value={option.value}
                label={option.label}
                checked={interestsValue.includes(option.value)}
                onChange={(event) => {
                  const next = event.target.checked
                    ? [...interestsValue, option.value]
                    : interestsValue.filter(value => value !== option.value);
                  setInterestsValue(next);
                  validateInterests(next);
                }}
              />
            ))}
            <DtValidationMessages data-qa="checkbox-group-messages" validationMessages={interestsMessages} />
          </fieldset>
        </StandIn>
        <StandIn for="button">
          <button className="base-button__button d-btn d-btn--outlined d-btn--muted" data-qa="dt-button" type="button" onClick={clearAll}>
            <span data-qa="dt-button-label" className="base-button__label d-btn__label">Clear</span>
          </button>
        </StandIn>
      </div>
    </StandIn>
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
