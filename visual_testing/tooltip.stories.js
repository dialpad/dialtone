import {
  argsData,
  argTypesData,
  Default,
  Variants,
  Flip,
} from '@/components/tooltip/tooltip.stories';
import TooltipMdx from '@/visual_testing/tooltip.mdx';

export default {
  title: 'Visual Testing/Tooltip',
  args: {
    ...argsData,
    show: true,
    customDirections: [
      'top-end', 'top', 'top-start',
      'left-start', null, 'right-start',
      'left', null, 'right',
      'left-end', null, 'right-end',
      'bottom-end', 'bottom', 'bottom-start',
    ],
  },
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      page: TooltipMdx,
    },
    options: { showPanel: false },
    a11y: {
      disable: true,
    },
  },
};
export { Default, Variants, Flip };
