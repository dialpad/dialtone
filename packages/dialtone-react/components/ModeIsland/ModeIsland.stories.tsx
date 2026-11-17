import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtStack } from '../Stack/Stack';
import { DtModeIsland, type DtModeIslandProps } from './ModeIsland';
import { DT_MODE_ISLAND_TYPES } from './ModeIslandConstants';

export const argsData = {
  mode: DT_MODE_ISLAND_TYPES.INVERTED,
  as: 'div',
} satisfies DtModeIslandProps;

export const argTypesData = {
  // Slots
  children: {
    // Vue's `control: { type: null }`, which Storybook's types spell `false`.
    control: false,
    description: 'Slot for main content',
    table: {
      type: {
        summary: 'ReactNode',
        detail: `
Example:
<DtModeIsland>
  <p>Content that will use the specified mode</p>
</DtModeIsland>`,
      },
    },
  },

  // Props
  mode: {
    control: { type: 'select' },
    options: Object.values(DT_MODE_ISLAND_TYPES),
    description: 'The mode to apply to the island',
    table: {
      type: {
        summary: 'String',
        detail: `
- 'inverted': Opposite of parent or root mode
- 'light': Always light mode
- 'dark': Always dark mode`,
      },
      defaultValue: {
        summary: DT_MODE_ISLAND_TYPES.INVERTED,
      },
    },
  },

  as: {
    control: { type: 'text' },
    description: 'HTML element to render as',
    table: {
      type: {
        summary: 'String',
      },
      defaultValue: {
        summary: 'div',
      },
    },
  },
} satisfies Meta<DtModeIslandProps>['argTypes'];

const meta = {
  title: 'Components/Mode Island',
  component: DtModeIsland,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<typeof DtModeIsland>;

export default meta;
type Story = StoryObj<typeof meta>;

// ModeIslandDefault.story.vue
function ModeIslandDefaultStory ({ as, mode }: DtModeIslandProps) {
  return (
    <DtModeIsland as={as} mode={mode} className="d-p-200 d-ba d-bc-subtle d-bar-400">
      <DtStack gap="200">
        <DtStack direction="row" gap="100">
          <span className="d-fc-primary">Primary Foreground</span>
          <span className="d-fc-tertiary">Tertiary Foreground</span>
          <span className="d-fc-positive">Positive Foreground</span>
          <span className="d-fc-critical">Critical Foreground</span>
        </DtStack>
        <DtStack direction="row" gap="100">
          <div className="d-bgc-secondary d-p-200 d-py-100 d-ba d-bc-subtle">Secondary Surface</div>
          <div className="d-bgc-moderate d-p-200 d-py-100 d-ba d-bc-subtle">Moderate Surface</div>
          <div className="d-bgc-critical d-p-200 d-py-100 d-ba d-bc-subtle">Critical Surface</div>
          <div className="d-bgc-positive d-p-200 d-py-100 d-ba d-bc-subtle">Positive Surface</div>
        </DtStack>
      </DtStack>
    </DtModeIsland>
  );
}

export const Default: Story = {
  render: args => <ModeIslandDefaultStory {...args} />,
  args: {},
};

const ISLAND = 'd-p-200 d-ba d-bc-subtle d-bar-400';

export const NestedIslands: Story = {
  render: () => (
    <div>
      <h3 className="d-headline--md d-mbe-200">Nested Mode Islands</h3>
      <DtStack direction="row" gap="200">
          <DtModeIsland className={`d-fl1 ${ISLAND}`}>
            <p className="d-body--lg d-fw-semibold d-mbe-200">Inverted Mode Island (Parent)</p>
            <DtModeIsland className={ISLAND}>
              <p className="d-body--md d-fw-semibold d-mbe-100">Inverted Island (Child)</p>
              <DtModeIsland className={ISLAND}>
                <p className="d-body--sm">Inverted Island (Grandchild)</p>
              </DtModeIsland>
            </DtModeIsland>
            <DtModeIsland mode="light" className={`d-mbs-200 ${ISLAND}`}>
              <p className="d-body--md">Explicit Light Island</p>
            </DtModeIsland>
          </DtModeIsland>
          <DtModeIsland mode="dark" className={`d-fl1 ${ISLAND}`}>
            <p className="d-body--lg d-fw-semibold d-mbe-200">Dark Mode Island (Parent)</p>
            <DtModeIsland className={ISLAND}>
              <p className="d-body--md d-fw-semibold d-mbe-100">Inverted Island (Child - Light)</p>
              <DtModeIsland className={ISLAND}>
                <p className="d-body--sm">Inverted Island (Grandchild - Dark)</p>
              </DtModeIsland>
            </DtModeIsland>
            <DtModeIsland mode="light" className={`d-mbs-200 ${ISLAND}`}>
              <p className="d-body--md">Explicit Light Island (Always Light)</p>
            </DtModeIsland>
          </DtModeIsland>
      </DtStack>
    </div>
  ),
};

export const WithCustomElement: Story = {
  render: () => (
    <div>
      <h3 className="d-headline--md d-mbe-200">
        Custom HTML Elements <span className="d-body--md">via <code className="d-fw-bold">as</code> prop</span>
      </h3>
      <DtStack direction="row" gap="100">
          <DtModeIsland as="section" className={ISLAND}>
            <p className="d-body--md">This is a <code>&lt;section&gt;</code> element</p>
          </DtModeIsland>
          <DtModeIsland as="article" className={ISLAND}>
            <p className="d-body--md">This is an <code>&lt;article&gt;</code> element</p>
          </DtModeIsland>
          <DtModeIsland as="nav" className={ISLAND}>
            <p className="d-body--md">This is a <code>&lt;nav&gt;</code> element</p>
          </DtModeIsland>
      </DtStack>
    </div>
  ),
};
