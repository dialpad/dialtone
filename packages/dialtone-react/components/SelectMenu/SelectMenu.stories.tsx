import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { DtStack } from '../Stack';
import { SELECT_SIZE_MODIFIERS } from './SelectMenuConstants';
import { DtSelectMenu, type DtSelectMenuProps } from './SelectMenu';

// Vue's default slot arg is an HTML string of options (the template renders it through html-fragment).
type SelectMenuStoryArgs = Omit<DtSelectMenuProps, 'children'> & { children?: string };

// Constants
const SELECT_OPTIONS = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
];

// Default Prop Values
export const argsData = {
  label: 'Label',
  size: 300,
  name: '',
  disabled: false,
  value: SELECT_OPTIONS[0].value,
  options: SELECT_OPTIONS,
  onValueChange: action('update:modelValue'),
  onChange: action('change'),
} satisfies Partial<SelectMenuStoryArgs>;

export const argTypesData = {
  // Slots
  children: {
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode',
      },
    },
  },

  // Props
  label: {
    description: 'Label for the select',
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
      defaultValue: {
        summary: '',
      },
    },
    control: {
      type: 'text',
    },
    // react-docgen reports label as ReactNode; the control sets the string prop.
    type: 'string',
  },
  description: {
    description: 'Describes the select',
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
      defaultValue: {
        summary: '',
      },
    },
    control: {
      type: 'text',
    },
    type: 'string',
  },
  options: {
    control: {
      type: 'object',
    },
    table: {
      category: 'props',
      type: {
        summary: 'object',
      },
      defaultValue: {
        summary: '[]',
      },
    },
  },
  size: {
    description: 'Controls the size of the select',
    options: Object.keys(SELECT_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
  },
  labelClass: {
    description: 'Pass through classes. Used to customize the label container',
  },
  descriptionClass: {
    description: 'Pass through classes. Used to customize the description container',
  },
  selectClass: {
    description: 'Pass through classes. Used to customize the select',
  },
  optionClass: {
    description:
      'Pass through classes. Used to customize each option, should options be provided via prop',
  },
  messagesClass: {
    description: 'Pass through classes. Used to customize the the validation messages component',
  },
  labelChildProps: {
    description: 'Pass through props. A set of props that are passed into the label container',
  },
  descriptionChildProps: {
    description:
      'Pass through props. A set of props that are passed into the description container',
  },
  optionChildProps: {
    description: `Pass through props. A set of props that are passed into each option,
     should options be provided via prop`,
  },
  messagesChildProps: {
    description:
      'Pass through props. A set of props that are passed into the validation messages component',
  },

  // HTML attributes
  // Vue's modelValue
  value: {
    description: 'HTML select value attribute. Provides a value for the select',
    options: SELECT_OPTIONS.map((option) => option.value),
    control: {
      type: 'select',
    },
    table: {
      category: 'html attributes',
      type: {
        summary: 'string',
      },
      defaultValue: {
        summary: '',
      },
    },
  },
  name: {
    description: 'HTML select name attribute. Provides a name for the select',
    control: {
      type: 'text',
    },
    table: {
      category: 'html attributes',
      type: {
        summary: 'string',
      },
      defaultValue: {
        summary: '',
      },
    },
  },
  disabled: {
    description: 'HTML select disabled attribute. Disables the select',
    control: {
      type: 'boolean',
    },
    table: {
      category: 'html attributes',
      type: {
        summary: 'boolean',
      },
      defaultValue: {
        summary: 'false',
      },
    },
  },

  // Action Event Handlers
  onValueChange: {
    // Vue's `update:modelValue`.
    table: {
      disable: true,
    },
  },

  onChange: {
    table: {
      disable: true,
    },
  },
} satisfies Meta<SelectMenuStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Select Menu',
  component: DtSelectMenu,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<SelectMenuStoryArgs>;

export default meta;
type Story = StoryObj<SelectMenuStoryArgs>;

// Vue's html-fragment: the option elements of an HTML string.
function htmlOptions (html: string): ReactNode {
  const parsed = new DOMParser().parseFromString(`<select>${html}</select>`, 'text/html');
  return Array.from(parsed.querySelectorAll('option'), (option, index) => (
    <option
      key={index}
      value={option.value}
      label={option.getAttribute('label') ?? undefined}
      disabled={option.disabled}
    >
      {option.textContent}
    </option>
  ));
}

