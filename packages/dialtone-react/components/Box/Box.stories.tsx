import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtStack } from '../Stack/Stack';
import { DtText } from '../Text/Text';
import { DtBox, type DtBoxProps } from './Box';
import {
  DT_BOX_AS_VALUES,
  DT_BOX_SPACING_VALUES,
  DT_BOX_INSET_VALUES,
  DT_BOX_INSET_SIDE_VALUES,
  DT_BOX_SURFACE_VALUES,
  DT_BOX_BORDER_COLOR_VALUES,
  DT_BOX_BORDER_WIDTH_VALUES,
  DT_BOX_BORDER_RADIUS_VALUES,
  DT_BOX_SHADOW_VALUES,
  DT_BOX_POSITION_VALUES,
  DT_BOX_Z_INDEX_VALUES,
  DT_BOX_LAYOUT_VALUES,
  DT_BOX_OVERFLOW_VALUES,
  DT_BOX_SCROLLBAR_VALUES,
  type DtBoxAs,
  type DtBoxSurface,
} from './BoxConstants';

type BoxStoryArgs = DtBoxProps<DtBoxAs>;

export const argsData = {
  as: 'div',
  padding: '200',
  surface: 'secondary',
  borderColor: undefined,
  borderWidth: undefined,
  borderRadius: undefined,
  shadow: undefined,
  position: undefined,
  insetBlockStart: undefined,
  zIndex: undefined,
} satisfies Partial<BoxStoryArgs>;

export const argTypesData = {
  // Slots
  children: {
    control: false,
    description: 'Slot for main content',
    table: { type: { summary: 'ReactNode' } },
  },

  // Props
  as: {
    control: 'select',
    options: DT_BOX_AS_VALUES,
  },
  padding: {
    control: 'select',
    options: [undefined, ...DT_BOX_SPACING_VALUES],
  },
  paddingInline: {
    control: 'select',
    options: [undefined, ...DT_BOX_SPACING_VALUES],
  },
  paddingInlineStart: {
    control: 'select',
    options: [undefined, ...DT_BOX_SPACING_VALUES],
  },
  paddingInlineEnd: {
    control: 'select',
    options: [undefined, ...DT_BOX_SPACING_VALUES],
  },
  paddingBlock: {
    control: 'select',
    options: [undefined, ...DT_BOX_SPACING_VALUES],
  },
  paddingBlockStart: {
    control: 'select',
    options: [undefined, ...DT_BOX_SPACING_VALUES],
  },
  paddingBlockEnd: {
    control: 'select',
    options: [undefined, ...DT_BOX_SPACING_VALUES],
  },
  surface: {
    control: 'select',
    options: [undefined, ...DT_BOX_SURFACE_VALUES],
  },
  borderColor: {
    control: 'select',
    options: [undefined, ...DT_BOX_BORDER_COLOR_VALUES],
  },
  borderWidth: {
    control: 'select',
    options: [undefined, ...DT_BOX_BORDER_WIDTH_VALUES],
  },
  borderRadius: {
    control: 'select',
    options: [undefined, ...DT_BOX_BORDER_RADIUS_VALUES],
  },
  shadow: {
    control: 'select',
    options: [undefined, ...DT_BOX_SHADOW_VALUES],
  },
  position: {
    control: 'select',
    options: [undefined, ...DT_BOX_POSITION_VALUES],
  },
  inset: {
    control: 'select',
    options: [undefined, ...DT_BOX_INSET_VALUES],
  },
  insetBlock: {
    control: 'select',
    options: [undefined, ...DT_BOX_INSET_VALUES],
  },
  insetInline: {
    control: 'select',
    options: [undefined, ...DT_BOX_INSET_VALUES],
  },
  insetBlockStart: {
    control: 'select',
    options: [undefined, ...DT_BOX_INSET_SIDE_VALUES],
  },
  insetBlockEnd: {
    control: 'select',
    options: [undefined, ...DT_BOX_INSET_SIDE_VALUES],
  },
  insetInlineStart: {
    control: 'select',
    options: [undefined, ...DT_BOX_INSET_SIDE_VALUES],
  },
  insetInlineEnd: {
    control: 'select',
    options: [undefined, ...DT_BOX_INSET_SIDE_VALUES],
  },
  zIndex: {
    control: 'select',
    options: [undefined, ...DT_BOX_Z_INDEX_VALUES],
  },
  overflow: {
    control: 'select',
    options: [undefined, ...DT_BOX_OVERFLOW_VALUES],
  },
  scrollbar: {
    control: 'select',
    options: [undefined, ...DT_BOX_SCROLLBAR_VALUES],
  },
  scrollbarContentClass: {
    description: 'Additional CSS classes applied to the scrollbar content wrapper element.',
  },
  inlineSize: {
    control: 'select',
    options: [undefined, ...DT_BOX_LAYOUT_VALUES],
  },
  blockSize: {
    control: 'select',
    options: [undefined, ...DT_BOX_LAYOUT_VALUES],
  },
  minInlineSize: {
    control: 'select',
    options: [undefined, ...DT_BOX_LAYOUT_VALUES],
  },
  maxInlineSize: {
    control: 'select',
    options: [undefined, ...DT_BOX_LAYOUT_VALUES],
  },
  minBlockSize: {
    control: 'select',
    options: [undefined, ...DT_BOX_LAYOUT_VALUES],
  },
  maxBlockSize: {
    control: 'select',
    options: [undefined, ...DT_BOX_LAYOUT_VALUES],
  },
  borderWidthBlock: {
    control: 'select',
    options: [undefined, ...DT_BOX_BORDER_WIDTH_VALUES],
  },
  borderWidthBlockEnd: {
    control: 'select',
    options: [undefined, ...DT_BOX_BORDER_WIDTH_VALUES],
  },
  borderWidthBlockStart: {
    control: 'select',
    options: [undefined, ...DT_BOX_BORDER_WIDTH_VALUES],
  },
  borderWidthInline: {
    control: 'select',
    options: [undefined, ...DT_BOX_BORDER_WIDTH_VALUES],
  },
  borderWidthInlineEnd: {
    control: 'select',
    options: [undefined, ...DT_BOX_BORDER_WIDTH_VALUES],
  },
  borderWidthInlineStart: {
    control: 'select',
    options: [undefined, ...DT_BOX_BORDER_WIDTH_VALUES],
  },
} satisfies Meta<BoxStoryArgs>['argTypes'];

