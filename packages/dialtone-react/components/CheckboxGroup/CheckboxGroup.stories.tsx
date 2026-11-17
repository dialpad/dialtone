import { useEffect, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { DtCheckbox } from '../Checkbox';
import { DtStack } from '../Stack';
import { CheckboxesDecorator } from './CheckboxesDecorator';
import { DtCheckboxGroup, type DtCheckboxGroupProps } from './CheckboxGroup';

// Slots are args named as in Vue: `default` and `legendSlot` (the legend). Vue's template renders the legend slot
// through v-html, so it is an HTML string. `options` is a story variable.
type CheckboxGroupStoryArgs = Omit<DtCheckboxGroupProps, 'children'> & {
  default?: string;
  legendSlot?: string;
  options?: { label: string; value: string }[];
};

// Constants
const CHECKBOX_GROUP_OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Other', value: 'other' },
];

// Default Prop Values
export const argsData = {
  name: 'fruits-checkbox-group',
  legend: 'Fruits',
  value: [],
  options: CHECKBOX_GROUP_OPTIONS,
  onValueChange: action('update:modelValue'),
} satisfies Partial<CheckboxGroupStoryArgs>;

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
    description: 'The legend of the checkbox group',
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
    description: 'A provided list of selected values(s) for the checkbox group',
    // Vue's `array` control isn't a Storybook 9 control type; `object` edits arrays.
    control: 'object',
    table: {
      category: 'props',
      type: {
        summary: 'array',
      },
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
} satisfies Meta<CheckboxGroupStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Checkbox Group',
  component: DtCheckboxGroup,
  tags: ['!dev', '!autodocs'],
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<CheckboxGroupStoryArgs>;

export default meta;
type Story = StoryObj<CheckboxGroupStoryArgs>;

// Renders an HTML string as Vue's v-html does.
const html = (value: string): ReactNode => <span dangerouslySetInnerHTML={{ __html: value }} />;

// CheckboxGroupDefault.story.vue. Vue's group follows the `modelValue` arg and keeps its own selection in between,
// so the group is controlled here by state that follows the arg and what the group reports.
function CheckboxGroupDefault ({
  default: defaultSlot,
  legendSlot,
  options,
  value: valueArg,
  onValueChange,
  ...args
}: CheckboxGroupStoryArgs) {
  const [value, setValue] = useState(valueArg);
  useEffect(() => setValue(valueArg), [valueArg]);

  return (
    <DtCheckboxGroup
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
          <DtCheckbox
            key={option.value}
            value={option.value}
          >
            <span>{option.label}</span>
          </DtCheckbox>
        ))}
    </DtCheckboxGroup>
  );
}

// CheckboxGroupVariants.story.vue
function CheckboxGroupVariants () {
  return (
    <DtStack
      id="components-checkbox-group--variants-container"
      gap="100"
    >
      {/* Default */}
      <DtCheckboxGroup
        name="checkbox-group-default"
        aria-label="default"
      >
        <CheckboxesDecorator />
      </DtCheckboxGroup>

      {/* With Legend */}
      <DtCheckboxGroup
        name="checkbox-group-with-legend"
        legend="With Legend"
      >
        <CheckboxesDecorator />
      </DtCheckboxGroup>

      {/* With Slotted Legend */}
      <DtCheckboxGroup
        name="checkbox-group-with-slotted-legend"
        legend="With Slotted Legend"
      >
        <CheckboxesDecorator />
      </DtCheckboxGroup>

      {/* With Selected Values */}
      <DtCheckboxGroup
        name="checkbox-group-with-selected-values"
        legend="With Selected Values"
        defaultValue={['apple', 'other']}
      >
        <CheckboxesDecorator />
      </DtCheckboxGroup>

      {/* Disabled */}
      <DtCheckboxGroup
        name="checkbox-group-disabled"
        legend="Disabled"
        disabled
      >
        <CheckboxesDecorator />
      </DtCheckboxGroup>

      {/* With Positive Message */}
      <DtCheckboxGroup
        name="checkbox-group-with-positive-message"
        legend="With Positive Message"
        messages={[{ message: 'Positive', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]}
      >
        <CheckboxesDecorator />
      </DtCheckboxGroup>

      {/* With Warning Message */}
      <DtCheckboxGroup
        name="checkbox-group-with-warning-message"
        legend="With Warning Message"
        messages={[{ message: 'Warning', type: VALIDATION_MESSAGE_TYPES.WARNING }]}
      >
        <CheckboxesDecorator />
      </DtCheckboxGroup>

      {/* With Critical Message */}
      <DtCheckboxGroup
        name="checkbox-group-with-critical-message"
        legend="With Critical Message"
        messages={[{ message: 'Critical', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]}
      >
        <CheckboxesDecorator />
      </DtCheckboxGroup>

      {/* With Critical Messages Hidden */}
      <DtCheckboxGroup
        name="checkbox-group-with-critical-messages-hidden"
        legend="With Critical Messages Hidden"
        messages={[{ message: 'Critical', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]}
        showMessages={false}
      >
        <CheckboxesDecorator />
      </DtCheckboxGroup>
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <CheckboxGroupDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <CheckboxGroupVariants />,
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
