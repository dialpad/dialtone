import {
  argsData,
  argTypesData,
  Default,
  Info,
  Error,
  Pinned,
  Warning,
  Success,
} from '@/components/banner/banner.stories.js';

import DtBanner from '@/components/banner/banner.vue';

export default {
  title: 'Visual Testing/Banner',
  component: DtBanner,
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

export { Default, Info, Error, Pinned, Warning, Success };
