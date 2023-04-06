import {
  argsData,
  argTypesData,
  Default,
  Info,
  Error,
  Pinned,
  Warning,
  Success,
} from '@/components/banner/banner.stories';

import DtBanner from '@/components/banner/banner';

export default {
  title: 'Visual Testing/Banner',
  component: DtBanner,
  parameters: {
    options: { showPanel: false },
    a11y: {
      disable: true,
    },
  },
  args: { ...argsData, show: true },
  argTypes: argTypesData,
};

export { Default, Info, Error, Pinned, Warning, Success };
