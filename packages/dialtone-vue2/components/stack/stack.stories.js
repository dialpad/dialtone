import DtStack from './stack.vue';

import StackDefault from './stack_default.story.vue';
import StackVariants from './stack_variants.story.vue';
import { createRenderConfig } from '@/common/storybook_utils';
import {
  DT_STACK_DIRECTION,
  DT_STACK_GAP,
  DT_STACK_RESPONSIVE_BREAKPOINTS,
  DT_STACK_ALIGN,
  DT_STACK_JUSTIFY,
} from '@/components/stack/stack_constants';

export const argsData = {
  direction: { default: 'column' },
  as: 'div',
  gap: { default: '400' },
  align: { default: 'normal' },
  justify: { default: 'start' },
};

export const argTypesData = {
  // Slots
  default: {
    control: { type: null },
    description: 'Slot for main content',
    table: {
      type: {
        summary: 'VNode',
        detail: `
        Example:
<dt-stack>
  <dt-card />
  <dt-card />
  <dt-card />
</dt-stack>`,
      },
    },
  },

  // Props
  direction: {
    control: 'object',
    table: {
      type: {
        detail: `
        Directions: "${Object.keys(DT_STACK_DIRECTION)}"
Breakpoints: "${DT_STACK_RESPONSIVE_BREAKPOINTS}"
String: "column"
Object: { "default": "row", "sm": "column", "lg": "column-reverse" }`,
      },
    },
  },
  as: {
    control: 'text',
  },
  gap: {
    control: 'object',
    table: {
      type: {
        detail: `
        Gaps: "${DT_STACK_GAP}"
Breakpoints: "${DT_STACK_RESPONSIVE_BREAKPOINTS}"
String: "400"
Object: { "default": "400", "sm": "200", "lg": "450" }`,
      },
    },
  },
  align: {
    control: 'object',
    table: {
      type: {
        detail: `
        Align Values: "${DT_STACK_ALIGN}"
Breakpoints: "${DT_STACK_RESPONSIVE_BREAKPOINTS}"
String: "center"
Object: { "default": "normal", "sm": "center", "lg": "end" }`,
      },
    },
  },
  justify: {
    control: 'object',
    table: {
      type: {
        detail: `
        Justify Values: "${DT_STACK_JUSTIFY}"
Breakpoints: "${DT_STACK_RESPONSIVE_BREAKPOINTS}"
String: "space-between"
Object: { "default": "start", "sm": "center", "lg": "space-between" }`,
      },
    },
  },
};

export default {
  title: 'Components/Stack',
  component: DtStack,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(DtStack, StackDefault, argsData),
  args: {},
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtStack, StackVariants, argsData),
  args: {},
  parameters: {
    controls: { disable: true },
  },
};
