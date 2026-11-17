import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtIcon } from '../Icon/Icon';
import { ICON_NAMES, type IconName } from '../Icon/IconConstants';
import { LINK_KIND_MODIFIERS } from '../Link/LinkConstants';
import { DtStack } from '../Stack/Stack';
import { DtButton, type DtButtonIconSlotScope, type DtButtonProps } from './Button';
import {
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_SIZE_MODIFIERS,
  BUTTON_TYPES,
  ICON_POSITION_MODIFIERS,
  INVALID_COMBINATION,
  type ButtonImportance,
  type ButtonKind,
  type ButtonSize,
} from './ButtonConstants';

// Slots are args named as in Vue: `default` is the label's HTML, and the icon slots take an icon name, as in Vue's
// ButtonDefault.story.vue.
type ButtonStoryArgs = Omit<DtButtonProps, 'icon' | 'startIcon' | 'endIcon' | 'blockStartIcon' | 'blockEndIcon'> & {
  default?: string;
  icon?: IconName;
  startIcon?: IconName;
  endIcon?: IconName;
  blockStartIcon?: IconName;
  blockEndIcon?: IconName;
};

export const argsData = {
  onClick: action('click'),
  onFocus: action('focusin'),
  onBlur: action('focusout'),
  size: 300,
  link: false,
} satisfies Partial<ButtonStoryArgs>;

// Vue's getIconNames(): every icon name, after an empty choice.
const iconsList = [undefined, ...ICON_NAMES];

const iconSlotArgType = {
  options: iconsList,
  table: {
    type: { summary: 'ReactNode | (scope: { iconSize }) => ReactNode' },
  },
  control: {
    type: 'select',
    labels: {
      undefined: '(empty)',
    },
  },
} as const;

// `type` (not in Vue's argTypes) is set on props react-docgen reports as a union: Storybook drops a URL value for a
// union arg, so without it the comparison couldn't drive these args in the React frame.
export const argTypesData = {
  // Slots
  default: {
    table: {
      type: { summary: 'ReactNode' },
    },
    control: {
      type: 'text',
    },
  },
  icon: iconSlotArgType,
  startIcon: iconSlotArgType,
  endIcon: iconSlotArgType,
  blockStartIcon: iconSlotArgType,
  blockEndIcon: iconSlotArgType,

  // Props
  active: {
    control: 'boolean',
  },
  assertiveOnFocus: {
    control: 'boolean',
  },
  circle: {
    control: 'boolean',
  },
  importance: {
    control: 'select',
    options: Object.keys(BUTTON_IMPORTANCE_MODIFIERS),
    type: 'string',
  },
  size: {
    control: 'select',
    options: Object.keys(BUTTON_SIZE_MODIFIERS),
    type: 'string',
  },
  kind: {
    control: 'select',
    options: Object.keys(BUTTON_KIND_MODIFIERS).filter(k => k !== 'inverted'),
    type: 'string',
  },
  link: {
    type: 'boolean',
    table: {
      defaultValue: {
        summary: 'false',
      },
    },
    control: 'boolean',
  },
  linkKind: {
    control: 'select',
    options: Object.keys(LINK_KIND_MODIFIERS),
    type: 'string',
  },
  loading: {
    control: 'boolean',
  },
  iconPosition: {
    control: 'select',
    options: Object.keys(ICON_POSITION_MODIFIERS),
    type: 'string',
    table: { category: 'Deprecated' },
    description: 'Use `startIcon`/`endIcon`/`blockStartIcon`/`blockEndIcon` instead.',
  },
  labelClass: {
    description: 'Pass through classes. Used to customize the label container',
  },
  to: {
    control: 'text',
    type: 'string',
  },
  href: {
    control: 'text',
    type: 'string',
  },
  target: {
    control: 'select',
    options: ['_self', '_blank', '_parent', '_top'],
    type: 'string',
  },
  rel: {
    control: 'text',
    type: 'string',
  },
  replace: {
    control: 'boolean',
  },

  // HTML attributes
  disabled: {
    table: {
      category: 'html attributes',
      defaultValue: {
        summary: 'false',
      },
    },
    control: 'boolean',
  },
  type: {
    table: {
      category: 'html attributes',
      defaultValue: {
        summary: 'button',
      },
    },
    control: 'select',
    options: BUTTON_TYPES,
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },
  onFocus: {
    table: {
      disable: true,
    },
  },
  onBlur: {
    table: {
      disable: true,
    },
  },

  focusin: {
    description: 'Native button focus event (onFocus)',
    table: {
      type: { summary: 'event' },
    },
  },
  focusout: {
    description: 'Native button blur event (onBlur)',
    table: {
      type: { summary: 'event' },
    },
  },
} satisfies Meta<ButtonStoryArgs>['argTypes'] & Record<string, object>;

