import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { StandIn } from '../../.storybook/StandIn';
import { DtIcon, ICON_NAMES, type IconName } from '../Icon';
import { DtInput, type DtInputProps, type InputValidation } from './Input';
import { INPUT_SIZES, INPUT_TYPES } from './InputConstants';

// Slots are args named as in Vue: `description` is an HTML string (Vue's template renders it through v-html), and
// `startIcon` / `endIcon` are icon names. Vue's `onUpdateIsInvalid` arg keeps its name (onIsInvalidChange) and wires
// to onInvalidChange.
type InputStoryArgs = Omit<DtInputProps, 'description' | 'startIcon' | 'endIcon'> & {
  description?: string;
  startIcon?: IconName;
  endIcon?: IconName;
  onIsInvalidChange?: (invalid: boolean) => void;
};

export const argsData = {
  type: INPUT_TYPES.TEXT,
  size: INPUT_SIZES.DEFAULT,
  placeholder: 'placeholder',
  label: 'Label',
  onBlur: action('blur'),
  onValueChange: action('update:modelValue'),
  onClear: action('clear'),
  onFocus: action('focus'),
  onLengthChange: action('update:length'),
  onIsInvalidChange: action('update:invalid'),
} satisfies Partial<InputStoryArgs>;

// Controls
export const argTypesData = {
  // Slots
  description: {
    table: {
      type: { summary: 'ReactNode' },
    },
    control: {
      type: 'text',
    },
  },
  startIcon: {
    options: ICON_NAMES,
    table: {
      type: { summary: 'ReactNode' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  endIcon: {
    options: ICON_NAMES,
    table: {
      type: { summary: 'ReactNode' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  // Props
  // Vue's modelValue
  value: {
    control: 'text',
    // react-docgen reports value as a union (string | number); see labelSize in Checkbox's stories.
    type: 'string',
  },
  type: {
    control: 'select',
    options: [null, ...Object.values(INPUT_TYPES)],
    table: {
      defaultValue: {
        summary: INPUT_TYPES.TEXT,
      },
    },
  },
  messages: {
    control: 'object',
  },
  size: {
    control: 'select',
    options: Object.values(INPUT_SIZES),
    table: {
      defaultValue: {
        summary: INPUT_SIZES.DEFAULT,
      },
    },
  },
  inputClass: {
    control: 'text',
  },
  messagesChildProps: { control: false },
  label: {
    control: {
      type: 'text',
    },
    // react-docgen reports label as ReactNode; the control sets the string prop.
    type: 'string',
  },
  currentLength: {
    control: 'number',
    table: {
      defaultValue: {
        summary: 'null',
      },
    },
  },
  validate: {
    control: 'object',
    table: {
      defaultValue: {
        summary: 'null',
      },
    },
  },
  disabled: {
    control: { type: 'boolean' },
  },
  hidden: {
    control: { type: 'boolean' },
  },
  showLabel: {
    control: { type: 'boolean' },
  },
  retainWarning: {
    control: { type: 'boolean' },
  },
  name: {
    control: { type: 'text' },
  },
  inputWrapperClass: {
    control: 'text',
  },

  // HTML attributes
  placeholder: {
    description: 'HTML input placeholder attribute',
    table: {
      category: 'html attributes',
    },
    control: 'text',
  },

  // Action Event Handlers
  onBlur: {
    description: 'Input blur event: fired when focus leaves the component',
    table: {
      type: { summary: 'event' },
    },
  },
  onValueChange: {
    // Vue's `update:modelValue`.
    description: 'Event fired to sync the value prop with the parent component',
    table: {
      type: { summary: 'event' },
    },
  },
  onClear: {
    description: 'Input clear event',
    table: {
      type: { summary: 'event' },
    },
  },
  onFocus: {
    // Vue's `focus` and `focusin`.
    description: 'Native input focus event',
    table: {
      type: { summary: 'event' },
    },
  },
  onLengthChange: {
    // Vue's `update:length`.
    description: 'Length of the input when currentLength prop is not passed',
    table: {
      type: { summary: 'event' },
    },
  },
  onIsInvalidChange: {
    // Vue's `update:invalid`, which the story passes to onInvalidChange.
    description: 'Result of the input validation',
    table: {
      type: { summary: 'event' },
    },
  },
} satisfies Meta<InputStoryArgs>['argTypes'];

const meta = {
  title: 'Components/Input',
  component: DtInput,
  decorators: [Story => <div style={{ width: '500px' }}><Story /></div>],
  excludeStories: /.*Data$/,
  argTypes: argTypesData,
  args: argsData,
} satisfies Meta<InputStoryArgs>;

export default meta;
type Story = StoryObj<InputStoryArgs>;

// Renders an HTML string as Vue's v-html does.
const html = (value: string): ReactNode => <span dangerouslySetInnerHTML={{ __html: value }} />;

// The story templates' v-model, length and validation config: `validate` gets a message counting the characters
// left, unless it brings its own.
function useStoryInput ({ value, validate, onValueChange, onLengthChange }: InputStoryArgs) {
  const [inputValue, setInputValue] = useState<string | string[]>('');
  const [inputLength, setInputLength] = useState(0);

  // Vue's `watch: { modelValue }`: the value control feeds the story's state, but not on mount.
  const syncedValue = useRef(value);
  useEffect(() => {
    if (Object.is(syncedValue.current, value)) return;
    syncedValue.current = value;
    setInputValue(value == null ? '' : String(value));
  }, [value]);

  const remainingCharacters = (validate?.length?.max ?? NaN) - inputLength;
  const validationMessage = remainingCharacters < 0
    ? `${Math.abs(remainingCharacters)} characters over limit`
    : `${remainingCharacters} characters left`;
  const validationConfig: InputValidation | null = validate?.length
    ? { ...validate, length: { ...validate.length, message: validate.length.message || validationMessage } }
    : null;

  return {
    inputValue,
    validationConfig,
    onValueChange: (value: string | string[]) => {
      setInputValue(value);
      onValueChange?.(value);
    },
    updateLength: (length: number) => {
      setInputLength(length);
      onLengthChange?.(length);
    },
  };
}

// InputDefault.story.vue
function InputDefault (args: InputStoryArgs) {
  const { inputValue, validationConfig, onValueChange, updateLength } = useStoryInput(args);
  const { description, startIcon, endIcon } = args;

  return (
    <DtInput
      autoComplete="on"
      value={typeof inputValue === 'string' ? inputValue : undefined}
      type={args.type}
      messages={args.messages}
      size={args.size}
      label={args.label}
      messagesChildProps={args.messagesChildProps}
      name={args.name}
      disabled={args.disabled}
      showMessages={args.showMessages}
      messagesClass={args.messagesClass}
      placeholder={args.placeholder}
      inputClass={args.inputClass}
      retainWarning={args.retainWarning}
      inputWrapperClass={args.inputWrapperClass}
      className={args.className}
      currentLength={args.currentLength}
      showLabel={args.showLabel}
      hidden={args.hidden}
      validate={validationConfig}
      onBlur={args.onBlur}
      onValueChange={onValueChange}
      onClear={args.onClear}
      onFocus={args.onFocus}
      onLengthChange={updateLength}
      onInvalidChange={args.onIsInvalidChange}
      description={description ? html(description) : undefined}
      startIcon={startIcon ? ({ iconSize }) => <DtIcon name={startIcon} size={iconSize} /> : undefined}
      endIcon={endIcon ? ({ iconSize }) => <DtIcon name={endIcon} size={iconSize} /> : undefined}
    />
  );
}

// InputSearchVariant.story.vue
function InputSearchVariant (args: InputStoryArgs) {
  const { inputValue, validationConfig, onValueChange, updateLength } = useStoryInput(args);
  const { description } = args;

  return (
    <DtInput
      autoComplete="on"
      value={typeof inputValue === 'string' ? inputValue : undefined}
      type={args.type}
      messages={args.messages}
      size={args.size}
      label={args.label}
      messagesChildProps={args.messagesChildProps}
      name={args.name}
      disabled={args.disabled}
      showMessages={args.showMessages}
      messagesClass={args.messagesClass}
      placeholder={args.placeholder}
      inputClass={args.inputClass}
      retainWarning={args.retainWarning}
      inputWrapperClass={args.inputWrapperClass}
      currentLength={args.currentLength}
      validate={validationConfig}
      onBlur={args.onBlur}
      onValueChange={onValueChange}
      onClear={args.onClear}
      onFocus={args.onFocus}
      onLengthChange={updateLength}
      onInvalidChange={args.onIsInvalidChange}
      description={description ? html(description) : undefined}
      startIcon={({ iconSize }) => <DtIcon name="search" size={iconSize} />}
      endIcon={inputValue.length !== 0
        ? ({ clear }) => (
          <StandIn for="button">
            <button
              type="button"
              className="base-button__button d-btn d-btn--muted d-btn--xs d-btn--circle d-btn--icon-only"
              data-qa="dt-button"
              aria-label="Clear search"
              onClick={clear}
            >
              <span data-qa="dt-button-start-icon" className="base-button__icon d-btn__icon d-btn__icon--left">
                <DtIcon name="close" size="200" />
              </span>
            </button>
          </StandIn>
        )
        : undefined}
    />
  );
}

export const Default: Story = {
  render: args => <InputDefault {...args} />,
};

export const WithDescription: Story = {
  ...Default,
  args: {
    label: 'Label',
    description: 'Description',
  },
};

export const WithStartIcon: Story = {
  ...Default,
  args: {
    startIcon: 'send',
  },
};

export const WithEndIcon: Story = {
  ...Default,
  args: {
    endIcon: 'lock-filled',
  },
};

export const WithBothIcons: Story = {
  ...Default,
  args: {
    startIcon: 'send',
    endIcon: 'lock-filled',
  },
};

export const WithWarning: Story = {
  ...Default,
  args: {
    messages: [{ message: 'This is a warning message', type: 'warning' }],
  },
  parameters: {
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

export const WithCritical: Story = {
  ...Default,
  args: {
    messages: [{ message: 'This is a critical message', type: 'critical' }],
  },
};

export const WithPositive: Story = {
  ...Default,
  args: {
    messages: [{ message: 'This is a positive message', type: 'positive' }],
  },
};

export const WithMultipleMessages: Story = {
  ...Default,
  args: {
    messages: [
      { message: 'This is the first message', type: 'critical' },
      { message: 'This is the second message', type: 'critical' },
      { message: 'This is the third message', type: 'critical' },
    ],
  },
};

export const ExtraSmall: Story = {
  ...Default,
  args: {
    size: 100,
  },
};

export const Small: Story = {
  ...Default,
  args: {
    size: 200,
  },
};

export const Large: Story = {
  ...Default,
  args: {
    size: 400,
  },
};

export const ExtraLarge: Story = {
  ...Default,
  args: {
    size: 500,
  },
};

export const WithLengthValidation: Story = {
  ...Default,
  args: {
    validate: {
      length: {
        description: 'Max 25 characters.',
        max: 25,
        warn: 15,
        limitMaxLength: false,
      },
    },
  },
};

export const SearchVariant: Story = {
  render: args => <InputSearchVariant {...args} />,
  args: {
    type: 'search',
  },
};
