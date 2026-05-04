import DtBox from './box.vue';
import DtStack from '@/components/stack/stack.vue';
import DtText from '@/components/text/text.vue';
import BoxVariants from './BoxVariants.story.vue';
import { createTemplateFromVueFile } from '@/common/StorybookUtils';
import {
  DT_BOX_AS_VALUES,
  DT_BOX_SPACING_VALUES,
  DT_BOX_SURFACE_VALUES,
  DT_BOX_BORDER_COLOR_VALUES,
  DT_BOX_BORDER_WIDTH_VALUES,
  DT_BOX_BORDER_RADIUS_VALUES,
  DT_BOX_SHADOW_VALUES,
} from './BoxConstants.js';

export const argsData = {
  as: 'div',
  padding: '200',
  surface: 'secondary',
  borderColor: undefined,
  borderWidth: undefined,
  borderRadius: undefined,
  shadow: undefined,
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