const meta = {
  title: 'Components/Button',
  component: DtButton,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<ButtonStoryArgs>;

export default meta;
type Story = StoryObj<ButtonStoryArgs>;

const iconSlot = (name: IconName | undefined) => name && (
  ({ iconSize }: DtButtonIconSlotScope) => <DtIcon name={name} size={iconSize} />
);

// ButtonDefault.story.vue
function ButtonDefault ({
  default: defaultSlot,
  icon,
  startIcon,
  endIcon,
  blockStartIcon,
  blockEndIcon,
  ...args
}: ButtonStoryArgs) {
  return (
    <DtButton
      importance={args.importance}
      type={args.type}
      size={args.size}
      kind={args.kind}
      circle={args.circle}
      loading={args.loading}
      labelClass={args.labelClass}
      assertiveOnFocus={args.assertiveOnFocus}
      link={args.link}
      linkKind={args.linkKind}
      iconPosition={args.iconPosition}
      disabled={args.disabled}
      width={args.width}
      active={args.active}
      to={args.to}
      href={args.href}
      target={args.target}
      rel={args.rel}
      replace={args.replace}
      onClick={args.onClick}
      onFocus={args.onFocus}
      onBlur={args.onBlur}
      startIcon={iconSlot(startIcon)}
      icon={iconSlot(icon)}
      endIcon={iconSlot(endIcon)}
      blockStartIcon={iconSlot(blockStartIcon)}
      blockEndIcon={iconSlot(blockEndIcon)}
    >
      {defaultSlot && <span dangerouslySetInnerHTML={{ __html: defaultSlot }} />}
    </DtButton>
  );
}

const sizes = Object.keys(BUTTON_SIZE_MODIFIERS) as ButtonSize[];
const importanceList = Object.keys(BUTTON_IMPORTANCE_MODIFIERS) as ButtonImportance[];
const iconPositions = Object.keys(ICON_POSITION_MODIFIERS) as (keyof typeof ICON_POSITION_MODIFIERS)[];
const variantKinds = (Object.keys(BUTTON_KIND_MODIFIERS) as ButtonKind[])
  .filter(k => k !== 'unstyled' && k !== 'inverted');
const disabledKinds = variantKinds;

const isInvalidCombination = ({ kind, importance }: { kind: ButtonKind; importance: ButtonImportance }) =>
  INVALID_COMBINATION.some(c => !c.circle && c.kind === kind && c.importance === importance);

const downloadIcon = ({ iconSize }: DtButtonIconSlotScope) => <DtIcon name="download" size={iconSize} />;

function KindImportanceTable ({ kinds, disabled = false }: { kinds: ButtonKind[]; disabled?: boolean }) {
  return (
    <table className="d-table d-bt d-bb d-bbw2">
      <thead>
        <tr>
          <td className="d-ba d-bc-default">
            &nbsp;
          </td>
          {importanceList.map(importance => (
            <th key={importance} className="d-ta-center d-br">
              {importance}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {kinds.map(kind => (
          <tr key={kind}>
            <th className="d-ta-right d-ba d-brw2" scope="row">
              <span className="d-headline--eyebrow">{kind}</span>
            </th>
            {importanceList.map(importance => (
              <td key={`${disabled ? 'disabled-' : ''}${kind}-${importance}`} className="d-ta-center d-br d-bc-default">
                {isInvalidCombination({ kind, importance })
                  ? <abbr className="d-td-none d-fs-100" title="Not applicable">N/A</abbr>
                  : (
                    <DtButton kind={kind} importance={importance} disabled={disabled}>
                      {disabled ? `${kind} / ${importance}` : 'Place Call'}
                    </DtButton>
                  )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ButtonVariants.story.vue
function ButtonVariants () {
  return (
    <DtStack gap="200" className="d-px-100">
      <h2>Variants</h2>
      <KindImportanceTable kinds={variantKinds} />

      {/* Unstyled */}
      <h2>Unstyled</h2>
      <div>
        <DtButton kind="unstyled">
          Unstyled
        </DtButton>
      </div>

      {/* Sizes */}
      <h2>Sizes</h2>
      <DtStack direction="row" gap="100">
        {sizes.map(size => (
          <DtButton key={size} size={size}>
            {size}
          </DtButton>
        ))}
      </DtStack>

      {/* Icon positions */}
      <h2>Icon positions</h2>
      <DtStack direction="row" gap="100">
        {iconPositions.map(position => (
          <DtButton key={position} iconPosition={position} icon={downloadIcon}>
            {position}
          </DtButton>
        ))}
        {/* Circle */}
        <DtButton importance="outlined" circle aria-label="Icon only" startIcon={downloadIcon} />
        {/* Icon only */}
        <DtButton aria-label="Icon only" startIcon={downloadIcon} />

        {/* Icon Left */}
        <DtButton startIcon={downloadIcon}>
          Icon Left
        </DtButton>

        {/* Icon Right */}
        <DtButton endIcon={downloadIcon}>
          Icon Right
        </DtButton>

        {/* Icon Top */}
        <DtButton blockStartIcon={downloadIcon}>
          Icon Top
        </DtButton>

        {/* Icon Bottom */}
        <DtButton blockEndIcon={downloadIcon}>
          Icon Bottom
        </DtButton>
      </DtStack>
      <DtStack direction="row" gap="100">
        {/* Loading */}
        <DtButton loading>
          Button
        </DtButton>
      </DtStack>

      {/* Link */}
      <h2>Link</h2>
      <div>
        <DtButton link>
          Link Button
        </DtButton>
      </div>

      {/* Active */}
      <h2>Active</h2>
      <DtStack direction="row" gap="100">
        <DtButton active>
          Active button
        </DtButton>
        <DtButton active kind="critical">
          Active Critical button
        </DtButton>
        <DtButton active kind="positive">
          Active Positive button
        </DtButton>
      </DtStack>

      {/* Disabled */}
      <h2>Disabled</h2>
      <KindImportanceTable kinds={disabledKinds} disabled />
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <ButtonDefault {...args} />,

  args: {
    default: 'Button',
  },
};

export const Variants: Story = {
  render: () => <ButtonVariants />,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};

export const WithStartIcon: Story = {
  render: args => <ButtonDefault {...args} />,

  args: {
    default: 'Start Icon',
    startIcon: 'send',
  },
};

export const WithEndIcon: Story = {
  render: args => <ButtonDefault {...args} />,

  args: {
    default: 'End Icon',
    endIcon: 'arrow-right',
  },
};

export const WithBothIcons: Story = {
  render: args => <ButtonDefault {...args} />,

  args: {
    default: 'Both Icons',
    startIcon: 'send',
    endIcon: 'arrow-right',
  },
};

export const WithBlockStartIcon: Story = {
  render: args => <ButtonDefault {...args} />,

  args: {
    default: 'Block Start Icon',
    blockStartIcon: 'phone',
  },
};

export const WithBlockEndIcon: Story = {
  render: args => <ButtonDefault {...args} />,

  args: {
    default: 'Block End Icon',
    blockEndIcon: 'phone',
  },
};
