import DtBox from './Box.vue';
import DtStack from '@/components/Stack/Stack.vue';
import DtText from '@/components/Text/Text.vue';
import BoxVariants from './BoxVariants.story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
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
} from './BoxConstants.js';

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
};

export const argTypesData = {
  default: {
    control: { type: null },
    description: 'Slot for main content',
  },
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
};

export default {
  title: 'Components/Box',
  component: DtBox,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

export const Default = {
  render: (args) => ({
    components: { DtBox },
    setup () { return { args }; },
    template: '<dt-box v-bind="args">Box content</dt-box>',
  }),
  args: {},
};

const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, BoxVariants);

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: { controls: { disable: true } },
};

export const PaddingCascade = {
  render: () => ({
    components: { DtBox, DtStack, DtText },
    template: `
      <dt-stack gap="200">
        <dt-box padding="300" surface="secondary" border-width="100">
          <dt-text kind="body" :size="200">padding="300" (all sides)</dt-text>
        </dt-box>
        <dt-box padding="300" padding-inline="100" surface="secondary" border-width="100">
          <dt-text kind="body" :size="200">+ paddingInline="100"</dt-text>
        </dt-box>
        <dt-box padding="300" padding-inline-start="0" surface="secondary" border-width="100">
          <dt-text kind="body" :size="200">+ paddingInlineStart="0"</dt-text>
        </dt-box>
        <dt-box padding="300" padding-block="200" padding-block-end="500" surface="secondary" border-width="100">
          <dt-text kind="body" :size="200">+ paddingBlock="200" + paddingBlockEnd="500"</dt-text>
        </dt-box>
      </dt-stack>
    `,
  }),
  parameters: { controls: { disable: true } },
};

export const Positioning = {
  render: () => ({
    components: { DtBox, DtStack, DtText },
    template: `
      <dt-box
        block-size="600"
        overflow="auto"
        surface="secondary"
        border-width="100"
        border-radius="300"
      >
        <dt-box
          as="header"
          position="sticky"
          inset-block-start="0"
          z-index="navigation"
          padding="200"
          surface="primary"
          border-width-block-end="100"
        >
          <dt-stack direction="row" justify="space-between" align="center">
            <dt-text as="h2" kind="headline" size="300">Sticky header</dt-text>
            <dt-text kind="body" size="200" tone="muted">zIndex="navigation"</dt-text>
          </dt-stack>
        </dt-box>
        <dt-stack gap="200" class="d-p-200">
          <dt-box
            v-for="i in 8"
            :key="i"
            padding="200"
            surface="moderate"
            border-width="100"
            border-radius="300"
          >
            <dt-text kind="body" size="200">Scrollable content {{ i }}</dt-text>
          </dt-box>
        </dt-stack>
      </dt-box>
    `,
  }),
  parameters: { controls: { disable: true } },
};

export const CardComposition = {
  render: () => ({
    components: { DtBox, DtStack, DtText },
    template: `
      <dt-stack direction="row" gap="200">
        <dt-box padding="300" surface="primary" border-width="100" border-radius="300" shadow="card">
          <dt-text kind="body" :size="200">Card: subtle border + radius + card shadow</dt-text>
        </dt-box>
        <dt-box padding="300" surface="primary" border-width="100" border-radius="400" shadow="medium">
          <dt-text kind="body" :size="200">Elevated card</dt-text>
        </dt-box>
        <dt-box padding="300" surface="brand-subtle" border-color="brand" border-width="100" border-radius="200">
          <dt-text kind="body" :size="200">Brand card: no shadow</dt-text>
        </dt-box>
      </dt-stack>
    `,
  }),
  parameters: { controls: { disable: true } },
};

export const NestedInheritanceIsolation = {
  render: () => ({
    components: { DtBox, DtStack, DtText },
    template: `
      <dt-stack gap="200">
        <dt-box padding="500" surface="moderate" border-width="100">
          <dt-stack gap="200">
            <dt-text kind="body" :size="200">Outer: padding 500</dt-text>
            <dt-box padding="100" surface="positive-subtle" border-width="100">
              <dt-text kind="body" :size="200">Inner: padding 100 (no inheritance leak)</dt-text>
            </dt-box>
          </dt-stack>
        </dt-box>
        <dt-box padding="500" surface="moderate" border-width="100">
          <dt-stack gap="200">
            <dt-text kind="body" :size="200">Outer: padding 500</dt-text>
            <dt-box surface="critical-subtle" border-width="100">
              <dt-text kind="body" :size="200">Inner: no padding (should be 0, not 500)</dt-text>
            </dt-box>
          </dt-stack>
        </dt-box>
      </dt-stack>
    `,
  }),
  parameters: { controls: { disable: true } },
};