const meta = {
  title: 'Components/Box',
  component: DtBox,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<BoxStoryArgs>;

export default meta;
type Story = StoryObj<BoxStoryArgs>;

// BoxVariants.story.vue
const neutralSurfaces: DtBoxSurface[] = ['primary', 'secondary', 'moderate', 'bold', 'strong', 'contrast'];
const semanticSurfaces: DtBoxSurface[] = ['brand', 'info', 'positive', 'warning', 'critical'];
const variantSurfaces: DtBoxSurface[] = [
  'brand-subtle', 'brand-strong', 'info-subtle', 'info-strong', 'positive-subtle', 'positive-strong', 'warning-subtle',
  'warning-strong', 'critical-subtle', 'critical-strong',
];
const opaqueSurfaces: DtBoxSurface[] = [
  'primary-opaque', 'secondary-opaque', 'moderate-opaque', 'bold-opaque', 'strong-opaque', 'contrast-opaque',
];

function SurfaceRow ({ surfaces }: { surfaces: DtBoxSurface[] }) {
  return (
    <DtStack direction="row" gap="100">
      {surfaces.map(s => (
        <DtBox key={s} padding="100" surface={s} borderWidth="100">
          <DtText kind="body" size={100}>{s}</DtText>
        </DtBox>
      ))}
    </DtStack>
  );
}

function BoxVariants () {
  return (
    <DtStack gap="400">
      <DtText as="h2" kind="headline" size="lg">Surface</DtText>
      <DtStack gap="200">
        <DtText as="h3" kind="headline" size="md">Neutral</DtText>
        <SurfaceRow surfaces={neutralSurfaces} />
        <DtText as="h3" kind="headline" size="md">Semantic</DtText>
        <SurfaceRow surfaces={semanticSurfaces} />
        <DtText as="h3" kind="headline" size="md">Subtle / Strong</DtText>
        <SurfaceRow surfaces={variantSurfaces} />
        <DtText as="h3" kind="headline" size="md">Opaque</DtText>
        <SurfaceRow surfaces={opaqueSurfaces} />
      </DtStack>

      <DtText as="h2" kind="headline" size="lg">Border Color</DtText>
      <DtStack gap="200">
        <DtStack direction="row" gap="100">
          {DT_BOX_BORDER_COLOR_VALUES.map(bc => (
            <DtBox key={bc} padding="100" borderColor={bc} borderWidth="100">
              <DtText kind="body" size={100}>{bc}</DtText>
            </DtBox>
          ))}
        </DtStack>
      </DtStack>

      <DtText as="h2" kind="headline" size="lg">Border Width</DtText>
      <DtStack direction="row" gap="200">
        {DT_BOX_BORDER_WIDTH_VALUES.map(bw => (
          <DtBox key={bw} padding="200" borderWidth={bw}>
            <DtText kind="body" size={100}>{bw}</DtText>
          </DtBox>
        ))}
      </DtStack>

      <DtText as="h2" kind="headline" size="lg">Border Radius</DtText>
      <DtStack direction="row" gap="200">
        {DT_BOX_BORDER_RADIUS_VALUES.map(br => (
          <DtBox key={br} padding="200" surface="secondary" borderColor="subtle" borderWidth="100" borderRadius={br}>
            <DtText kind="body" size={100}>{br}</DtText>
          </DtBox>
        ))}
      </DtStack>

      <DtText as="h2" kind="headline" size="lg">Shadow</DtText>
      <DtStack direction="row" gap="300">
        {DT_BOX_SHADOW_VALUES.map(s => (
          <DtBox key={s} padding="200" surface="primary" borderRadius="300" shadow={s}>
            <DtText kind="body" size={100}>{s}</DtText>
          </DtBox>
        ))}
      </DtStack>
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <DtBox {...args}>Box content</DtBox>,
  args: {},
};

export const Variants: Story = {
  render: () => <BoxVariants />,
  args: {},
  parameters: { controls: { disable: true } },
};

export const PaddingCascade: Story = {
  render: () => (
    <DtStack gap="200">
      <DtBox padding="300" surface="secondary" borderWidth="100">
        <DtText kind="body" size={200}>padding=&quot;300&quot; (all sides)</DtText>
      </DtBox>
      <DtBox padding="300" paddingInline="100" surface="secondary" borderWidth="100">
        <DtText kind="body" size={200}>+ paddingInline=&quot;100&quot;</DtText>
      </DtBox>
      <DtBox padding="300" paddingInlineStart="0" surface="secondary" borderWidth="100">
        <DtText kind="body" size={200}>+ paddingInlineStart=&quot;0&quot;</DtText>
      </DtBox>
      <DtBox padding="300" paddingBlock="200" paddingBlockEnd="500" surface="secondary" borderWidth="100">
        <DtText kind="body" size={200}>+ paddingBlock=&quot;200&quot; + paddingBlockEnd=&quot;500&quot;</DtText>
      </DtBox>
    </DtStack>
  ),
  parameters: { controls: { disable: true } },
};

export const Positioning: Story = {
  render: () => (
    <DtBox
      blockSize="600"
      overflow="auto"
      surface="secondary"
      borderWidth="100"
      borderRadius="300"
    >
      <DtBox
        as="header"
        position="sticky"
        insetBlockStart="0"
        zIndex="navigation"
        padding="200"
        surface="primary"
        borderWidthBlockEnd="100"
      >
        <DtStack direction="row" justify="space-between" align="center">
          <DtText as="h2" kind="headline" size="300">Sticky header</DtText>
          <DtText kind="body" size="200" tone="muted">zIndex=&quot;navigation&quot;</DtText>
        </DtStack>
      </DtBox>
      <DtStack gap="200" className="d-p-200">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <DtBox
            key={i}
            padding="200"
            surface="moderate"
            borderWidth="100"
            borderRadius="300"
          >
            <DtText kind="body" size="200">Scrollable content {i}</DtText>
          </DtBox>
        ))}
      </DtStack>
    </DtBox>
  ),
  parameters: { controls: { disable: true } },
};

