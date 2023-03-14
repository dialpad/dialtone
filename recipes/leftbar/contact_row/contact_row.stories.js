import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeContactRow from './contact_row';
import DtRecipeContactRowMdx from './contact_row.mdx';
import DtRecipeContactRowDefaultTemplate from './contact_row_default.story.vue';
import DtRecipeContactRowVariantsTemplate from './contact_row_variants.story.vue';
import { PRESENCE_STATES_LIST } from '@/components/presence/presence_constants';
const defaultImage = require('@/components/avatar/person.png');

// Default Prop Values
export const argsData = {
  callButtonTooltip: 'Call',
  hasUnreads: true,
  unreadCount: '55',
  unreadCountTooltip: '55 unread messages',
  onClick: action('click'),
  onCall: action('call'),
};

export const argTypesData = {
  // Props

  name: {
    defaultValue: 'Jaqueline Nackos',
  },

  avatarSrc: {
    defaultValue: defaultImage,
  },

  avatarPresence: {
    control: {
      type: 'select',
      options: [...PRESENCE_STATES_LIST],
    },
    table: {
      defaultValue: {
        summary: 'active',
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
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtRecipeContactRowMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(args, DtRecipeContactRowDefaultTemplate);
const VariantsTemplate = (args) => createTemplateFromVueFile(args, DtRecipeContactRowVariantsTemplate);

// Stories
export const Default = DefaultTemplate.bind({});

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
