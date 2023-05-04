import {
  argsData,
  argTypesData,
  Default,
  WithFooter,
  WithFixedHeaderFooter,
  WithDangerStyle,
  WithFullSize,
  WithCustomHeaderAndContent,
} from '@/components/modal/modal.stories.js';

import DtModal from '@/components/modal/modal.vue';

export default {
  title: 'Visual Testing/Modal',
  component: DtModal,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    a11y: {
      disable: true,
    },
  },
  args: { ...argsData, show: true },
  argTypes: argTypesData,
};

export {
  Default,
  WithFooter,
  WithFixedHeaderFooter,
  WithDangerStyle,
  WithFullSize,
  WithCustomHeaderAndContent,
};
