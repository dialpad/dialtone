import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtIcon, ICON_NAMES, ICON_SIZE_MODIFIERS, type IconName } from '../Icon';
import { DtIconArrowDown, DtIconArrowUp, DtIconLock, DtIconMessage, DtIconRecordFilled } from '../../icons';
import { DtStack } from '../Stack';
import { DtBadge, type DtBadgeProps } from './Badge';
import { BADGE_TYPE_MODIFIERS, BADGE_KIND_MODIFIERS, BADGE_DECORATION_MODIFIERS } from './BadgeConstants';

// The default slot is an arg named `default`, as in Vue, and `startIcon` / `endIcon` are icon names.
type BadgeStoryArgs = Omit<DtBadgeProps, 'startIcon' | 'endIcon'> & {
  default?: string;
  startIcon?: IconName;
  endIcon?: IconName;
};

// Vue's getIconNames(): every icon name, after an empty choice.
const iconsList = [undefined, ...ICON_NAMES];

export const argsData = {
  type: 'default',
  kind: 'label',
  decoration: undefined,
  startIcon: undefined,
  endIcon: undefined,
} satisfies Partial<BadgeStoryArgs>;

// `type` (not in Vue's argTypes) is set on every prop react-docgen reports as a union: Storybook drops a URL value
// for a union arg, so without it the comparison couldn't drive these args in the React frame.
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
  startIcon: {
    options: iconsList,
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
    options: iconsList,
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
  // Vue's deprecated leftIcon and rightIcon argTypes aren't ported with those slots.

  // Props
  type: {
    control: {
      type: 'select',
    },
    options: Object.keys(BADGE_TYPE_MODIFIERS),
    type: 'string',
  },

  kind: {
    control: {
      type: 'select',
    },
    options: Object.keys(BADGE_KIND_MODIFIERS),
    if: { arg: 'type', neq: 'ai' },
    type: 'string',
  },

  decoration: {
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
    options: [undefined, ...Object.keys(BADGE_DECORATION_MODIFIERS)],
    type: 'string',
    // TODO: Find a way to add conditions on more than one argument
  },

  iconSize: {
    options: Object.keys(ICON_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
    type: 'string',
  },

  text: {
    control: { type: 'text' },
  },

  startIconClass: {
    description: 'Pass through classes. Used to customize the start icon container',
  },

  endIconClass: {
    description: 'Pass through classes. Used to customize the end icon container',
  },

  subtle: {
    control: {
      type: 'boolean',
    },
  },

  outlined: {
    control: {
      type: 'boolean',
    },
  },

  labelClass: {
    description: 'Pass through classes. Used to customize the label container',
  },
} satisfies Meta<BadgeStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Badge',
  component: DtBadge,
  excludeStories: /.*Data$/,
  args: argsData,
  argTypes: argTypesData,
} satisfies Meta<BadgeStoryArgs>;

export default meta;
type Story = StoryObj<BadgeStoryArgs>;

// dialtone-vue's BadgeDefault.story.vue.
function BadgeDefault (args: BadgeStoryArgs) {
  return (
    <DtBadge
      text={args.text}
      type={args.type}
      kind={args.kind}
      decoration={args.decoration}
      iconSize={args.iconSize}
      labelClass={args.labelClass}
      startIconClass={args.startIconClass}
      endIconClass={args.endIconClass}
      subtle={args.subtle}
      outlined={args.outlined}
      startIcon={args.startIcon
        ? ({ iconSize }) => <DtIcon name={args.startIcon as IconName} size={iconSize} />
        : undefined}
      endIcon={args.endIcon
        ? ({ iconSize }) => <DtIcon name={args.endIcon as IconName} size={iconSize} />
        : undefined}
    >
      {args.default || undefined}
    </DtBadge>
  );
}

// dialtone-vue's BadgeVariants.story.vue.
const capitalize = (word: string) => word[0].toUpperCase() + word.slice(1);
const types = (Object.keys(BADGE_TYPE_MODIFIERS) as (keyof typeof BADGE_TYPE_MODIFIERS)[])
  .map(key => ({ display: capitalize(key), value: key }));
