import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtToggle, type DtToggleProps } from './Toggle';
import { TOGGLE_CHECKED_VALUES, TOGGLE_SIZE_MODIFIERS } from './ToggleConstants';

// Slots are args named as in Vue: `default` (the label).
type ToggleStoryArgs = Omit<DtToggleProps, 'children'> & {
  default?: string;
};

// Default Prop Values
export const argsData = {
  default: 'Toggle Default',
  checked: false,
  onChange: action('change'),
  labelClass: 'd-mie-75',
  className: '', // Vue's `class`
} satisfies Partial<ToggleStoryArgs>;

// Prop Controls
export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    description: 'Used as a way to set either a label or a label element for the toggle',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },

  // Props
  // Vue's modelValue
  checked: {
    description:
      'Used to set the initial state of the toggle. Setting "mixed" means it gets the indeterminate state.',
    options: TOGGLE_CHECKED_VALUES,
    control: {
      type: 'select',
    },
    table: {
      category: 'props',
      type: {
        summary: 'boolean | "mixed"',
      },
      defaultValue: {
        summary: 'false',
      },
    },
  },

  size: {
    description: 'Used to set the size of the toggle.',
    options: Object.keys(TOGGLE_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
    // Not in Vue's argTypes: react-docgen reports size as a union, and Storybook drops a URL value for a union
    // arg, so without it the comparison couldn't drive it in the React frame.
    type: 'string',
  },

  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },

  disabled: {
    description: 'Used to disabled the toggle',
    control: 'boolean',
    table: {
      category: 'props',
      type: {
        summary: 'boolean',
      },
    },
  },

  labelChildProps: {
    control: false,
  },

  // Action Event Handlers
  onChange: {
    table: {
      disable: true,
    },
  },

  onCheckedChange: {
    // Vue's `update:modelValue`.
    description: 'Event fired to sync the checked prop with the parent component',
    table: {
      type: { summary: 'event' },
    },
  },
} satisfies Meta<ToggleStoryArgs>['argTypes'];

// Default
const meta = {
  title: 'Components/Toggle',
  component: DtToggle,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<ToggleStoryArgs>;

export default meta;
type Story = StoryObj<ToggleStoryArgs>;

// ToggleDefault.story.vue. Its default slot reads `defaultSlot`, which the story never defines, so the `default` arg
// renders nothing in Vue, and nothing here either. It also passes only some args on (not `onChange`, `id`...), and
// `class` (`className` here) as the root class.
function ToggleDefault (args: ToggleStoryArgs) {
  return (
    <DtToggle
      checked={args.checked}
      disabled={args.disabled}
      size={args.size}
      showIcon={args.showIcon}
      labelClass={args.labelClass}
      className={args.className}
      labelChildProps={args.labelChildProps}
      toggleOnClick={args.toggleOnClick}
      onCheckedChange={args.onCheckedChange}
    />
  );
}

// ToggleVariants.story.vue
function ToggleVariants () {
  const [vModelValue, setVModelValue] = useState(false);

  return (
    <div id="components-toggle--variants-container">
      {/* Unchecked Initially */}
      <DtToggle
        className="d-mbs-75"
        labelClass="d-mie-75"
      >
        Unchecked Initial
      </DtToggle>

      {/* Checked Initially */}
      <DtToggle
        className="d-mbs-75"
        labelClass="d-mie-75"
        defaultChecked
      >
        Checked Initial
      </DtToggle>

      {/* Indeterminate */}
      <DtToggle
        className="d-mbs-75"
        labelClass="d-mie-75"
        defaultChecked="mixed"
      >
        Indeterminate
      </DtToggle>

      {/* Checked Disabled */}
      <DtToggle
        className="d-mbs-75"
        labelClass="d-mie-75"
        defaultChecked
        disabled
      >
        Disabled Checked
      </DtToggle>

      {/* Unchecked Disabled */}
      <DtToggle
        className="d-mbs-75"
        labelClass="d-mie-75"
        disabled
      >
        Disabled Unchecked
      </DtToggle>

      {/* Indeterminate Disabled */}
      <DtToggle
        className="d-mbs-75"
        labelClass="d-mie-75"
        defaultChecked="mixed"
        disabled
      >
        Indeterminate Disabled
      </DtToggle>

      {/* With Flex grow */}
      <DtToggle
        className="d-mbs-75"
        labelClass="d-d-flex d-fl-grow1"
      >
        With Flex Grow
      </DtToggle>

      {/* With Slots */}
      <DtToggle className="d-mbs-75">
        <div className="d-mie-75">
          With Slot Label
        </div>
      </DtToggle>

      {/* With v-model */}
      <DtToggle
        checked={vModelValue}
        onCheckedChange={setVModelValue}
        className="d-mbs-75"
      >
        <div className="d-mie-75">
          With V-Model
        </div>
      </DtToggle>

      {/* Without icon */}
      <DtToggle
        className="d-mbs-75"
        labelClass="d-mie-75"
        showIcon={false}
      >
        Without icon
      </DtToggle>

      <DtToggle
        className="d-mbs-75"
        labelClass="d-mie-75"
        size={200}
      >
        Small size
      </DtToggle>
    </div>
  );
}

const a11y = {
  config: {
    rules: [
      // TODO: it's possible to pass a custom aria-label but adding a built-in label can cover most of cases
      {
        id: 'button-name',
        enabled: false,
      },
    ],
  },
};

export const Default: Story = {
  render: args => <ToggleDefault {...args} />,
  args: {},
  parameters: { a11y },
};

export const Variants: Story = {
  render: () => <ToggleVariants />,
  args: {},
  parameters: {
    options: {
      showPanel: false,
    },
    a11y,
  },
};
