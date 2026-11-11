import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { StandIn } from '../../.storybook/StandIn';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { DtCheckbox, type DtCheckboxProps } from './Checkbox';

// Slots are args named as in Vue: `default` (the label) and `descriptionSlot` (the description). Vue's template
// renders each through v-html, so they are HTML strings.
type CheckboxStoryArgs = Omit<DtCheckboxProps, 'children'> & {
  default?: string;
  descriptionSlot?: string;
};

// Default Prop Values
export const argsData = {
  value: 'Value',
  name: 'Name',
  label: 'Checkbox',
  validationState: '',
  onCheckedChange: action('update:modelValue'),
  onFocus: action('focusin'),
  onBlur: action('focusout'),
} satisfies Partial<CheckboxStoryArgs>;

// Prop Controls
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
  descriptionSlot: {
    name: 'description',
    description: 'slot for Checkbox Description',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode',
      },
    },
  },

  // Props
  description: {
    description: 'Describes the checkbox option',
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
  // Vue's modelValue
  checked: {
    description: 'Used to set the initial state of the checkbox',
    control: 'boolean',
    table: {
      category: 'props',
      type: {
        summary: 'boolean',
      },
    },
  },
  validationState: {
    table: {
      type: {
        summary: 'string',
      },
    },
    control: 'select',
    options: ['', ...Object.values(VALIDATION_MESSAGE_TYPES)],
  },
  label: {
    control: { type: 'text' },
  },
  name: {
    control: { type: 'text' },
  },
  value: {
    control: { type: 'text' },
    // Not in Vue's argTypes: see labelSize (value is string | number | boolean | null).
    type: 'string',
  },
  disabled: {
    control: { type: 'boolean' },
  },
  indeterminate: {
    control: { type: 'boolean' },
  },
  showLabel: {
    control: { type: 'boolean' },
  },
  labelSize: {
    options: ['100', '200', '300', '400'],
    control: { type: 'select' },
    // Not in Vue's argTypes: react-docgen reports labelSize as a union, and Storybook drops a URL value for a union
    // arg, so without it the comparison couldn't drive it in the React frame.
    type: 'string',
  },
  labelStrength: {
    options: ['bold', 'semibold', 'medium', 'normal'],
    control: { type: 'select' },
    // Not in Vue's argTypes: see labelSize.
    type: 'string',
  },
  inputClass: {
    description: 'Used to customize the input element',
  },
  labelClass: {
    description: 'Used to customize the label container',
  },
  descriptionClass: {
    description: 'Used to customize the description container',
  },
  messagesClass: {
    description: 'Used to customize the validation messages component',
  },
  showMessages: {
    control: { type: 'boolean' },
  },
  messages: {
    control: 'object',
  },
  labelChildProps: {
    control: false,
  },
  descriptionChildProps: {
    control: false,
  },
  messagesChildProps: {
    control: false,
  },

  // Action Event Handlers
  onCheckedChange: {
    // Vue's `update:modelValue`: "Event fired to sync the modelValue prop with the parent component".
    description: 'Event fired to sync the checked prop with the parent component',
    table: {
      type: { summary: 'event' },
    },
  },
  onFocus: {
    // Vue's `focusin`.
    description: 'Native input focusin event',
    table: {
      type: { summary: 'event' },
    },
  },
  onBlur: {
    // Vue's `focusout`.
    description: 'Native input focusout event',
    table: {
      type: { summary: 'event' },
    },
  },
} satisfies Meta<CheckboxStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Checkbox',
  component: DtCheckbox,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<CheckboxStoryArgs>;

export default meta;
type Story = StoryObj<CheckboxStoryArgs>;

// Renders an HTML string as Vue's v-html does.
const html = (value: string): ReactNode => <span dangerouslySetInnerHTML={{ __html: value }} />;

// CheckboxDefault.story.vue. Its default slot reads `defaultSlot`, which the story never defines, so the `default`
// arg renders nothing in Vue, and nothing here either.
function CheckboxDefault ({ default: _default, descriptionSlot, ...args }: CheckboxStoryArgs) {
  return (
    <DtCheckbox
      label={args.label}
      name={args.name}
      value={args.value}
      checked={args.checked}
      description={descriptionSlot ? html(descriptionSlot) : args.description}
      validationState={args.validationState}
      disabled={args.disabled}
      inputClass={args.inputClass}
      labelClass={args.labelClass}
      descriptionClass={args.descriptionClass}
      labelChildProps={args.labelChildProps}
      descriptionChildProps={args.descriptionChildProps}
      indeterminate={args.indeterminate}
      messages={args.messages}
      className={args.className}
      onCheckedChange={args.onCheckedChange}
      onFocus={args.onFocus}
      onBlur={args.onBlur}
    />
  );
}

