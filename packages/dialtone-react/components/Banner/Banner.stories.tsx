import { useState, type MouseEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { cx } from '../../common/cx';
import { DtButton } from '../Button';
import { DtIcon } from '../Icon';
import { ICON_NAMES, type IconName } from '../Icon/IconConstants';
import { NOTICE_KINDS } from '../Notice';
import { DtBanner, type DtBannerProps } from './Banner';

import { asset } from '../../.storybook/asset';
// Slots are args named as in Vue: `default` and `action` are HTML strings (Vue's template renders the default one
// through v-html), and `icon` is an icon name. `onClick` is the action button's click, and `show` shows the banner
// from the start and makes it sticky.
type BannerStoryArgs = Omit<DtBannerProps, 'icon' | 'action' | 'onClick'> & {
  default?: string;
  action?: string;
  icon?: IconName;
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  show?: boolean;
};

// Vue's getIconNames(): every icon name, after an empty choice.
const iconsList = [undefined, ...ICON_NAMES];

// Vue imports the file; Storybook serves Vue's assets directory at the root.
const backgroundImage = asset('dialpad-gradient.png');

export const argsData = {
  onClose: action('close'),
  onClick: action('click'),
  show: undefined,
  // Vue's story passes null, which the String prop takes as is; React's default for no image is ''.
  backgroundImage: undefined,
} satisfies Partial<BannerStoryArgs>;

export const argTypesData = {
  // Slots
  icon: {
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
  default: {
    table: {
      type: { summary: 'ReactNode' },
    },
    control: {
      type: 'text',
    },
  },
  action: {
    table: {
      type: { summary: 'ReactNode' },
    },
    control: {
      type: 'text',
    },
  },

  // Props
  headerText: {
    control: {
      type: 'text',
    },
  },
  kind: {
    options: NOTICE_KINDS,
    control: {
      type: 'select',
    },
  },
  show: {
    table: {
      disable: true,
    },
  },
  headerId: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  contentId: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  showClose: {
    control: {
      type: 'boolean',
    },
  },
  showIcon: {
    control: {
      type: 'boolean',
    },
  },
  showAction: {
    control: {
      type: 'boolean',
    },
  },
  important: {
    control: {
      type: 'boolean',
    },
  },
  pinned: {
    control: {
      type: 'boolean',
    },
  },

  dialogClass: {
    description: 'Inner dialog class',
  },
  backgroundImage: {
    control: { type: 'text' },
  },
  backgroundSize: {
    control: { type: 'text' },
  },
  iconClass: {
    description: 'Additional class name for the icon wrapper element.',
  },
  headerClass: {
    description: 'Additional class name for the header wrapper element.',
  },
  contentClass: {
    description: 'Additional class name for the content wrapper element.',
  },
  actionClass: {
    description: 'Additional class name for the action wrapper element.',
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },
  onClose: {
    description: 'Close button click event',
    table: {
      disable: true,
    },
  },
} satisfies Meta<BannerStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Banner',
  component: DtBanner,
  tags: ['!dev', '!autodocs'],
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.Data$/,
} satisfies Meta<BannerStoryArgs>;

export default meta;
type Story = StoryObj<BannerStoryArgs>;

// BannerDefault.story.vue
function BannerDefault ({
  default: defaultSlot,
  action: actionSlot,
  icon,
  onClick,
  onClose,
  show,
  ...args
}: BannerStoryArgs) {
  const [displayBanner, setDisplayBanner] = useState(!!show);

  const shouldInvertButton = args.kind === 'base' || args.kind === 'critical' || args.kind === 'info';
  const isInverted = args.important && shouldInvertButton;
  const buttonKind = isInverted ? 'inverted' : 'muted';
  const linkClass = isInverted ? 'd-link--inverted' : 'd-link--muted';

  return (
    <div>
      <DtButton
        style={displayBanner ? { display: 'none' } : undefined}
        onClick={() => setDisplayBanner(true)}
      >
        Click to show!
      </DtButton>

      <DtBanner
        style={displayBanner ? undefined : { display: 'none' }}
        kind={args.kind}
        headerText={args.headerText}
        headerId={args.headerId}
        contentId={args.contentId}
        important={args.important}
        pinned={args.pinned}
        showClose={args.showClose}
        showAction={args.showAction}
        className={cx({ 'd-ps-sticky': show })}
        showIcon={args.showIcon}
        backgroundImage={args.backgroundImage}
        backgroundSize={args.backgroundSize}
        dialogClass={args.dialogClass}
        iconClass={args.iconClass}
        headerClass={args.headerClass}
        contentClass={args.contentClass}
        actionClass={args.actionClass}
        onClose={() => {
          setDisplayBanner(false);
          onClose?.();
        }}
        action={actionSlot
          ? (
            <DtButton
              size={200}
              kind={buttonKind}
              importance="outlined"
              onClick={onClick}
            >
              {actionSlot}
            </DtButton>
            )
          : undefined}
        icon={icon ? <DtIcon name={icon} /> : undefined}
      >
        {defaultSlot
          ? <span dangerouslySetInnerHTML={{ __html: defaultSlot }} />
          : (
            <span>
              Message body with
              {' '}
              <a
                href="#"
                className={cx('d-link', linkClass)}
              >a link
              </a>.
            </span>
            )}
      </DtBanner>
    </div>
  );
}

const Template: Story['render'] = args => <BannerDefault {...args} />;

export const Default: Story = {
  render: Template,

  args: {
    headerText: 'Optional title',
    action: 'Action',
    kind: 'base',
  },

  parameters: {
    percy: {
      args: {
        show: true,
      },
    },
  },
};

export const Critical: Story = {
  render: Template,
  args: { ...Default.args, kind: 'critical' },
  parameters: Default.parameters,
};

export const Info: Story = {
  render: Template,
  args: { ...Default.args, kind: 'info' },
  parameters: Default.parameters,
};

export const Positive: Story = {
  render: Template,
  args: { ...Default.args, kind: 'positive' },
  parameters: Default.parameters,
};

export const Warning: Story = {
  render: Template,
  args: { ...Default.args, kind: 'warning' },
  parameters: Default.parameters,
};

export const Pinned: Story = {
  render: Template,
  args: { ...Default.args, pinned: true },
  parameters: Default.parameters,
};

export const CustomBackground: Story = {
  render: Template,

  args: {
    ...Default.args,
    backgroundImage,
    backgroundSize: 'contain',
    headerText: '',
    action: '',
    showIcon: false,
    dialogClass: 'd-fc-neutral-white',
    default: 'The power of Dialpad. On your desktop',
  },
  parameters: Default.parameters,
};