export const CardComposition: Story = {
  render: () => (
    <DtStack direction="row" gap="200">
      <DtBox padding="300" surface="primary" borderWidth="100" borderRadius="300" shadow="card">
        <DtText kind="body" size={200}>Card: subtle border + radius + card shadow</DtText>
      </DtBox>
      <DtBox padding="300" surface="primary" borderWidth="100" borderRadius="400" shadow="medium">
        <DtText kind="body" size={200}>Elevated card</DtText>
      </DtBox>
      <DtBox padding="300" surface="brand-subtle" borderColor="brand" borderWidth="100" borderRadius="200">
        <DtText kind="body" size={200}>Brand card: no shadow</DtText>
      </DtBox>
    </DtStack>
  ),
  parameters: { controls: { disable: true } },
};

export const NestedInheritanceIsolation: Story = {
  render: () => (
    <DtStack gap="200">
      <DtBox padding="500" surface="moderate" borderWidth="100">
        <DtStack gap="200">
          <DtText kind="body" size={200}>Outer: padding 500</DtText>
          <DtBox padding="100" surface="positive-subtle" borderWidth="100">
            <DtText kind="body" size={200}>Inner: padding 100 (no inheritance leak)</DtText>
          </DtBox>
        </DtStack>
      </DtBox>
      <DtBox padding="500" surface="moderate" borderWidth="100">
        <DtStack gap="200">
          <DtText kind="body" size={200}>Outer: padding 500</DtText>
          <DtBox surface="critical-subtle" borderWidth="100">
            <DtText kind="body" size={200}>Inner: no padding (should be 0, not 500)</DtText>
          </DtBox>
        </DtStack>
      </DtBox>
    </DtStack>
  ),
  parameters: { controls: { disable: true } },
};