// CheckboxVariants.story.vue
function CheckboxVariants () {
  return (
    <StandIn for="stack">
      <div
        id="components-checkbox--variants-container"
        data-qa="dt-stack"
        className="d-stack d-stack--gap-100 d-stack--justify-start"
      >
        {/* Default */}
        <DtCheckbox
          name="default"
          value="Value"
          label="Default"
        />

        {/* With Description */}
        <DtCheckbox
          name="with-description"
          value="Value"
          label="With"
          description="Description"
        />

        {/* With Slotted Label */}
        <DtCheckbox
          name="with-slotted-label"
          value="Value"
        >
          With Slotted Label
        </DtCheckbox>

        {/* Without any label/description. */}
        {/* Note: must have an aria-label if no label is passed either through props/slots */}
        <DtCheckbox
          name="without-label-nor-description"
          aria-label="My aria label"
          value="Value"
        />

        {/* With Slotted Description */}
        <DtCheckbox
          name="with-slotted-description"
          label="With"
          value="Value"
          description="Slotted Description"
        />

        {/* With Slotted Label and Description */}
        <DtCheckbox
          name="with-slotted-label-and-description"
          value="Value"
          description="And Slotted Description"
        >
          With Slotted Label
        </DtCheckbox>

        {/* Checked */}
        <DtCheckbox
          name="checked"
          value="Value"
          label="Checked"
          defaultChecked
        />

        {/* Checked With Description */}
        <DtCheckbox
          name="checked-with-description"
          value="Value"
          label="Checked"
          description="With Description"
          defaultChecked
        />

        {/* Indeterminate */}
        <DtCheckbox
          name="indeterminate"
          value="indeterminateValue"
          label="Indeterminate Checkbox"
          indeterminate
        />

        {/* Indeterminate Disabled */}
        <DtCheckbox
          name="indeterminate-disabled"
          value="indeterminateValue"
          label="Indeterminate Disabled Checkbox"
          indeterminate
          disabled
        />

        {/* Positive With Description */}
        <DtCheckbox
          name="positive-with-description"
          value="Value"
          label="Positive"
          description="With Description"
          validationState="positive"
          messages={[{ message: 'Positive message', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]}
        />

        {/* Warning With Description */}
        <DtCheckbox
          name="warning-with-description"
          value="Value"
          label="Warning"
          description="With Description"
          validationState="warning"
          messages={[{ message: 'Warning message', type: VALIDATION_MESSAGE_TYPES.WARNING }]}
        />

        {/* Critical With Description */}
        <DtCheckbox
          name="critical-with-description"
          value="Value"
          label="Critical"
          description="With Description"
          validationState="critical"
          messages={[{ message: 'Critical message', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]}
        />

        {/* Checked Positive With Description */}
        <DtCheckbox
          name="checked-positive-with-description"
          value="Value"
          label="Checked Positive"
          description="With Description"
          validationState="positive"
          messages={[{ message: 'Positive message', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]}
          defaultChecked
        />

        {/* Checked Warning With Description */}
        <DtCheckbox
          name="checked-warning-with-description"
          value="Value"
          label="Checked Warning"
          description="With Description"
          validationState="warning"
          defaultChecked
        />

        {/* Checked Critical With Description */}
        <DtCheckbox
          name="checked-critical-with-description"
          value="Value"
          label="Checked Critical"
          description="With Description"
          validationState="critical"
          messages={[{ message: 'Critical message', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]}
          defaultChecked
        />

        {/* Disabled */}
        <DtCheckbox
          name="disabled"
          value="Value"
          label="Disabled"
          disabled
        />

        {/* Disabled With Description */}
        <DtCheckbox
          name="disabled-with-description"
          value="Value"
          label="Disabled"
          description="With Description"
          disabled
        />

        {/* Checked and Disabled */}
        <DtCheckbox
          name="checked-disabled"
          value="Value"
          label="Disabled"
          disabled
          defaultChecked
        />

        {/* Checked and Disabled With Description */}
        <DtCheckbox
          name="checked-disabled-with-description"
          value="Value"
          label="Checked Disabled"
          description="With Description"
          disabled
          defaultChecked
        />

        {/* Checked and With Description and Positive validation message */}
        <DtCheckbox
          name="checked-with-description-and-validation-message"
          value="Value"
          label="Checked"
          description="With Description"
          validationState="positive"
          messages={[{ message: 'Positive', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]}
          defaultChecked
        />
      </div>
    </StandIn>
  );
}

export const Default: Story = {
  render: args => <CheckboxDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <CheckboxVariants />,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
