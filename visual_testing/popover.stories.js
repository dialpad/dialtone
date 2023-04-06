import {
  argsData,
  argTypesData,
  Default,
  Variants,
} from '@/components/popover/popover.stories';
import PopoverMdx from '@/visual_testing/popover.mdx';

import DtPopover from '@/components/popover/popover';

export default {
  title: 'Visual Testing/Popover',
  component: DtPopover,
  args: {
    ...argsData,
    open: true,
    modal: false,
    hideOnClick: false,
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