// SelectMenuDefault.story.vue. Vue's select keeps the user's choice when the story's value arg doesn't follow it; a
// controlled React select would revert it, so the story keeps the value in state, and the value control feeds it.
function SelectMenuDefault (args: SelectMenuStoryArgs) {
  const [selected, setSelected] = useState(args.value);
  const [syncedArg, setSyncedArg] = useState(args.value);
  if (!Object.is(syncedArg, args.value)) {
    setSyncedArg(args.value);
    setSelected(args.value);
  }

  return (
    <DtSelectMenu
      label={args.label}
      options={args.options}
      size={args.size}
      description={args.description}
      showMessages={args.showMessages}
      messages={args.messages}
      name={args.name}
      value={selected}
      disabled={args.disabled}
      labelClass={args.labelClass}
      descriptionClass={args.descriptionClass}
      selectClass={args.selectClass}
      optionClass={args.optionClass}
      messagesClass={args.messagesClass}
      labelChildProps={args.labelChildProps}
      descriptionChildProps={args.descriptionChildProps}
      optionChildProps={args.optionChildProps}
      messagesChildProps={args.messagesChildProps}
      className={args.className}
      onValueChange={(value, event) => {
        setSelected(value);
        args.onValueChange?.(value, event);
      }}
      onChange={args.onChange}
    >
      {args.children ? htmlOptions(args.children) : undefined}
    </DtSelectMenu>
  );
}

// SelectMenuVariants.story.vue
function SelectMenuVariants ({ options }: SelectMenuStoryArgs) {
  return (
    <DtStack id="components-select-menu--variants-container" gap="100">
      {/* Default */}
      <DtSelectMenu id="default" name="default" label="Default" options={options} />

      {/* With Description */}
      <DtSelectMenu
        id="with-description"
        name="with-description"
        label="With"
        description="Description"
        options={options}
      />

      {/* With Slotted Label */}
      <DtSelectMenu
        id="with-slotted-label"
        name="with-slotted-label"
        options={options}
        label={<>With Slotted Label</>}
      />

      {/* With Slotted Description */}
      <DtSelectMenu
        id="with-slotted-description"
        name="with-slotted-description"
        label="With"
        options={options}
        description={<>Slotted Description</>}
      />

      {/* With Slotted Options */}
      <DtSelectMenu id="with-slotted-options" name="with-slotted-options" label="With Slotted Options">
        {options?.map(option => (
          <option key={`with-slotted-options-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </DtSelectMenu>

      {/* With Critical Message */}
      <DtSelectMenu
        id="with-critical-message"
        name="with-critical-message"
        label="With Critical Message"
        options={options}
        messages={[{ message: 'Critical', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]}
      />

      {/* With Critical Messages Hidden */}
      <DtSelectMenu
        id="with-critical-messages-hidden"
        name="with-critical-messages-hidden"
        label="With Critical Messages Hidden"
        options={options}
        messages={[{ message: 'Critical', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]}
        showMessages={false}
      />

      {/* With Positive Message */}
      <DtSelectMenu
        id="with-positive-message"
        name="with-positive-message"
        label="With Positive Message"
        options={options}
        messages={[{ message: 'Positive', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]}
      />

      {/* With Warning Message */}
      <DtSelectMenu
        id="with-warning-message"
        name="with-warning-message"
        label="With Warning Message"
        options={options}
        messages={[{ message: 'Warning', type: VALIDATION_MESSAGE_TYPES.WARNING }]}
      />

      {/* Disabled */}
      <DtSelectMenu id="disabled" name="disabled" label="Disabled" options={options} disabled />

      {/* Extra Small */}
      <DtSelectMenu id="extra-small" name="extra-small" label="Extra Small" options={options} size={100} />

      {/* Small */}
      <DtSelectMenu id="small" name="small" label="Small" options={options} size={200} />

      {/* Large */}
      <DtSelectMenu id="large" name="large" label="Large" options={options} size={400} />

      {/* Extra Large */}
      <DtSelectMenu id="extra-large" name="extra-large" label="Extra Large" options={options} size={500} />
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <SelectMenuDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: args => <SelectMenuVariants {...args} />,
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
