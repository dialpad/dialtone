import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtAvatar from './avatar';
import DtAvatarMdx from './avatar.mdx';
import { AVATAR_SIZE_MODIFIERS, AVATAR_PRESENCE_STATES } from './avatar_constants';
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
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtAvatarDefaultTemplate,
);

const IconTemplate = (args) => createTemplateFromVueFile(
  args,
  DtAvatarIconTemplate,
);

const PresenceTemplate = (args) => createTemplateFromVueFile(
  args,
  DtAvatarPresenceTemplate,
);

const defaultImage = require('./person.png');

// Stories
export const Default = DefaultTemplate.bind({});
Default.decorators = [() => ({
  template: `<div class="d-d-flex"><story /></div>`,
})];
Default.args = {
  default: `<img data-qa="dt-avatar-image" src="${defaultImage}" alt="Person Avatar">`,
  initials: 'PS',
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

export const Initials = DefaultTemplate.bind({});
Initials.args = {
  default: 'DP',
};

export const Presence = PresenceTemplate.bind({});
Presence.args = {};
Presence.parameters = {
  controls: { disable: true },
  actions: { disable: true },
  options: { showPanel: false },
};
