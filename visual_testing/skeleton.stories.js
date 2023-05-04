import { argsData, argTypesData, Default, Variants } from '@/components/skeleton/skeleton.stories';

import DtSkeleton from '@/components/skeleton/skeleton.vue';

export default {
  title: 'Visual Testing/Skeleton',
  component: DtSkeleton,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    a11y: {
      disable: true,
    },
  },
  args: { ...argsData, show: true, animate: false },
  argTypes: argTypesData,
};

export { Default, Variants };
