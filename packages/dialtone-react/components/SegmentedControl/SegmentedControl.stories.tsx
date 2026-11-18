import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtIconBoxSelect, DtIconLaptop2, DtIconListSpacingCompact, DtIconListSpacingExpanded, DtIconListSpacingRegular, DtIconMoon, DtIconSun } from '../../icons';
import { DtBadge } from '../Badge';
import { DtStack } from '../Stack';
import { DtSegmentedControl, type DtSegmentedControlProps } from './SegmentedControl';
import { DtSegmentedControlItem } from './SegmentedControlItem';
import {
  SEGMENTED_CONTROL_SIZES,
  SEGMENTED_CONTROL_SIZE_DEFAULT,
  SEGMENTED_CONTROL_ORIENTATIONS,
  SEGMENTED_CONTROL_ORIENTATION_DEFAULT,
  SEGMENTED_CONTROL_ACTIVATION_MODES,
  SEGMENTED_CONTROL_ACTIVATION_MODE_DEFAULT,
  SEGMENTED_CONTROL_SPREADS,
  SEGMENTED_CONTROL_SPREAD_DEFAULT,
  type SegmentedControlSize,
} from './SegmentedControlConstants';

// The default slot is an arg named as in Vue.
type SegmentedControlStoryArgs = Omit<DtSegmentedControlProps, 'children'> & { default?: string };

export const argsData = {
  orientation: SEGMENTED_CONTROL_ORIENTATION_DEFAULT,
  size: SEGMENTED_CONTROL_SIZE_DEFAULT,
  activationMode: SEGMENTED_CONTROL_ACTIVATION_MODE_DEFAULT,
  disabled: false,
  showDivider: true,
  borderless: false,
  spread: SEGMENTED_CONTROL_SPREAD_DEFAULT,
  labelClass: '',
} satisfies Partial<SegmentedControlStoryArgs>;

export const argTypesData = {
  // Props
  value: {
    control: 'text',
    table: {
      type: { summary: 'string' },
    },
  },
  ariaLabel: {
    control: 'text',
  },
  orientation: {
    control: 'select',
    options: SEGMENTED_CONTROL_ORIENTATIONS,
  },
  size: {
    control: 'select',
    options: SEGMENTED_CONTROL_SIZES,
  },
  activationMode: {
    control: 'select',
    options: SEGMENTED_CONTROL_ACTIVATION_MODES,
  },
  disabled: {
    control: 'boolean',
  },
  showDivider: {
    control: 'boolean',
  },
  borderless: {
    control: 'boolean',
  },
  spread: {
    control: 'select',
    options: SEGMENTED_CONTROL_SPREADS,
  },
  labelClass: {
    control: 'text',
  },

  // Slots
  default: {
    control: 'text',
    table: {
      type: { summary: 'ReactNode' },
    },
  },

  // Events
  onValueChange: {
    action: 'onValueChange',
    table: {
      type: { summary: 'event' },
    },
  },
  onChange: {
    action: 'onChange',
    table: {
      type: { summary: 'event' },
    },
  },
  onBeforeChange: {
    action: 'onBeforeChange',
    table: {
      type: { summary: 'event' },
    },
  },
} satisfies Meta<SegmentedControlStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Segmented Control',
  component: DtSegmentedControl,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<SegmentedControlStoryArgs>;

export default meta;
type Story = StoryObj<SegmentedControlStoryArgs>;

// SegmentedControlDefault.story.vue
function SegmentedControlDefault (args: SegmentedControlStoryArgs) {
  const [selectedValue, setSelectedValue] = useState(args.value ?? 'all');
  // The `value` control sets the selection; clicks still update it.
  const [lastArgValue, setLastArgValue] = useState(args.value);
  if (args.value !== lastArgValue) {
    setLastArgValue(args.value);
    setSelectedValue(args.value ?? 'all');
  }
  return (
    <DtSegmentedControl
      value={selectedValue}
      onValueChange={(value) => {
        setSelectedValue(value);
        args.onValueChange?.(value);
      }}
      onChange={args.onChange}
      onBeforeChange={args.onBeforeChange}
      orientation={args.orientation}
      size={args.size}
      activationMode={args.activationMode}
      disabled={args.disabled}
      showDivider={args.showDivider}
      borderless={args.borderless}
      spread={args.spread}
      labelClass={args.labelClass}
      ariaLabel={args.ariaLabel ?? 'View filter'}
    >
      {viewItems()}
    </DtSegmentedControl>
  );
}

// The four items most variants share.
const viewItems = (disabledValue?: string) => (
  <>
    <DtSegmentedControlItem value="all">
      All
    </DtSegmentedControlItem>
    <DtSegmentedControlItem
      value="favorites"
      disabled={disabledValue === 'favorites'}
    >
      Favorites
    </DtSegmentedControlItem>
    <DtSegmentedControlItem value="recent">
      Recent
    </DtSegmentedControlItem>
    <DtSegmentedControlItem value="groups">
      Groups
    </DtSegmentedControlItem>
  </>
);

