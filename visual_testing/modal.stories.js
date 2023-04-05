import {
  argsData,
  argTypesData,
  Default,
  WithFooter,
  WithFixedHeaderFooter,
  WithDangerStyle,
  WithFullSize,
  WithCustomHeaderAndContent,
} from '@/components/modal/modal.stories';

import DtModal from '@/components/modal/modal';

export default {
  title: 'Visual Testing/Modal',
  component: DtModal,
  parameters: {
    options: { showPanel: false },
    percy: {
      queryParams: {
        viewMode: 'story',
      },
    },
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
