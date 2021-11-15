import { createTemplateFromVueFile } from '../storybook_utils';
import DtAvatar from './avatar';
import DtAvatarDefaultTemplate from './avatar_default.story.vue';
import { AVATAR_COLOR_MODIFIERS, AVATAR_KIND_MODIFIERS, AVATAR_SIZE_MODIFIERS } from './avatar_constants';
import DtAvatarMdx from './avatar.mdx';

export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  kind: {
    defaultValue: 'default',
    control: {
      type: 'select',
      options: Object.keys(AVATAR_KIND_MODIFIERS),
    },
  },
  size: {
    defaultValue: 'md',
    control: {
      type: 'select',
      options: Object.keys(AVATAR_SIZE_MODIFIERS),
    },
  },
  color: {
    defaultValue: 'base',
    control: {
      type: 'select',
      options: Object.keys(AVATAR_COLOR_MODIFIERS),
    },
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

  // HTML attributes
  src: {
    description: 'HTML image src attribute. Required for image avatars. Overridden by the default slot',
    table: {
      category: 'html attributes',
    },
    type: {
      summary: 'string',
    },
    control: 'text',
  },
  alt: {
    description: 'HTML image alt attribute. Required for image avatars. Overridden by the default slot',
    table: {
      category: 'html attributes',
    },
    type: {
      summary: 'string',
    },
    control: 'text',
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
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtAvatarDefaultTemplate,
);

const defaultImage = require('./person.png');

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  src: defaultImage,
  alt: 'Person Avatar',
};

export const Icon = DefaultTemplate.bind({});
Icon.args = {
  color: 'purple-200',
  kind: 'icon',
  default: 'IconGroup',
};

export const Initials = DefaultTemplate.bind({});
Initials.args = {
  color: 'purple-200',
  kind: 'initials',
  default: 'DP',
};
