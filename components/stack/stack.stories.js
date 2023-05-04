import DtStack from './stack.vue';

import StackDefault from './stack_default.story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import {
  DT_STACK_DIRECTION,
  DT_STACK_GAP,
  DT_STACK_RESPONSIVE_BREAKPOINTS,
} from '@/components/stack/stack_constants';

export const argsData = {
  direction: { default: 'column' },
  as: 'div',
  gap: '400',
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
    options: DT_STACK_GAP,
    control: {
      type: 'select',
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

const Template = (args) => createTemplateFromVueFile(args, StackDefault);

export const Default = {
  render: Template,
  args: {},
};
