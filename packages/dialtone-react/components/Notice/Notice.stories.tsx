import type { MouseEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { cx } from '../../common/cx';
import { DtButton } from '../Button';
import { DtIcon } from '../Icon';
import { ICON_NAMES, type IconName } from '../Icon/IconConstants';
import { DtNotice, type DtNoticeProps } from './Notice';
import { NOTICE_KINDS, NOTICE_ROLES } from './NoticeConstants';

// Slots are args named as in Vue: `default` and `action` are HTML strings (Vue's template renders them through
// v-html), and `icon` is an icon name. `onClick` is the action button's click, and `show` is unused, as in Vue.
type NoticeStoryArgs = Omit<DtNoticeProps, 'icon' | 'action' | 'onClick'> & {
  default?: string;
  action?: string;
  icon?: IconName;
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  show?: boolean;
};

// Vue's getIconNames(): every icon name, after an empty choice.
const iconsList = [undefined, ...ICON_NAMES];

// Default Prop Values
export const argsData = {
  onClose: action('close'),
  onClick: action('click'),
  show: undefined,
} satisfies Partial<NoticeStoryArgs>;

const argsDataLongText = {
  headerText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
  default: `Duis aute irure dolor in reprehenderit in voluptate velit
      esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
};

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
  kind: {
    options: NOTICE_KINDS,
    control: {
      type: 'select',
    },
  },
  role: {
    options: NOTICE_ROLES,
    control: {
      type: 'select',
    },
  },
  show: {
    table: {
      disable: true,
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
  truncateText: {
    control: {
      type: 'boolean',
    },
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
} satisfies Meta<NoticeStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Notice',
  component: DtNotice,
  tags: ['!dev', '!autodocs'],
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.Data$/,
} satisfies Meta<NoticeStoryArgs>;

export default meta;
type Story = StoryObj<NoticeStoryArgs>;

// NoticeDefault.story.vue
function NoticeDefault ({
  default: defaultSlot,
  action: actionSlot,
  icon,
  onClick,
  onClose,
  ...args
}: NoticeStoryArgs) {
  const shouldInvertButton = args.kind === 'base' || args.kind === 'critical' || args.kind === 'info';
  const isInverted = args.important && shouldInvertButton;
  const buttonKind = isInverted ? 'inverted' : 'muted';
  const linkClass = isInverted ? 'd-link--inverted' : 'd-link--muted';

  return (
    <DtNotice
      kind={args.kind}
      role={args.role}
      headerText={args.headerText}
      headerId={args.headerId}
      contentId={args.contentId}
      important={args.important}
      showClose={args.showClose}
      showAction={args.showAction}
      truncateText={args.truncateText}
      showIcon={args.showIcon}
      onClose={onClose}
      action={actionSlot
        ? <span dangerouslySetInnerHTML={{ __html: actionSlot }} />
        : (
          <DtButton
            size={200}
            importance="outlined"
            kind={buttonKind}
            onClick={onClick}
          >
            Action
          </DtButton>
          )}
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
    </DtNotice>
  );
}

const Template: Story['render'] = args => <NoticeDefault {...args} />;

export const Default: Story = {
  render: Template,

  args: {
    headerText: 'Base title (optional)',
    kind: 'base',
  },
};

export const Critical: Story = {
  render: Template,

  args: {
    ...Default.args,
    headerText: 'Critical title (optional)',
    kind: 'critical',
  },
};

export const Info: Story = {
  render: Template,

  args: {
    ...Default.args,
    headerText: 'Info title (optional)',
    kind: 'info',
  },
};

export const Positive: Story = {
  render: Template,

  args: {
    ...Default.args,
    headerText: 'Positive title (optional)',
    kind: 'positive',
  },
};

export const Warning: Story = {
  render: Template,

  args: {
    ...Default.args,
    headerText: 'Warning title (optional)',
    kind: 'warning',
  },
};

export const Important: Story = {
  render: Template,

  args: {
    ...Default.args,
    important: true,
  },
};

export const TruncateContent: Story = {
  render: Template,

  args: {
    ...Default.args,
    truncateText: true,
    headerText: argsDataLongText.headerText,
    default: argsDataLongText.default,
  },
};
