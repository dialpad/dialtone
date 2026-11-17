import { useEffect, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { DtStack } from '../Stack';
import { InputDecorator } from './Decorators/Input';
import { InputsDecorator } from './Decorators/Inputs';
import { DtInputGroup, type DtInputGroupProps } from './InputGroup';

// Slots are args named as in Vue: `default` and `legendSlot` (the legend). Vue's template renders the legend slot
// through v-html, so it is an HTML string. `options` is a story variable.
type InputGroupStoryArgs = Omit<DtInputGroupProps, 'children'> & {
  default?: string;
  legendSlot?: string;
  options?: { label: string; value: string }[];
};

// Constants
const RADIO_GROUP_OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Other', value: 'other' },
];

// Default Prop Values
export const argsData = {
  name: 'fruits-input-group',
  legend: 'Fruits',
  value: '',
  options: RADIO_GROUP_OPTIONS,
  onValueChange: action('update:modelValue'),
} satisfies Partial<InputGroupStoryArgs>;

// Controls
export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },
  legendSlot: {
    name: 'legend',
    description: 'Slot for legend',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode',
      },
    },
  },

  // Props
  legend: {
    description: 'The legend of the input group',
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
    control: {
      type: 'text',
    },
  },
  // Vue's v-model: `value` and `onValueChange` stand in for `v-model`.
  value: {
    description: 'A provided value for the input group',
    control: 'text',
    table: {
      category: 'props',
    },
  },
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  legendClass: {
    control: 'text',
  },
  messagesClass: {
    control: 'text',
  },

  // Action Event Handlers
  onValueChange: {
    // Vue's `update:modelValue`.
    table: {
      disable: true,
    },
  },

  // Story Variables
  options: {
    table: {
      disable: true,
    },
  },
} satisfies Meta<InputGroupStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Input Group',
  component: DtInputGroup,
  tags: ['!dev', '!autodocs'],
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<InputGroupStoryArgs>;

export default meta;
type Story = StoryObj<InputGroupStoryArgs>;

// Renders an HTML string as Vue's v-html does.
const html = (value: string): ReactNode => <span dangerouslySetInnerHTML={{ __html: value }} />;

// InputGroupDefault.story.vue. Vue keeps the group's value in `internalValue`, which follows the `value` arg and
// isn't updated by the group's events (the template only forwards them), so the group is controlled here by state
// that follows the arg and what the group reports.
function InputGroupDefault ({
  default: _default,
  legendSlot,
  options,
  value: valueArg,
  onValueChange,
  ...args
}: InputGroupStoryArgs) {
  const [value, setValue] = useState(valueArg);
  useEffect(() => setValue(valueArg), [valueArg]);

  return (
    <DtInputGroup
      id={args.id}
      value={value}
      name={args.name}
      legend={legendSlot ? html(legendSlot) : args.legend}
      disabled={args.disabled}
      messages={args.messages}
      showMessages={args.showMessages}
      legendClass={args.legendClass}
      messagesClass={args.messagesClass}
      legendChildProps={args.legendChildProps}
      messagesChildProps={args.messagesChildProps}
      onValueChange={newValue => {
        setValue(newValue);
        onValueChange?.(newValue);
      }}
    >
      {options?.map(option => (
        <InputDecorator
          key={option.value}
          value={option.value}
        >
          <span>{option.label}</span>
        </InputDecorator>
      ))}
    </DtInputGroup>
  );
}

// InputGroupVariants.story.vue
function InputGroupVariants () {
  return (
    <DtStack
      id="components-input-group--variants-container"
      gap="400"
    >
      {/* Default */}
      <DtInputGroup
        name="input-group-default"
        aria-label="default"
      >
        <InputsDecorator />
      </DtInputGroup>

      {/* With Legend */}
      <DtInputGroup
        name="input-group-with-legend"
        legend="With Legend"
      >
        <InputsDecorator />
      </DtInputGroup>

      {/* With Slotted Legend */}
      <DtInputGroup
        name="input-group-with-slotted-legend"
        legend="With Slotted Legend"
      >
        <InputsDecorator />
      </DtInputGroup>

      {/* With Value */}
      <DtInputGroup
        name="input-group-with-value"
        legend="With Value"
        defaultValue="banana"
      >
        <InputsDecorator />
      </DtInputGroup>

      {/* Disabled */}
      <DtInputGroup
        name="input-group-disabled"
        legend="Disabled"
        disabled
      >
        <InputsDecorator />
      </DtInputGroup>

      {/* With Positive Message */}
      <DtInputGroup
        name="input-group-with-positive-message"
        legend="With Positive Message"
        messages={[{ message: 'Positive', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]}
      >
        <InputsDecorator />
      </DtInputGroup>

      {/* With Warning Message */}
      <DtInputGroup
        name="input-group-with-warning-message"
        legend="With Warning Message"
        messages={[{ message: 'Warning', type: VALIDATION_MESSAGE_TYPES.WARNING }]}
      >
        <InputsDecorator />
      </DtInputGroup>

      {/* With Critical Message */}
      <DtInputGroup
        name="input-group-with-critical-message"
        legend="With Critical Message"
        messages={[{ message: 'Critical', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]}
      >
        <InputsDecorator />
      </DtInputGroup>

      {/* With Critical Messages Hidden */}
      <DtInputGroup
        name="input-group-with-critical-messages-hidden"
        legend="With Critical Messages Hidden"
        messages={[{ message: 'Critical', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]}
        showMessages={false}
      >
        <InputsDecorator />
      </DtInputGroup>
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <InputGroupDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <InputGroupVariants />,
  args: {},

  parameters: {
    options: {
      showPanel: false,
    },
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
