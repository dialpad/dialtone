import {
  argsData,
  argTypesData,
  Default,
  Initials,
  Icon,
  Presence,
} from '@/components/avatar/avatar.stories';

import DtAvatar from '@/components/avatar/avatar';

export default {
  title: 'Visual Testing/Avatar',
  component: DtAvatar,
  parameters: {
    options: { showPanel: false },
    a11y: {
      disable: true,
    },
  },
  args: { ...argsData, show: true, seed: 'seed' },
  argTypes: argTypesData,
};

export { Default, Initials, Icon, Presence };