const appearanceItems = (
  <>
    <DtSegmentedControlItem
      value="system"
      label="System"
      startIcon={({ iconSize }) => <DtIconLaptop2 size={iconSize} />}
    />
    <DtSegmentedControlItem
      value="light"
      label="Light"
      startIcon={({ iconSize }) => <DtIconSun size={iconSize} />}
    />
    <DtSegmentedControlItem
      value="dark"
      label="Dark"
      startIcon={({ iconSize }) => <DtIconMoon size={iconSize} />}
    />
  </>
);

const sizeItems = ['option1', 'option2', 'option3'].map((value, i) => (
  <DtSegmentedControlItem
    key={value}
    value={value}
    startIcon={({ iconSize }) => <DtIconBoxSelect size={iconSize} />}
    endIcon={({ iconSize }) => <DtIconBoxSelect size={iconSize} />}
  >
    Option {i + 1}
  </DtSegmentedControlItem>
));

const SIZE_EXAMPLES: { size: SegmentedControlSize; label: string }[] = [
  { size: 100, label: 'Extra small size' },
  { size: 200, label: 'Small size' },
  { size: 300, label: 'Default size' },
  { size: 400, label: 'Large size' },
  { size: 500, label: 'Extra large size' },
];

// SegmentedControlVariants.story.vue
function SegmentedControlVariants () {
  const [selectedHorizontal, setSelectedHorizontal] = useState('all');
  const [selectedSpread, setSelectedSpread] = useState('1');
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [selectedIcons, setSelectedIcons] = useState('compact');
  const [selectedTrailing, setSelectedTrailing] = useState('apples');
  const [selectedIconOnly, setSelectedIconOnly] = useState('system');
  const [selectedSize, setSelectedSize] = useState('option1');
  const [selectedDisabled, setSelectedDisabled] = useState('all');
  const [selectedIndividualDisabled, setSelectedIndividualDisabled] = useState('all');
  const [selectedAuto, setSelectedAuto] = useState('all');
  const [selectedManual, setSelectedManual] = useState('all');

  return (
    <DtStack gap="600">
      <DtStack>
        <p className="d-fw-bold d-mbe-100">
          Horizontal (default)
        </p>
        <div>
          <DtSegmentedControl
            value={selectedHorizontal}
            onValueChange={setSelectedHorizontal}
            ariaLabel="Horizontal example"
          >
            {viewItems()}
          </DtSegmentedControl>
        </div>
        <p className="d-mbe-100">
          Horizontal: inline-flex (aka &quot;hug&quot;)
        </p>
        <div>
          <DtSegmentedControl
            value={selectedHorizontal}
            onValueChange={setSelectedHorizontal}
            ariaLabel="Horizontal example"
            className="d-d-inline-flex"
          >
            {viewItems()}
          </DtSegmentedControl>
        </div>
      </DtStack>

      <DtStack>
        <p className="d-fw-bold d-mbe-100">
          No divider
        </p>
        <div>
          <DtSegmentedControl
            value={selectedHorizontal}
            onValueChange={setSelectedHorizontal}
            showDivider={false}
            ariaLabel="No divider example"
          >
            {viewItems()}
          </DtSegmentedControl>
        </div>
      </DtStack>

      <DtStack>
        <p className="d-fw-bold d-mbe-100">
          Borderless
        </p>
        <div>
          <DtSegmentedControl
            value={selectedHorizontal}
            onValueChange={setSelectedHorizontal}
            borderless
            ariaLabel="Borderless example"
          >
            {viewItems()}
          </DtSegmentedControl>
        </div>
      </DtStack>

      <DtStack>
        <p className="d-fw-bold d-mbe-100">
          Spread: evenly
        </p>
        <div>
          <DtSegmentedControl
            value={selectedSpread}
            onValueChange={setSelectedSpread}
            spread="evenly"
            ariaLabel="Spread evenly example"
          >
            <DtSegmentedControlItem value="1">
              1
            </DtSegmentedControlItem>
            <DtSegmentedControlItem value="two">
              Two
            </DtSegmentedControlItem>
            <DtSegmentedControlItem value="three">
              Three
            </DtSegmentedControlItem>
            <DtSegmentedControlItem value="four">
              Four long label
            </DtSegmentedControlItem>
          </DtSegmentedControl>
        </div>
      </DtStack>

      <DtStack>
        <p className="d-fw-bold d-mbe-100">
          With icons
        </p>
        <div>
          <DtSegmentedControl
            value={selectedIcons}
            onValueChange={setSelectedIcons}
            ariaLabel="List spacing"
          >
            <DtSegmentedControlItem
              value="compact"
              startIcon={({ iconSize }) => <DtIconListSpacingCompact size={iconSize} />}
            >
              Compact
            </DtSegmentedControlItem>
            <DtSegmentedControlItem
              value="regular"
              startIcon={({ iconSize }) => <DtIconListSpacingRegular size={iconSize} />}
            >
              Regular
            </DtSegmentedControlItem>
            <DtSegmentedControlItem
              value="expanded"
              startIcon={({ iconSize }) => <DtIconListSpacingExpanded size={iconSize} />}
            >
              Expanded
            </DtSegmentedControlItem>
          </DtSegmentedControl>
        </div>
      </DtStack>

      <DtStack>
        <p className="d-fw-bold d-mbe-100">
          Icon only
        </p>
        <div>
          <DtSegmentedControl
            value={selectedIconOnly}
            onValueChange={setSelectedIconOnly}
            ariaLabel="Appearance mode"
          >
            {appearanceItems}
          </DtSegmentedControl>
        </div>
        <p className="d-fw-bold d-mbe-100">
          Icon only (inline-flex)
        </p>
        <div>
          <DtSegmentedControl
            value={selectedIconOnly}
            onValueChange={setSelectedIconOnly}
            ariaLabel="Appearance mode"
            className="d-d-inline-flex"
          >
            {appearanceItems}
          </DtSegmentedControl>
        </div>
      </DtStack>

      <DtStack>
        <p className="d-fw-bold d-mbe-100">
          With trailing slot
        </p>
        <div>
          <DtSegmentedControl
            value={selectedTrailing}
            onValueChange={setSelectedTrailing}
            ariaLabel="Fruit counts"
          >
            <DtSegmentedControlItem
              value="apples"
              trailingClass="d-pie-100"
              trailing={(
                <DtBadge kind="count">
                  24
                </DtBadge>
              )}
            >
              Apples
            </DtSegmentedControlItem>
            <DtSegmentedControlItem
              value="oranges"
              trailingClass="d-pie-100"
              trailing={(
                <DtBadge kind="count">
                  8
                </DtBadge>
              )}
            >
              Oranges
            </DtSegmentedControlItem>
            <DtSegmentedControlItem
              value="bananas"
              trailingClass="d-pie-100"
              trailing={(
                <DtBadge kind="count">
                  15
                </DtBadge>
              )}
            >
              Bananas
            </DtSegmentedControlItem>
          </DtSegmentedControl>
        </div>
      </DtStack>

      <DtStack>
        <p className="d-fw-bold d-mbe-100">
          Vertical
        </p>
        <DtStack
          direction="row"
          gap="400"
          align="start"
        >
          <DtSegmentedControl
            value={selectedIconOnly}
            onValueChange={setSelectedIconOnly}
            ariaLabel="Appearance mode"
            orientation="vertical"
          >
            {appearanceItems}
          </DtSegmentedControl>
          <DtSegmentedControl
            value={selectedVertical}
            onValueChange={setSelectedVertical}
            className="d-w-250"
            orientation="vertical"
            ariaLabel="Vertical example"
            size={100}
          >
            {viewItems()}
          </DtSegmentedControl>
        </DtStack>
      </DtStack>

      <DtStack>
        <p className="d-fw-bold d-mbe-100">
          Sizes
        </p>
        <DtStack gap="400">
          {SIZE_EXAMPLES.map(({ size, label }) => (
            <div key={size}>
              <DtSegmentedControl
                value={selectedSize}
                onValueChange={setSelectedSize}
                size={size}
                ariaLabel={label}
              >
                {sizeItems}
              </DtSegmentedControl>
            </div>
          ))}
        </DtStack>
      </DtStack>

      <DtStack>
        <p className="d-fw-bold d-mbe-100">
          Disabled (entire group)
        </p>
        <div>
          <DtSegmentedControl
            value={selectedDisabled}
            onValueChange={setSelectedDisabled}
            disabled
            ariaLabel="Disabled group example"
          >
            {viewItems()}
          </DtSegmentedControl>
        </div>
      </DtStack>

      <DtStack>
        <p className="d-fw-bold d-mbe-100">
          Individual disabled option
        </p>
        <div>
          <DtSegmentedControl
            value={selectedIndividualDisabled}
            onValueChange={setSelectedIndividualDisabled}
            ariaLabel="Individual disabled example"
          >
            {viewItems('favorites')}
          </DtSegmentedControl>
        </div>
      </DtStack>

      <DtStack>
        <p className="d-fw-bold d-mbe-100">
          Activation mode: auto (selects on focus)
        </p>
        <div>
          <DtSegmentedControl
            value={selectedAuto}
            onValueChange={setSelectedAuto}
            activationMode="auto"
            ariaLabel="Auto activation example"
          >
            {viewItems()}
          </DtSegmentedControl>
        </div>
      </DtStack>

      <DtStack>
        <p className="d-fw-bold d-mbe-100">
          Activation mode: manual (Space/Enter to select)
        </p>
        <div>
          <DtSegmentedControl
            value={selectedManual}
            onValueChange={setSelectedManual}
            activationMode="manual"
            ariaLabel="Manual activation example"
          >
            {viewItems()}
          </DtSegmentedControl>
        </div>
      </DtStack>
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <SegmentedControlDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <SegmentedControlVariants />,
  args: {},
  parameters: {
    controls: { disable: true },
  },
};
