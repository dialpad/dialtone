import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtAvatar from './avatar.vue';
import { AVATAR_SIZE_MODIFIERS, AVATAR_PRESENCE_STATES } from './avatar_constants';
import DtAvatarDefaultTemplate from './avatar_default.story.vue';
import DtAvatarIconTemplate from './avatar_icon.story.vue';
import DtAvatarPresenceTemplate from './avatar_presence.story.vue';

import defaultImage from '@/common/assets/person.png';

const iconsList = getIconNames();

export const argsData = {
  size: 'md',
  presence: null,
};

export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode|String|Component',
      },
    },
  },

  // Props
  size: {
    defaultValue: 'md',
    options: Object.keys(AVATAR_SIZE_MODIFIERS),
    control: 'select',
  },
  presence: {
    defaultValue: null,
    options: Object.values(AVATAR_PRESENCE_STATES),
    control: 'select',
    table: {
      defaultValue: {
        summary: 'null',
      },
    },
  },
  presenceProps: {
    description: 'Pass through props. Used to customize the presence component',
  },
  avatarClass: {
    description: 'Pass through classes. Used to customize the avatar container',
  },
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  overlayIcon: {
    options: iconsList,
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
  overlayClass: {
    description: 'Pass through classes. Used to customize the avatar overlay',
  },
};

// Story Collection
export default {
  title: 'Components/Avatar',
  component: DtAvatar,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args) =>
  createTemplateFromVueFile(args, DtAvatarDefaultTemplate);

const IconTemplate = (args) =>
  createTemplateFromVueFile(args, DtAvatarIconTemplate);

const PresenceTemplate = (args) =>
  createTemplateFromVueFile(args, DtAvatarPresenceTemplate);

// Stories
export const Default = {
  render: DefaultTemplate,
  decorators: [
    () => ({
      template: `<div class="d-d-flex"><story /></div>`,
    }),
  ],
  args: {
    default: `<img data-qa="dt-avatar-image" src="${defaultImage}" alt="Person Avatar">`,
    initials: 'PS',
  },
};

// TO DO: figure out why Icon.argTypes is causing the controls to not show up in the Initials story when
// it's below the Icon story
export const Initials = {
  ...Default,
  args: {
    default: 'DP',
  },
};

export const Icon = {
  render: IconTemplate,
  args: {
    default: 'accessibility',
  },
  argTypes: {
    default: {
      options: iconsList,
      control: {
        type: 'select',
        labels: {
          undefined: '(empty)',
        },
      },
    },
  },
};

export const Presence = {
  render: PresenceTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
