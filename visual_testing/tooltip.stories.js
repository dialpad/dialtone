import {
  argsData,
  argTypesData,
  Default,
  Variants,
  Flip,
} from '@/components/tooltip/tooltip.stories.js';

import DtTooltip from '@/components/tooltip/tooltip.vue';

export default {
  title: 'Visual Testing/Tooltip',
  component: DtTooltip,
  args: {
    ...argsData,
    show: true,
    transition: '',
    customDirections: [
      'top-end',
      'top',
      'top-start',
      'left-start',
      null,
      'right-start',
      'left',
      null,
      'right',
      'left-end',
      null,
      'right-end',
      'bottom-end',
      'bottom',
      'bottom-start',
    ],
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
export { Default, Variants, Flip };
