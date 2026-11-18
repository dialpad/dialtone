import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { cx } from '../../common/cx';
import { DtButton } from '../Button';
import { DtIcon } from '../Icon';
import { ICON_NAMES, type IconName } from '../Icon/IconConstants';
import { DtToast, type DtToastProps } from './Toast';
import { TOAST_ALTERNATE_KINDS, TOAST_LAYOUTS } from './ToastConstants';

// Slots are args named as in Vue: `default` and `action` are HTML strings (Vue's template renders them through
// v-html), and `icon` is an icon name. `onClick` is the action button's click.
type ToastStoryArgs = Omit<DtToastProps, 'icon' | 'action' | 'onClick'> & {
  default?: string;
  action?: string;
  icon?: IconName;
  onClick?: () => void;
};

// Vue's getIconNames(): every icon name, after an empty choice.
const iconsList = [undefined, ...ICON_NAMES];

// Default Prop Values
export const argsData = {
  duration: 6000,
  onClose: action('close'),
  onClick: action('click'),
} satisfies Partial<ToastStoryArgs>;

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
  kind: {
    options: TOAST_ALTERNATE_KINDS,
    control: {
      type: 'select',
    },
  },
  layout: {
    options: TOAST_LAYOUTS,
    control: {
      type: 'select',
    },
  },
  open: {
    table: {
      defaultValue: {
        summary: 'false',
      },
    },
  },
  duration: {
    control: {
      type: 'number',
    },
    table: {
      defaultValue: {
        summary: 'null',
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
} satisfies Meta<ToastStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Toast',
  component: DtToast,
  tags: ['!dev', '!autodocs'],
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.Data$/,
} satisfies Meta<ToastStoryArgs>;

export default meta;
type Story = StoryObj<ToastStoryArgs>;

// ToastDefault.story.vue
function ToastDefault ({
  default: defaultSlot,
  action: actionSlot,
  icon,
  onClick,
  onClose,
  ...args
}: ToastStoryArgs) {
  // Vue's template also watches `open`, but doesn't declare it as a prop, so that watcher never fires.
  const [isShown, setIsShown] = useState(!!args.open);

  const shouldInvertButton = args.kind === 'base' || args.kind === 'critical' || args.kind === 'info';
  const isInverted = args.important && shouldInvertButton;
  const buttonKind = isInverted ? 'inverted' : 'muted';
  const linkClass = isInverted ? 'd-link--inverted' : 'd-link--muted';

  return (
    <div>
      <DtButton onClick={() => setIsShown(true)}>
        Click to show!
      </DtButton>

      <aside className="d-toast-wrapper">
        <DtToast
          open={isShown}
          onOpenChange={setIsShown}
          kind={args.kind}
          headerText={args.headerText}
          message={args.message}
          headerId={args.headerId}
          contentId={args.contentId}
          important={args.important}
          showClose={args.showClose}
          showAction={args.showAction}
          showIcon={args.showIcon}
          duration={args.duration}
          layout={args.layout}
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
        </DtToast>
      </aside>
    </div>
  );
}

const DefaultTemplate: Story['render'] = args => <ToastDefault {...args} />;

export const Default: Story = {
  render: DefaultTemplate,

  args: {
    headerText: 'Base title (optional)',
    kind: 'base',
  },

  parameters: {
    percy: {
      args: {
        open: true,
      },
    },
  },
};

export const Critical: Story = {
  render: DefaultTemplate,

  args: {
    ...Default.args,
    headerText: 'Critical title (optional)',
    kind: 'critical',
  },

  parameters: {
    ...Default.parameters,
  },
};

export const Info: Story = {
  render: DefaultTemplate,

  args: {
    ...Default.args,
    headerText: 'Info title (optional)',
    kind: 'info',
  },

  parameters: {
    ...Default.parameters,
  },
};

export const Positive: Story = {
  render: DefaultTemplate,

  args: {
    ...Default.args,
    headerText: 'Positive title (optional)',
    kind: 'positive',
  },

  parameters: {
    ...Default.parameters,
  },
};

export const Warning: Story = {
  render: DefaultTemplate,

  args: {
    ...Default.args,
    headerText: 'Warning title (optional)',
    kind: 'warning',
  },

  parameters: {
    ...Default.parameters,
  },
};

export const Important: Story = {
  render: DefaultTemplate,

  args: {
    ...Default.args,
    important: true,
  },

  parameters: {
    ...Default.parameters,
  },
};
