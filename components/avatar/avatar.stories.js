import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtAvatar from './avatar.vue';
import { AVATAR_SIZE_MODIFIERS, AVATAR_PRESENCE_STATES, AVATAR_COLORS } from './avatar_constants';
import DtAvatarDefaultTemplate from './avatar_default.story.vue';
import DtAvatarVariantsTemplate from './avatar_variants.story.vue';
import { action } from '@storybook/addon-actions';

const ICONS_LIST = getIconNames();

export const argsData = {
  onClick: action('click'),
  size: 'md',
  presence: null,
  fullName: 'Jaqueline Nackos',
  imageAlt: 'image-alt',
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
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
    options: AVATAR_COLORS,
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
      template: `<div class="d-d-flex"><story /></div>`,
    }),
  ],
  args: { imageSrc: '/common/assets/person.png' },
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
