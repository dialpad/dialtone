import { action } from 'storybook/actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeContactRow from './ContactRow.vue';

import DtRecipeContactRowDefaultTemplate from './ContactRowDefault.story.vue';
import DtRecipeContactRowVariantsTemplate from './ContactRowVariants.story.vue';
import { AVATAR_PRESENCE_STATES } from '@/components/Avatar/AvatarConstants';
import defaultImage from '@/common/assets/avatar2.png';

// Default Prop Values
export const argsData = {
  name: 'Jaqueline Nackos',
  avatarSrc: defaultImage,
  avatarColor: '',
  hasUnreads: true,
  unreadCount: '55',
  avatarPresence: 'active',
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
    control: {
      type: 'text',
    },
    description: 'Legacy color prop. Use avatarSeed instead for auto-generated colors.',
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
  template: `<div style="background-color: var(--dt-shell-color-surface-default)" class="d-wmx-400 d-p-100"><story />
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
