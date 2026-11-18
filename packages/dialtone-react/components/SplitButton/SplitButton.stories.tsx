import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import {
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_SIZE_MODIFIERS,
  ICON_POSITION_MODIFIERS,
  type ButtonIconPosition,
  type ButtonImportance,
  type ButtonKind,
  type ButtonSize,
} from '../Button';
import { DtIcon } from '../Icon/Icon';
import { ICON_NAMES, type IconName } from '../Icon/IconConstants';
import { DtListItem } from '../ListItem';
import { DtPopover, POPOVER_DIRECTIONS } from '../Popover';
import { DtStack } from '../Stack';
import { DtSplitButton, type DtSplitButtonIconSlotScope, type DtSplitButtonProps } from './SplitButton';

// Slots are args named as in Vue: `default` is the label text, `end` is HTML, and the icon slots take an icon name, as
// in Vue's SplitButtonDefault.story.vue.
type SplitButtonStoryArgs = Omit<DtSplitButtonProps, 'startIcon' | 'endIcon' | 'end'> & {
  default?: string;
  startIcon?: IconName;
  endIcon?: IconName;
  end?: string;
};

// Vue's getIconNames(): every icon name, after an empty choice.
const iconsList = [undefined, ...ICON_NAMES];

// Set default values at the story level here.
export const argsData = {
  onStartClicked: action('start-clicked'),
  onEndClicked: action('end-clicked'),
  endAriaLabel: 'Open dropdown',
  default: 'Place call',
  dropdownPlacement: 'bottom-end',
  endTooltipText: 'More calling options',
  startIcon: undefined,
  endIcon: undefined,
} satisfies Partial<SplitButtonStoryArgs>;

