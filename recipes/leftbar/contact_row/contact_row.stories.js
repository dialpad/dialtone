import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeContactRow from './contact_row.vue';

import DtRecipeContactRowDefaultTemplate from './contact_row_default.story.vue';
import DtRecipeContactRowVariantsTemplate from './contact_row_variants.story.vue';
import { AVATAR_PRESENCE_STATES } from '@/components/avatar/avatar_constants';
import defaultImage from '@/common/assets/person.png';

// Default Prop Values
export const argsData = {
  name: 'Jaqueline Nackos',
  avatarSrc: defaultImage,
  callButtonTooltip: 'Call',
  hasUnreads: true,
  unreadCount: '55',
  avatarPresence: 'active',
  unreadCountTooltip: '55 unread messages',
  onClick: action('click'),
  onCall: action('call'),
};

export const argTypesData = {
  avatarPresence: {
    options: Object.values(AVATAR_PRESENCE_STATES),
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: 'null',
      },
    },
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },

  onCall: {
    table: {
      disable: true,
    },
  },

  click: {
    table: {
      type: { summary: 'event' },
    },
  },

  call: {
    table: {
      type: { summary: 'event' },
    },
  },
};

const decorator = () => ({
  template: '<div class="d-w264 d-theme-sidebar-bgc d-p8"><story /></div>',
});

// Story Collection
export default {
  title: 'Recipes/Leftbar/Contact Row',
  component: DtRecipeContactRow,
  args: argsData,
  argTypes: argTypesData,
  decorators: [decorator],
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtRecipeContactRowDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtRecipeContactRowVariantsTemplate);

export const Default = {
  render: DefaultTemplate,
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
