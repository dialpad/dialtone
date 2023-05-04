import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtRecipeFeedItemRow from './feed_item_row.vue';
import DtRecipeFeedItemRowDefaultTemplate from './feed_item_row_default.story.vue';
import DtRecipeFeedItemRowVariantsTemplate from './feed_item_row_variants.story.vue';

const iconsList = getIconNames();

export const argsData = {
  avatarImageUrl: 'https://i1.sndcdn.com/avatars-000181324408-652e57-t500x500.jpg',
  displayName: 'Dwight Schrute',
  time: '4:54 PM',
  shortTime: '4:54',
  onFocus: action('focus'),
  onHover: action('hover'),
  default: `<p>Elementum fames nullam elementum velit proin vitae aliquet.
  Platea nulla consectetur consequat sagittis nullam et ultricies nisl rhoncus
  aliquet elementum venenatis quisque.</p>`,
  menu: 'menu',
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
    name: 'reactions',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  menu: {
    name: 'menu',
    options: iconsList,
    table: {
      category: 'slots',
      type: { summary: 'component' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
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

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeFeedItemRowDefaultTemplate,
);
const VariantsTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeFeedItemRowVariantsTemplate,
);

export const Default = {
  render: DefaultTemplate,

  args: {
    showHeader: true,
    reactions: 'emoji reactions',
    threading: 'threading',
  },
};
Default.parameters = {
  a11y: {
    config: {
      rules: [
        {
          id: 'aria-allowed-attr',
          enabled: false,
        },
        {
          id: 'color-contrast',
          enabled: false,
        },
      ],
    },
  },
};

export const Variants = {
  render: VariantsTemplate,

  args: {},
};
Variants.parameters = {
  a11y: Default.parameters.a11y,
};