// `type` (not in Vue's argTypes) is set on props react-docgen reports as a union: Storybook drops a URL value for a
// union arg, so without it the comparison couldn't drive these args in the React frame. Vue's argTypes for its
// deprecated API (alpha*, omega*) aren't here: that API isn't ported.
export const argTypesData = {
  // Slots
  startIcon: {
    options: iconsList,
    table: {
      type: { summary: 'ReactNode | (scope: { size }) => ReactNode' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },

  dropdownList: {
    table: {
      type: { summary: 'ReactNode | (scope: { close }) => ReactNode' },
    },
  },

  end: {
    table: {
      type: { summary: 'ReactNode' },
    },
  },

  endIcon: {
    options: iconsList,
    table: {
      type: { summary: 'ReactNode | (scope: { size }) => ReactNode' },
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
  },

  // Props
  assertiveOnFocus: {
    control: 'boolean',
  },

  disabled: {
    control: 'boolean',
  },

  importance: {
    control: 'select',
    options: Object.keys(BUTTON_IMPORTANCE_MODIFIERS),
    type: 'string',
  },

  kind: {
    control: 'select',
    options: Object.keys(BUTTON_KIND_MODIFIERS).filter(k => k !== 'inverted'),
    type: 'string',
  },

  size: {
    control: 'select',
    options: Object.keys(BUTTON_SIZE_MODIFIERS),
    type: 'string',
  },

  startActive: {
    control: 'boolean',
  },

  startButtonClass: {
    control: 'text',
  },

  startDisabled: {
    control: 'boolean',
  },

  startIconPosition: {
    control: 'select',
    options: Object.keys(ICON_POSITION_MODIFIERS),
    type: 'string',
  },

  showDivider: {
    control: 'boolean',
  },

  startLoading: {
    control: 'boolean',
  },

  endActive: {
    control: 'boolean',
  },

  endButtonClass: {
    control: 'text',
  },

  endDisabled: {
    control: 'boolean',
  },

  startTo: {
    control: 'text',
    type: 'string',
  },

  startHref: {
    control: 'text',
    type: 'string',
  },

  startTarget: {
    control: 'text',
    type: 'string',
  },

  startRel: {
    control: 'text',
    type: 'string',
  },

  startReplace: {
    control: 'boolean',
  },

  dropdownPlacement: {
    options: POPOVER_DIRECTIONS,
    type: 'string',
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: 'bottom',
      },
    },
  },

  // Action Event Handlers
  onStartClicked: {
    table: {
      disable: true,
    },
  },

  onEndClicked: {
    table: {
      disable: true,
    },
  },
} satisfies Meta<SplitButtonStoryArgs>['argTypes'] & Record<string, object>;

// Story Collection
const meta = {
  title: 'Components/Split Button',
  component: DtSplitButton,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<SplitButtonStoryArgs>;

export default meta;
type Story = StoryObj<SplitButtonStoryArgs>;

const iconSlot = (name: IconName | undefined) => name && (
  ({ size }: DtSplitButtonIconSlotScope) => <DtIcon name={name} size={size} />
);

const options = ['Option 1', 'Option 2', 'Option 3'];

// SplitButtonDefault.story.vue
function SplitButtonDefault ({ default: defaultSlot, startIcon, endIcon, end, ...args }: SplitButtonStoryArgs) {
  return (
    <DtSplitButton
      startActive={args.startActive}
      startAriaLabel={args.startAriaLabel}
      startButtonClass={args.startButtonClass}
      startIconPosition={args.startIconPosition}
      startLabelClass={args.startLabelClass}
      startLoading={args.startLoading}
      startTooltipText={args.startTooltipText}
      assertiveOnFocus={args.assertiveOnFocus}
      disabled={args.disabled}
      dropdownPlacement={args.dropdownPlacement}
      importance={args.importance}
      kind={args.kind}
      endActive={args.endActive}
      endAriaLabel={args.endAriaLabel}
      endButtonClass={args.endButtonClass}
      endId={args.endId}
      endTooltipText={args.endTooltipText}
      className={args.className}
      size={args.size}
      startTo={args.startTo}
      startReplace={args.startReplace}
      startHref={args.startHref}
      startTarget={args.startTarget}
      startRel={args.startRel}
      width={args.width}
      onStartClicked={args.onStartClicked}
      onEndClicked={args.onEndClicked}
      startIcon={iconSlot(startIcon)}
      endIcon={iconSlot(endIcon)}
      dropdownList={({ close }) => options.map(option => (
        <DtListItem
          key={option}
          role="menuitem"
          navigationType="arrow-keys"
          onClick={close}
        >
          {option}
        </DtListItem>
      ))}
      end={end ? <span dangerouslySetInnerHTML={{ __html: end }} /> : undefined}
    >
      {defaultSlot || undefined}
    </DtSplitButton>
  );
}

const sizeNameMapping: Partial<Record<ButtonSize, string>> = {
  xs: 'Extra small',
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra large',
};

const sizes = Object.keys(BUTTON_SIZE_MODIFIERS) as ButtonSize[];
const kinds = (Object.keys(BUTTON_KIND_MODIFIERS) as ButtonKind[]).filter(k => k !== 'inverted');
const importanceList = Object.keys(BUTTON_IMPORTANCE_MODIFIERS) as ButtonImportance[];
const iconPositions = Object.keys(ICON_POSITION_MODIFIERS) as ButtonIconPosition[];
const listItems = [
  { id: 1, text: 'First item' },
  { id: 2, text: 'Second item' },
  { id: 3, text: 'Third item' },
];
const invalidCombinations = [
  { kind: 'muted', importance: 'primary' },
];

const endTooltipText = 'More calling options';
const endAriaLabel = 'More calling options';

const isInvalidCombination = (item: { kind: ButtonKind; importance: ButtonImportance }) =>
  invalidCombinations.some(combination =>
    combination.kind === item.kind && combination.importance === item.importance);

// The "Disabled" column, which Vue's template repeats twice.
function DisabledColumn () {
  return (
    <DtStack gap="200" className="d-br d-bc-default d-pie-200">
      <h2>Disabled</h2>
      <DtStack gap="200">
        <DtSplitButton size={100} startDisabled endTooltipText={endTooltipText} endAriaLabel={endAriaLabel}>
          Start disabled
        </DtSplitButton>
        <DtSplitButton size={100} endDisabled endTooltipText={endTooltipText} endAriaLabel={endAriaLabel}>
          End disabled
        </DtSplitButton>
        <DtSplitButton size={100} disabled endTooltipText={endTooltipText} endAriaLabel={endAriaLabel}>
          Both disabled
        </DtSplitButton>
      </DtStack>
    </DtStack>
  );
}

// SplitButtonVariants.story.vue
function SplitButtonVariants () {
  const [isPopoverShown, setIsPopoverShown] = useState(false);

  return (
    <DtStack gap="200" className="d-px-100">
      <h2>Variants</h2>
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
                <td key={`${kind}-${importance}`} className="d-ta-center d-br d-bc-default">
                  {isInvalidCombination({ kind, importance })
                    ? <abbr className="d-td-none d-fs-100" title="Not applicable">N/A</abbr>
                    : (
                      <DtStack gap="200" className="d-jc-center">
                        <div>
                          <DtSplitButton
                            kind={kind}
                            importance={importance}
                            endTooltipText={endTooltipText}
                            endAriaLabel={endAriaLabel}
                            dropdownList={listItems.map(item => (
                              <DtListItem key={item.id} role="menuitem" navigationType="arrow-keys">
                                {item.text}
                              </DtListItem>
                            ))}
                          >
                            Place call
                          </DtSplitButton>
                        </div>
                      </DtStack>
                    )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <DtStack direction="row" gap="200" className="d-ai-stretch d-jc-flex-start d-fw-wrap">
        {/* Sizes */}
        <DtStack gap="200" className="d-br d-pie-200">
          <h2>Sizes</h2>
          <DtStack gap="200">
            {sizes.map(size => (
              <div key={size} className="d-ta-center">
                <DtSplitButton size={size} endTooltipText={endTooltipText} endAriaLabel={endAriaLabel}>
                  <span className="d-tt-capitalize">{sizeNameMapping[size]}</span>
                </DtSplitButton>
              </div>
            ))}
          </DtStack>
        </DtStack>
        {/* With start icon */}
        <DtStack gap="200" className="d-br d-pie-200">
          <h2>With start icon</h2>
          <DtStack gap="200">
            {iconPositions.map(position => (
              <div key={position} className="d-ta-center">
                <DtSplitButton
                  size={100}
                  startIconPosition={position}
                  endTooltipText={endTooltipText}
                  endAriaLabel={endAriaLabel}
                  startIcon={<DtIcon name="accessibility" size="300" />}
                >
                  <span className="d-tt-capitalize">{position}</span>
                </DtSplitButton>
              </div>
            ))}
          </DtStack>
        </DtStack>
        {/* With custom end icon */}
        <DtStack gap="200" className="d-br d-pie-200">
          <h2>With custom end icon</h2>
          <DtStack gap="200">
            {sizes.map(size => (
              <div key={size} className="d-ta-center">
                <DtSplitButton
                  size={size}
                  endTooltipText="Close"
                  endAriaLabel={endAriaLabel}
                  endIcon={({ size: iconSize }) => <DtIcon name="close" size={iconSize} />}
                >
                  Place call
                </DtSplitButton>
              </div>
            ))}
          </DtStack>
        </DtStack>
        {/* Status */}
        <DtStack gap="200" className="d-br d-pie-200">
          <h2>Status</h2>
          <DtStack gap="200">
            <DtSplitButton size={100} startActive endTooltipText={endTooltipText} endAriaLabel={endAriaLabel}>
              Start active
            </DtSplitButton>
            <DtSplitButton size={100} endActive endTooltipText={endTooltipText} endAriaLabel={endAriaLabel}>
              End active
            </DtSplitButton>
            <DtSplitButton
              size={100}
              startActive
              endActive
              endTooltipText={endTooltipText}
              endAriaLabel={endAriaLabel}
            >
              Both active
            </DtSplitButton>
            <DtSplitButton
              size={100}
              startLoading
              startAriaLabel="loading"
              endTooltipText={endTooltipText}
              endAriaLabel={endAriaLabel}
            />
          </DtStack>
        </DtStack>
        {/* Disabled */}
        <DisabledColumn />
        {/* Disabled, again: Vue's template repeats this column */}
        <DisabledColumn />
        {/* With tooltip */}
        <DtStack gap="200" className="d-br d-pie-200">
          <h2>With tooltip</h2>
          <DtStack gap="200">
            <DtSplitButton
              size={100}
              startTooltipText="Hover text"
              endTooltipText={endTooltipText}
              endAriaLabel={endAriaLabel}
            >
              Hover me
            </DtSplitButton>
            <DtSplitButton size={100} endTooltipText={endTooltipText} endAriaLabel={endAriaLabel}>
              Hover end
            </DtSplitButton>
            <DtSplitButton
              size={100}
              startTooltipText="Start tooltip"
              endTooltipText={endTooltipText}
              endAriaLabel={endAriaLabel}
            >
              Hover both
            </DtSplitButton>
          </DtStack>
        </DtStack>
        {/* Icon-only */}
        <DtStack gap="200" className="d-br d-pie-200">
          <h2>Icon only</h2>
          <DtStack gap="200">
            {sizes.map(size => (
              <div key={`icon-only-${size}`} className="d-ta-center">
                <DtSplitButton
                  startTooltipText="Call"
                  startAriaLabel="Call"
                  endTooltipText={endTooltipText}
                  size={size}
                  endAriaLabel={endAriaLabel}
                  startIcon={({ size: iconSize }) => <DtIcon name="phone" size={iconSize} />}
                />
              </div>
            ))}
          </DtStack>
        </DtStack>
        {/* External anchor */}
        <DtStack>
          <h2>External anchor</h2>
          <div>
            <DtSplitButton
              endId="external-anchor-example"
              endTooltipText="Open popover"
              endAriaLabel={endAriaLabel}
              onEndClicked={() => setIsPopoverShown(true)}
            >
              External anchor example
            </DtSplitButton>
          </div>

          <DtPopover
            open={isPopoverShown}
            onOpenChange={setIsPopoverShown}
            externalAnchor="external-anchor-example"
            content={(
              <ul>
                <li>Custom popover Content</li>
              </ul>
            )}
          />
        </DtStack>
      </DtStack>
    </DtStack>
  );
}

const centered: Story['decorators'] = [
  Story => (
    <DtStack direction="row" justify="center" align="center" className="d-h-250">
      <Story />
    </DtStack>
  ),
];

export const Default: Story = {
  render: args => <SplitButtonDefault {...args} />,

  decorators: centered,
};

export const WithLink: Story = {
  render: args => <SplitButtonDefault {...args} />,

  args: {
    ...argsData,
    startHref: 'https://dialpad.com',
    startTarget: '_blank',
    startRel: 'noopener noreferrer',
    default: 'Visit Dialpad',
  },

  decorators: centered,
};

export const WithRouterLink: Story = {
  render: args => <SplitButtonDefault {...args} />,

  args: {
    ...argsData,
    startTo: '/components/button',
    default: 'Go to Button',
  },

  decorators: centered,
};

export const Variants: Story = {
  render: () => <SplitButtonVariants />,

  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
