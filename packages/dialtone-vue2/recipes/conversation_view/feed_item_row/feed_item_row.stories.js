import { action } from '@storybook/addon-actions';
import { createRenderConfig } from '@/common/storybook_utils';
import DtRecipeFeedItemRow from './feed_item_row.vue';
import DtRecipeFeedItemRowDefaultTemplate from './feed_item_row_default.story.vue';
import DtRecipeFeedItemRowVariantsTemplate from './feed_item_row_variants.story.vue';

import { DEFAULT_FEED_ROW_STATE, FEED_ROW_STATE_BACKGROUND_COLOR } from './feed_item_row_constants';

export const argsData = {
  avatarImageUrl: 'https://i1.sndcdn.com/avatars-000181324408-652e57-t500x500.jpg',
  displayName: 'Dwight Schrute',
  time: '4:54 PM',
  shortTime: '4:54',
  onFocus: action('focus'),
  onHover: action('hover'),
  attachment: '<img class="dt-feed-item-row__image" alt="dwight" src="https://i1.sndcdn.com/avatars-000181324408-652e57-t500x500.jpg"></img>',
  default: `Elementum fames :smile: nullam elementum velit proin vitae aliquet.
  Platea nulla consectetur consequat sagittis nullam et ultricies nisl rhoncus
  aliquet elementum venenatis :laughing: quisque.`,
};

/*
  Controls
  ========

  Here we define any custom controls or control overrides for our components.

  By default storybook will attempt to provide an appropriate control of the same name for each property in the
  component as well as include any description provided using a prop decorator within your component (see above).

  Storybook will also attempt to provide an appropriate control for each slot in the component as well as include any
  description provided using a slot decorator within your component (see below).

  <!-- @slot example slot decorator -->
*/
export const argTypesData = {
  // Slots
  /*
    We use the following naming scheme `<SLOT_NAME>Slot` for slot controls to prevent conflicts with props that share
    the same name. We provide the correct name of the slot using the name control attribute to ensure that the argument
    table and description within the controls accurately reflects the correct names of our component's props and slots.
  */
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  attachment: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  avatar: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  threading: {
    name: 'threading',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  reactions: {
    control: false,
  },

  menu: {
    control: false,
  },

  state: {
    defaultValue: DEFAULT_FEED_ROW_STATE,
    options: Object.keys(FEED_ROW_STATE_BACKGROUND_COLOR),
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
    table: {
      defaultValue: {
        summary: DEFAULT_FEED_ROW_STATE,
      },
    },
  },

  // Events
  onFocus: {
    table: {
      disable: true,
    },
  },
  onHover: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Recipes/Conversation View/Feed Item Row',
  component: DtRecipeFeedItemRow,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(DtRecipeFeedItemRow, DtRecipeFeedItemRowDefaultTemplate, argsData),

  decorators: [
    () => ({
      template: `<ul class="d-ls-none d-pt32" style="padding-inline-start: 0px; max-width: 960px"><story /></ul>`,
    }),
  ],

  args: {
    showHeader: true,
    threading: 'threading',
  },
};
Default.parameters = {
  a11y: {
    config: {
      rules: [
        {
          id: 'color-contrast',
          enabled: false,
        },
        {
          // @fixme We have nested buttons, we need to fix this in the future.
          id: 'nested-interactive',
          reviewOnFail: true,
        },
      ],
    },
  },
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtRecipeFeedItemRow, DtRecipeFeedItemRowVariantsTemplate, argsData),

  args: {
  },
};
Variants.parameters = {
  a11y: Default.parameters.a11y,
};
