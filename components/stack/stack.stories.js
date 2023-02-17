import DtStack from './stack';
import BaseStackMdx from './stack.mdx';
import StackDefault from './stack_default.story';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { DT_STACK_DIRECTION, DT_STACK_GAP, DT_STACK_RESPONSIVE_BREAKPOINTS } from '@/components/stack/stack_constants';

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
    defaultValue: { default: 'column' },
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
    defaultValue: 'div',
  },
  gap: {
    control: {
      type: 'select',
      options: DT_STACK_GAP,
    },
    defaultValue: '400',
  },
};

export default {
  title: 'Components/Stack',
  component: DtStack,
  parameters: {
    docs: {
      page: BaseStackMdx,
    },
    options: {
      showPanel: true,
    },
  },
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, StackDefault);

export const Default = Template.bind({});
Default.args = {};
