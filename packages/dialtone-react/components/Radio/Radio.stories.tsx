import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { StandIn } from '../../.storybook/StandIn';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { DtRadio, type DtRadioProps } from './Radio';

// Slots are args named as in Vue: `default` (the label) and `descriptionSlot` (the description). Vue's template
// renders each through v-html, so they are HTML strings.
type RadioStoryArgs = Omit<DtRadioProps, 'children'> & {
  default?: string;
  descriptionSlot?: string;
};

// Default Prop Values
export const argsData = {
  value: 'Value',
  name: 'Name',
  label: 'Radio',
  description: '',
  validationState: '',
  onValueChange: action('update:modelValue'),
  onFocus: action('focusin'),
  onBlur: action('focusout'),
} satisfies Partial<RadioStoryArgs>;

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
    description: 'slot for Radio Description',
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
    description: 'Describes the radio option',
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
    description: 'Used to set the initial state of the radio',
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
    options: ['', ...Object.values(VALIDATION_MESSAGE_TYPES)],
    control: {
      type: 'select',
    },
  },
  labelChildProps: {
    control: false,
  },
  descriptionChildProps: {
    control: false,
  },

  // Action Event Handlers
  onValueChange: {
    // Vue's `update:modelValue`: "Event fired to sync the modelValue prop with the parent component".
    description: 'Event fired to sync the modelValue prop with the parent component',
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
} satisfies Meta<RadioStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Radio',
  component: DtRadio,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<RadioStoryArgs>;

export default meta;
type Story = StoryObj<RadioStoryArgs>;

// Renders an HTML string as Vue's v-html does.
const html = (value: string): ReactNode => <span dangerouslySetInnerHTML={{ __html: value }} />;

// RadioDefault.story.vue. Its default slot reads `defaultSlot`, which the story never defines, so the `default` arg
// renders nothing in Vue, and nothing here either. The rest of the args fall through to DtRadio's input, as Vue's
// single root lets them, so they are spread first.
function RadioDefault ({ default: _default, descriptionSlot, ...args }: RadioStoryArgs) {
  return (
    <DtRadio
      {...args}
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
      messages={args.messages}
      className={args.className}
      onValueChange={args.onValueChange}
      onFocus={args.onFocus}
      onBlur={args.onBlur}
    />
  );
}

// RadioVariants.story.vue. Vue's `checked` attribute lands on the input and leaves it free to change: defaultChecked.
function RadioVariants () {
  return (
    <StandIn for="stack">
      <div
        id="components-radio--variants-container"
        data-qa="dt-stack"
        className="d-stack d-stack--gap-100 d-stack--justify-start"
      >
        {/* Default */}
        <DtRadio
          name="Value"
          value="Value"
          label="Default"
        />

        {/* With Description */}
        <DtRadio
          name="ValueWDesc"
          value="Value"
          label="With"
          description="Description"
        />

        {/* With Slotted Label */}
        <DtRadio
          name="ValueWSlot"
          value="Value"
        >
          With Slotted Label
        </DtRadio>

        {/* With Slotted Description */}
        <DtRadio
          name="ValueWSlottedDescription"
          value="Value"
          label="With"
          description="Slotted Description"
        />

        {/* With Slotted Label and Description */}
        <DtRadio
          name="ValueWSlottedLabelAndDescription"
          value="Value"
          description="And Slotted Description"
        >
          With Slotted Label
        </DtRadio>

        {/* Checked */}
        <DtRadio
          name="Checked"
          value="Checked"
          label="Checked"
          defaultChecked
        />

        {/* Checked With Description */}
        <DtRadio
          name="CheckedWDesc"
          value="Checked"
          label="Checked"
          description="With Description"
          defaultChecked
        />

        {/* Positive With Description */}
        <DtRadio
          name="Positive"
          value="Validation"
          label="Positive"
          description="With Description"
          validationState="positive"
          messages={[{ message: 'Positive message', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]}
        />

        {/* Warning With Description */}
        <DtRadio
          name="Warning"
          value="Validation"
          label="Warning"
          description="With Description"
          validationState="warning"
          messages={[{ message: 'Warning message', type: VALIDATION_MESSAGE_TYPES.WARNING }]}
        />

        {/* Critical With Description */}
        <DtRadio
          name="Critical"
          value="Validation"
          label="Critical"
          description="With Description"
          validationState="critical"
          messages={[{ message: 'Critical message', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]}
        />

        {/* Checked Warning With Description */}
        <DtRadio
          name="WarningChecked"
          value="Validation"
          label="Warning"
          description="With Description"
          validationState="warning"
          messages={[{ message: 'Warning message', type: VALIDATION_MESSAGE_TYPES.WARNING }]}
          defaultChecked
        />

        {/* Checked Critical With Description */}
        <DtRadio
          name="CriticalChecked"
          value="Validation"
          label="Critical"
          description="With Description"
          validationState="critical"
          messages={[{ message: 'Critical message', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]}
          defaultChecked
        />

        {/* Checked Positive With Description */}
        <DtRadio
          name="PositiveChecked"
          value="Validation"
          label="Positive"
          description="With Description"
          validationState="positive"
          messages={[{ message: 'Positive message', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]}
          defaultChecked
        />

        {/* Disabled */}
        <DtRadio
          name="Disabled"
          value="Disabled"
          label="Disabled"
          disabled
        />

        {/* Disabled With Description */}
        <DtRadio
          name="DisabledWDesc"
          value="Disabled"
          label="Disabled"
          description="With Description"
          disabled
        />

        {/* Disabled and Checked */}
        <DtRadio
          name="CheckedDisabled"
          value="Checked"
          label="Disabled & Checked"
          defaultChecked
          disabled
        />

        {/* Disabled and Checked With Description */}
        <DtRadio
          name="CheckedDisabledWDesc"
          value="Checked"
          label="Disabled & Checked"
          description="With Description"
          defaultChecked
          disabled
        />

        {/* Checked Positive With Messages */}
        <DtRadio
          name="ValidationMessagePositive"
          value="Validation Message Positive"
          label="Validation Message Positive"
          validationState="positive"
          messages={[{ message: 'Positive', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]}
          defaultChecked
        />
      </div>
    </StandIn>
  );
}

export const Default: Story = {
  render: args => <RadioDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <RadioVariants />,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
