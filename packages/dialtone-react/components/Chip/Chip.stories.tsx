import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtAvatar } from '../Avatar';
import { DtIcon, ICON_NAMES, type IconName } from '../Icon';
import { DtStack } from '../Stack';
import { DtChip, type DtChipProps } from './Chip';
import { CHIP_ICON_SIZES, CHIP_SIZE_MODIFIERS } from './ChipConstants';

// The slots are args named as in Vue: `default` is the label's HTML, and `icon` and `avatar` take an icon name and a
// full name, which the templates render into the matching slot.
type ChipStoryArgs = Omit<DtChipProps, 'icon' | 'avatar'> & {
  default?: string;
  icon?: IconName;
  avatar?: string;
  avatarSeed?: string;
};

// Vue's getIconNames(): every icon name, after an empty choice.
const ICONS_LIST = [undefined, ...ICON_NAMES];

export const argsData = {
  onClose: action('close'),
  onClick: action('click'),
  size: 300,
  avatarSeed: '',
} satisfies Partial<ChipStoryArgs>;

export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  icon: {
    options: ICONS_LIST,
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },

  avatar: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  showClose: {
    control: 'boolean',
  },
  interactive: {
    control: 'boolean',
  },
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  size: {
    options: Object.keys(CHIP_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  ariaLabel: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Action Event Handlers. Vue hides the `onX` rows and documents the `close` and `click` events instead; in React
  // the handler is the event, so its row carries that documentation.
  onClick: {
    description: 'Native chip click event',
    table: {
      type: { summary: 'event' },
    },
  },
  onClose: {
    description: 'Native chip close button event',
    table: {
      type: { summary: 'event' },
    },
  },
  onKeyUp: {
    table: {
      disable: true,
    },
  },
} satisfies Meta<ChipStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Chip',
  component: DtChip,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<ChipStoryArgs>;

export default meta;
type Story = StoryObj<ChipStoryArgs>;

// ChipDefault.story.vue
function ChipDefault (args: ChipStoryArgs) {
  const iconSize = CHIP_ICON_SIZES[String(args.size) as keyof typeof CHIP_ICON_SIZES];

  return (
    <DtChip
      id={args.id}
      disabled={args.disabled}
      showClose={args.showClose}
      interactive={args.interactive}
      size={args.size}
      ariaLabel={args.ariaLabel}
      contentClass={args.contentClass}
      onClick={args.onClick}
      onClose={args.onClose}
      icon={args.icon ? <DtIcon name={args.icon} size={iconSize} /> : undefined}
      avatar={!args.icon && args.avatar ? <DtAvatar fullName={args.avatar} seed={args.avatarSeed} /> : undefined}
    >
      {args.default && <span dangerouslySetInnerHTML={{ __html: args.default }} />}
    </DtChip>
  );
}

// ChipVariants.story.vue
function ChipVariants ({ avatarSeed }: ChipStoryArgs) {
  return (
    <DtStack gap="100">
      <div>
        <h4>With Icon</h4>
        <DtChip icon={<DtIcon name="lock-filled" size="200" />}>
          Chip
        </DtChip>
      </div>
      <div>
        <h4>With Avatar</h4>
        <DtChip avatar={<DtAvatar size="200" fullName="Jaqueline Nackos" seed={avatarSeed} />}>
          Chip
        </DtChip>
      </div>
      <div>
        <h4>Interactive</h4>
        <DtChip interactive showClose={false}>
          Chip
        </DtChip>
      </div>
      <div>
        <h4>Sizes</h4>
        <DtStack gap="100" direction="row">
          <DtChip size="100" interactive showClose={false}>
            Chip 100
          </DtChip>
          <DtChip size="200" interactive showClose={false}>
            Chip 200
          </DtChip>
          <DtChip size="300" interactive showClose={false}>
            Chip 300 (default)
          </DtChip>
        </DtStack>
      </div>
    </DtStack>
  );
}

// Stories
export const Default: Story = {
  render: args => <ChipDefault {...args} />,
  args: { default: 'Chip' },
};

export const Variants: Story = {
  render: args => <ChipVariants {...args} />,

  parameters: {
    percy: {
      args: {
        avatarSeed: 'seed',
      },
    },
    options: { showPanel: false },
    controls: { disable: true },
  },
};
