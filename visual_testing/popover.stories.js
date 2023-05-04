import { argsData, argTypesData, Default, Variants } from '@/components/popover/popover.stories.js';

import DtPopover from '@/components/popover/popover.vue';

export default {
  title: 'Visual Testing/Popover',
  component: DtPopover,
  args: {
    ...argsData,
    open: true,
    modal: false,
    transition: '',
    hideOnClick: false,
  },
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    a11y: {
      disable: true,
    },
  },
};
export { Default, Variants };