const getDecorationText = (val: string) => val.split('-').map(capitalize).join(' ');

function BadgeVariants () {
  return (
    <DtStack
      id="components-badge--variants-container"
      direction="row"
      gap="100"
      align="center"
      className="d-ff-row-wrap"
    >
      {types.map(type => <DtBadge key={type.value} text={type.display} type={type.value} />)}
      {types.filter(t => t.value !== 'ai').map(type => (
        <DtBadge key={`${type.value}-count`} text="1" type={type.value} kind="count" />
      ))}
      {(Object.keys(BADGE_DECORATION_MODIFIERS) as (keyof typeof BADGE_DECORATION_MODIFIERS)[]).map(decoration => (
        <DtBadge
          key={decoration}
          decoration={decoration}
          text={getDecorationText(decoration)}
          type="default"
          kind="label"
        />
      ))}
    </DtStack>
  );
}

// dialtone-vue's BadgeExamples.story.vue.
function BadgeExamples () {
  return (
    <DtStack gap="100">
      <h2>Kind: Label</h2>
      <DtStack direction="row" gap="100" align="center">
        <DtBadge text="Co-host" />
        <DtBadge text="Customer" />
        <DtBadge text="Locked" startIcon={({ iconSize }) => <DtIconLock size={iconSize} />} />
        <DtBadge text="Chat log" startIcon={({ iconSize }) => <DtIconMessage size={iconSize} />} />
      </DtStack>
      <DtStack direction="row" gap="100" align="center">
        <DtBadge text="Label" decoration="black-900" />
        <DtBadge text="Support" decoration="blue-400" />
        <DtBadge text="Complaint" decoration="red-400" />
      </DtStack>
      <DtStack direction="row" gap="100" align="center">
        <DtBadge text="In progress" type="info" />
        <DtBadge text="Beta" type="info" />
        <DtBadge text="Draft" type="info" />
      </DtStack>
      <DtStack direction="row" gap="100" align="center">
        <DtBadge text="Overdue" type="warning" />
      </DtStack>
      <DtStack direction="row" gap="100" align="center">
        <DtBadge text="Resolved" type="positive" />
      </DtStack>
      <DtStack direction="row" gap="100" align="center">
        <DtBadge
          text="Recording"
          type="critical"
          startIcon={({ iconSize }) => <DtIconRecordFilled size={iconSize} />}
        />
      </DtStack>
      <DtStack direction="row" gap="100" align="center">
        <DtBadge text="Live" type="bulletin" />
        <DtBadge text="Presenter" type="bulletin" />
      </DtStack>
      <DtStack direction="row" gap="100" align="center">
        <DtBadge text="Ai Notes" type="ai" />
        <DtBadge text="Ai Suggestion" type="ai" />
        <DtBadge text="Ai on" type="ai" />
        <DtBadge text="Ai Transcript" type="ai" />
      </DtStack>
      <h2 className="d-mbs-400">Kind: Count</h2>
      <DtStack direction="row" gap="100" align="center">
        <DtBadge
          text="5%"
          kind="count"
          type="positive"
          startIcon={({ iconSize }) => <DtIconArrowUp size={iconSize} />}
        />
      </DtStack>
      <DtStack direction="row" gap="100" align="center">
        <DtBadge
          text="-12%"
          kind="count"
          type="critical"
          startIcon={({ iconSize }) => <DtIconArrowDown size={iconSize} />}
        />
      </DtStack>
      <DtStack direction="row" gap="100" align="center">
        <DtBadge text="1" kind="count" type="bulletin" />
        <DtBadge text="18" kind="count" type="bulletin" />
        <DtBadge text="99+" kind="count" type="bulletin" />
      </DtStack>
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <BadgeDefault {...args} />,

  args: {
    default: 'Badge',
  },
};

export const Count: Story = {
  render: args => <BadgeDefault {...args} />,

  args: {
    default: '1',
    kind: 'count',
  },
};

export const Variants: Story = {
  render: () => <BadgeVariants />,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};

export const Examples: Story = {
  render: () => <BadgeExamples />,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};
