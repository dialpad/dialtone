import {
  argsData,
  argTypesData,
  Default,
  Initials,
  Icon,
  Presence,
} from '@/components/avatar/avatar.stories.js';

import DtAvatar from '@/components/avatar/avatar.vue';

export default {
  title: 'Visual Testing/Avatar',
  component: DtAvatar,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    a11y: {
      disable: true,
    },
  },
  args: { ...argsData, show: true, seed: 'seed' },
  argTypes: argTypesData,
};

export { Default, Initials, Icon, Presence };
