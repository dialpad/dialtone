import { useEffect, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { DtRadio } from '../Radio';
import { DtStack } from '../Stack';
import { DtRadioGroup, type DtRadioGroupProps } from './RadioGroup';
import { RadiosDecorator } from './RadiosDecorator';

// Slots are args named as in Vue: `default` and `legendSlot` (the legend). Vue's template renders the legend slot
// through v-html, so it is an HTML string. `options` is a story variable.
type RadioGroupStoryArgs = Omit<DtRadioGroupProps, 'children'> & {
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
  name: 'fruits-radio-group',
  legend: 'Fruits',
  value: '',
  options: RADIO_GROUP_OPTIONS,
  onValueChange: action('update:modelValue'),
} satisfies Partial<RadioGroupStoryArgs>;

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
    description: 'The legend of the radio group',
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
    description: 'A provided value for the radio group',
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
  name: {
    control: { type: 'text' },
  },
  disabled: {
    control: { type: 'boolean' },
  },
  messages: {
    control: 'object',
  },
  showMessages: {
    control: { type: 'boolean' },
  },
  legendChildProps: {
    control: false,
  },
  messagesChildProps: {
    control: false,
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

  // Disabled Controls
  dataQaGroup: {
    table: {
      disable: true,
    },
  },
  dataQaGroupLegend: {
    table: {
      disable: true,
    },
  },
  dataQaGroupMessages: {
    table: {
      disable: true,
    },
  },
} satisfies Meta<RadioGroupStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Radio Group',
  component: DtRadioGroup,
  tags: ['!dev', '!autodocs'],
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<RadioGroupStoryArgs>;

export default meta;
type Story = StoryObj<RadioGroupStoryArgs>;

// Renders an HTML string as Vue's v-html does.
const html = (value: string): ReactNode => <span dangerouslySetInnerHTML={{ __html: value }} />;

// RadioGroupDefault.story.vue. Vue's group follows the `modelValue` arg and keeps its own selection in between,
// so the group is controlled here by state that follows the arg and what the group reports.
function RadioGroupDefault ({
  default: defaultSlot,
  legendSlot,
  options,
  value: valueArg,
  onValueChange,
  ...args
}: RadioGroupStoryArgs) {
  const [value, setValue] = useState(valueArg);
  useEffect(() => setValue(valueArg), [valueArg]);

  return (
    <DtRadioGroup
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
      {defaultSlot
        ? html(defaultSlot)
        : options?.map(option => (
          <DtRadio
            key={option.value}
            value={option.value}
          >
            <span>{option.label}</span>
          </DtRadio>
        ))}
    </DtRadioGroup>
  );
}

// RadioGroupVariants.story.vue
function RadioGroupVariants () {
  return (
    <DtStack
      id="components-radio-group--variants-container"
      gap="100"
    >
      {/* Default */}
      <DtRadioGroup
        name="radio-group-default"
        aria-label="default"
      >
        <RadiosDecorator />
      </DtRadioGroup>

      {/* With Legend */}
      <DtRadioGroup
        name="radio-group-with-legend"
        legend="With Legend"
      >
        <RadiosDecorator />
      </DtRadioGroup>

      {/* With Slotted Legend */}
      <DtRadioGroup
        name="radio-group-with-slotted-legend"
        legend="With Slotted Legend"
      >
        <RadiosDecorator />
      </DtRadioGroup>

      {/* With Value */}
      <DtRadioGroup
        name="radio-group-with-value"
        legend="With Value"
        defaultValue="banana"
      >
        <RadiosDecorator />
      </DtRadioGroup>

      {/* Disabled */}
      <DtRadioGroup
        name="radio-group-disabled"
        legend="Disabled"
        disabled
      >
        <RadiosDecorator />
      </DtRadioGroup>

      {/* With Positive Message */}
      <DtRadioGroup
        name="radio-group-with-positive-message"
        legend="With Positive Message"
        messages={[{ message: 'Positive', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]}
      >
        <RadiosDecorator />
      </DtRadioGroup>

      {/* With Warning Message */}
      <DtRadioGroup
        name="radio-group-with-warning-message"
        legend="With Warning Message"
        messages={[{ message: 'Warning', type: VALIDATION_MESSAGE_TYPES.WARNING }]}
      >
        <RadiosDecorator />
      </DtRadioGroup>

      {/* With Critical Message */}
      <DtRadioGroup
        name="radio-group-with-critical-message"
        legend="With Critical Message"
        messages={[{ message: 'Critical', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]}
      >
        <RadiosDecorator />
      </DtRadioGroup>

      {/* With Critical Messages Hidden */}
      <DtRadioGroup
        name="radio-group-with-critical-messages-hidden"
        legend="With Critical Messages Hidden"
        messages={[{ message: 'Critical', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]}
        showMessages={false}
      >
        <RadiosDecorator />
      </DtRadioGroup>
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <RadioGroupDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <RadioGroupVariants />,
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
