import DtBox from './box.vue';
import DtStack from '@/components/stack/stack.vue';
import DtText from '@/components/text/text.vue';
import {
  DT_BOX_AS_VALUES,
  DT_BOX_SPACING_VALUES,
  DT_BOX_SURFACE_VALUES,
} from './box_constants.js';

export const argsData = {
  as: 'div',
  padding: '200',
  surface: 'secondary',
};

export const argTypesData = {
  // Slots
  default: {
    control: { type: null },
    description: 'Slot for main content',
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
    template: `
      <dt-box v-bind="args">
        Box content
      </dt-box>
    `,
  }),
  args: {},
};

export const PaddingCascade = {
  render: () => ({
    components: { DtBox, DtStack, DtText },
    template: `
      <dt-stack gap="200">
        <dt-text kind="body" :size="200"><strong>Shorthand only</strong> — padding="300"</dt-text>
        <dt-box padding="300" surface="secondary">
          <dt-text kind="body" :size="200">All sides: 300</dt-text>
        </dt-box>

        <dt-text kind="body" :size="200"><strong>Axis override</strong> — padding="300" + paddingInline="100"</dt-text>
        <dt-box padding="300" padding-inline="100" surface="secondary">
          <dt-text kind="body" :size="200">Block: 300, Inline: 100</dt-text>
        </dt-box>

        <dt-text kind="body" :size="200"><strong>Side override</strong> — padding="300" + paddingInlineStart="0"</dt-text>
        <dt-box padding="300" padding-inline-start="0" surface="secondary">
          <dt-text kind="body" :size="200">All sides 300 except inline-start: 0</dt-text>
        </dt-box>

        <dt-text kind="body" :size="200"><strong>Full cascade</strong> — padding="300" + paddingBlock="200" + paddingBlockEnd="500"</dt-text>
        <dt-box padding="300" padding-block="200" padding-block-end="500" surface="secondary">
          <dt-text kind="body" :size="200">Inline: 300, Block-start: 200, Block-end: 500</dt-text>
        </dt-box>
      </dt-stack>
    `,
  }),
  parameters: {
    controls: { disable: true },
  },
};

export const SurfaceVariants = {
  render: () => ({
    components: { DtBox, DtStack, DtText },
    template: `
      <dt-stack gap="200">
        <dt-text as="h3" kind="headline" :size="300">Neutral</dt-text>
        <dt-stack direction="row" gap="100">
          <dt-box v-for="s in ['primary', 'secondary', 'moderate', 'bold', 'strong', 'contrast']" :key="s" padding="100" :surface="s">
            <dt-text kind="body" :size="100">{{ s }}</dt-text>
          </dt-box>
        </dt-stack>

        <dt-text as="h3" kind="headline" :size="300">Semantic</dt-text>
        <dt-stack direction="row" gap="100">
          <dt-box v-for="s in ['brand', 'info', 'success', 'warning', 'critical']" :key="s" padding="100" :surface="s">
            <dt-text kind="body" :size="100">{{ s }}</dt-text>
          </dt-box>
        </dt-stack>

        <dt-text as="h3" kind="headline" :size="300">Subtle / Strong</dt-text>
        <dt-stack direction="row" gap="100">
          <dt-box v-for="s in ['brand-subtle', 'brand-strong', 'info-subtle', 'info-strong', 'success-subtle', 'success-strong', 'warning-subtle', 'warning-strong', 'critical-subtle', 'critical-strong']" :key="s" padding="100" :surface="s">
            <dt-text kind="body" :size="100">{{ s }}</dt-text>
          </dt-box>
        </dt-stack>

        <dt-text as="h3" kind="headline" :size="300">Opaque</dt-text>
        <dt-stack direction="row" gap="100">
          <dt-box v-for="s in ['primary-opaque', 'secondary-opaque', 'moderate-opaque', 'bold-opaque', 'strong-opaque', 'contrast-opaque']" :key="s" padding="100" :surface="s">
            <dt-text kind="body" :size="100">{{ s }}</dt-text>
          </dt-box>
        </dt-stack>
      </dt-stack>
    `,
  }),
  parameters: {
    controls: { disable: true },
  },
};

export const NestedInheritanceIsolation = {
  render: () => ({
    components: { DtBox, DtStack, DtText },
    template: `
      <dt-stack gap="200">
        <dt-text kind="body" :size="200">
          Nested DtBox should NOT inherit padding from parent — each box controls its own spacing via @property initial values.
        </dt-text>
        <dt-box padding="500" surface="moderate">
          <dt-text kind="body" :size="200">Outer: padding 500, surface moderate</dt-text>
          <dt-box padding="100" surface="success-subtle" class="d-mt8">
            <dt-text kind="body" :size="200">Inner: padding 100, surface success-subtle (no inheritance leak)</dt-text>
          </dt-box>
        </dt-box>

        <dt-text kind="body" :size="200">
          Inner box with NO padding prop — should reset to 0, not inherit parent's 500.
        </dt-text>
        <dt-box padding="500" surface="moderate">
          <dt-text kind="body" :size="200">Outer: padding 500</dt-text>
          <dt-box surface="critical-subtle" class="d-mt8">
            <dt-text kind="body" :size="200">Inner: no padding prop (should be 0, not 500)</dt-text>
          </dt-box>
        </dt-box>
      </dt-stack>
    `,
  }),
  parameters: {
    controls: { disable: true },
  },
};
