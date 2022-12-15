import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import { PRESENCE_STATES_LIST } from '../presence/presence_constants';
import DtAvatar from './avatar';
import DtAvatarMdx from './avatar.mdx';
import { AVATAR_SIZE_MODIFIERS } from './avatar_constants';
import DtAvatarDefaultTemplate from './avatar_default.story.vue';
import DtAvatarIconTemplate from './avatar_icon.story.vue';
import DtAvatarPresenceTemplate from './avatar_presence.story.vue';

const iconsList = getIconNames();

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
    control: {
      type: 'select',
      options: Object.keys(AVATAR_SIZE_MODIFIERS),
    },
  },
  presence: {
    defaultValue: null,
    control: {
      type: 'select',
      options: [...PRESENCE_STATES_LIST],
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
};

// Story Collection
export default {
  title: 'Components/Avatar',
  component: DtAvatar,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtAvatarMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtAvatarDefaultTemplate,
);

const IconTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtAvatarIconTemplate,
);

const PresenceTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtAvatarPresenceTemplate,
);

const defaultImage = require('./person.png');

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  default: `<img data-qa="dt-avatar-image" src="${defaultImage}" alt="Person Avatar">`,
};

// TO DO: figure out why Icon.argTypes is causing the controls to not show up in the Initials story when
// it's below the Icon story
export const Initials = DefaultTemplate.bind({});
Initials.args = {
  default: 'DP',
};

export const Icon = IconTemplate.bind({});
Icon.args = {
  default: 'accessibility',
};

Icon.argTypes = {
  default: {
    options: iconsList,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
};

export const Presence = PresenceTemplate.bind({});
Presence.args = {};
Presence.parameters = {
  controls: { disable: true },
  actions: { disable: true },
  options: { showPanel: false },
};
