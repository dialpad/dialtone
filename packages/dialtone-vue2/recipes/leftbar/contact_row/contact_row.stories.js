import { action } from '@storybook/addon-actions';
import { createRenderConfig } from '@/common/storybook_utils';
import DtRecipeContactRow from './contact_row.vue';

import DtRecipeContactRowDefaultTemplate from './contact_row_default.story.vue';
import DtRecipeContactRowVariantsTemplate from './contact_row_variants.story.vue';
import { AVATAR_PRESENCE_STATES } from '@/components/avatar/avatar_constants';
import { AVATAR_COLORS } from '@/components/avatar';
import defaultImage from '@/common/assets/avatar2.png';

// Default Prop Values
export const argsData = {
  name: 'Jaqueline Nackos',
  avatarSrc: defaultImage,
  avatarColor: '',
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

  avatarColor: {
    options: [
      undefined,
      ...AVATAR_COLORS,
    ],
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
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
    description: 'Native click event for the entire row',
    table: {
      type: { summary: 'event' },
      category: 'events',
    },
  },

  call: {
    table: {
      type: { summary: 'event' },
    },
  },
};

const decorator = () => ({
  template: `<div style="background-color: var(--dt-theme-sidebar-color-background)" class="d-wmx264 d-p8"><story />
  </div>`,
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

export const Default = {
  render: (argsData) => createRenderConfig(DtRecipeContactRow, DtRecipeContactRowDefaultTemplate, argsData),
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtRecipeContactRow, DtRecipeContactRowVariantsTemplate, argsData),
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
