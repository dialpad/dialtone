import {
  argsData,
  argTypesData,
  Default,
  Variants,
} from '@/components/popover/popover.stories';
import PopoverMdx from '@/visual_testing/popover.mdx';

export default {
  title: 'Visual Testing/Popover',
  args: {
    ...argsData,
    open: true,
  },
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      page: PopoverMdx,
    },
    options: { showPanel: false },
    a11y: {
      disable: true,
    },
  },
};
export { Default, Variants };
