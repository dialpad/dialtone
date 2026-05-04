import { createTemplateFromVueFile, getIconNames } from '@/common/StorybookUtils';
import DtAvatar from './avatar.vue';
import { AVATAR_SIZE_MODIFIERS, AVATAR_PRESENCE_STATES } from './AvatarConstants';
import DtAvatarDefaultTemplate from './AvatarDefault.story.vue';
import DtAvatarVariantsTemplate from './AvatarVariants.story.vue';
import { action } from 'storybook/actions';

import defaultImage from '@/common/assets/avatar2.png';

const ICONS_LIST = getIconNames();

export const argsData = {
  onClick: action('click'),
  size: 300,
  presence: null,
  fullName: 'Jaqueline Nackos',
  imageAlt: 'profile image',
  imageSrc: defaultImage,
  seed: '',
  iconName: 'accessibility',
  iconSize: '500',
};

export const argTypesData = {
  // Props
  avatarClass: {
    description: 'Pass through classes. Used to customize the avatar container',
  },
  color: {
    control: {
      type: 'text',
    },
    description: 'Legacy color prop. Use seed instead for auto-generated colors.',
  },
  iconName: {
    options: ICONS_LIST,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  iconSize: {
    defaultValue: null,
  },
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  overlayClass: {
    description: 'Pass through classes. Used to customize the avatar overlay',
  },
  overlayIcon: {
    options: ICONS_LIST,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  overlayText: {
    description: 'The text that overlays the avatar',
  },
  presence: {
    defaultValue: null,
    control: {
      type: 'select',
    },
    options: Object.values(AVATAR_PRESENCE_STATES),
    table: {
      defaultValue: {
        summary: 'null',
      },
    },
  },
  presenceProps: {
    description: 'Pass through props. Used to customize the presence component',
  },
  size: {
    control: {
      type: 'select',
    },
    options: Object.keys(AVATAR_SIZE_MODIFIERS),
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Components/Avatar',
  component: DtAvatar,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtAvatarDefaultTemplate);

const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtAvatarVariantsTemplate);

// Stories
export const Default = {
  render: DefaultTemplate,
  decorators: [
    () => ({
      template: `<dt-stack direction="row"><story /></dt-stack>`,
    }),
  ],
};

export const Variants = {
  render: VariantsTemplate,
  parameters: {
    percy: {
      args: {
        seed: 'seed',
      },
    },
    options: { showPanel: false },
    controls: { disable: true },
  },
};
