import DtHovercard from './hovercard.vue';

import DtHovercardDefaultTemplate from './hovercard_default.story.vue';
import DtHovercardManyTemplate from './hovercard_many.story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { action } from '@storybook/addon-actions';
import {
  POPOVER_DIRECTIONS,
  POPOVER_PADDING_CLASSES,
} from '@/components/popover/index.js';
import avatar1 from '@/common/assets/avatar1.png';
import avatar2 from '@/common/assets/avatar2.png';

export const argTypesData = {
  // Slots
  anchor: {
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  content: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  headerContent: {
    name: 'headerContent',
    description: 'Slot for popover header content',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },
  footerContent: {
    name: 'footerContent',
    description: 'Slot for popover footer content',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  padding: {
    options: Object.keys(POPOVER_PADDING_CLASSES),
    control: {
      type: 'select',
    },
  },
  placement: {
    options: POPOVER_DIRECTIONS,
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: 'top-start',
      },
    },
  },
  transition: {
    control: {
      type: 'boolean',
    },
  },
  appendTo: {
    table: {
      defaultValue: {
        summary: 'body',
      },
    },
  },

  // Events
  onOpened: {
    table: {
      disable: true,
    },
  },

  opened: {
    description: `emitted when popover is shown or hidden.`,
    table: {
      type: {
        summary: 'event',
      },
    },
  },
};

export const argsData = {
  placement: 'top-start',
  fallbackPlacements: ['bottom-start'],
  contentWidth: null,
  sticky: false,
  offset: [0, 16],
  appendTo: 'body',
  onOpened: action('opened'),
  visuallyHiddenCloseLabel: 'Close popover',
  transition: false,
  cardData: [{
    name: 'Jaqueline Nackos', src: avatar2, time: '4:54 PM', default: `<p class="d-fs-200 d-lh-400 d-wmx90ch">
  Elementum fames nullam elementum velit proin vitae aliquet.
  Platea nulla consectetur consequat sagittis nullam et ultricies nisl rhoncus
  aliquet elementum venenatis quisque.</p>`,
  },
  {
    name: 'Joseph Lumaban', src: avatar1, time: '5:05 PM', default: `<p class="d-fs-200 d-lh-400 d-wmx90ch">
  Elementum fames nullam elementum velit proin vitae aliquet.
  Platea nulla consectetur consequat sagittis nullam et ultricies nisl rhoncus
  aliquet elementum venenatis quisque.</p>`,
  },
  {
    name: 'Purdie Afra', time: '5:16 PM', default: `<p class="d-fs-200 d-lh-400 d-wmx90ch">
  Elementum fames nullam elementum velit proin vitae aliquet.
  Platea nulla consectetur consequat sagittis nullam et ultricies nisl rhoncus
  aliquet elementum venenatis quisque.</p>`,
  }],
};

const decorator = () => ({
  template: `<div class="d-wmx464"><story />
  </div>`,
});

export default {
  title: 'Components/Hovercard',
  component: DtHovercard,
  args: argsData,
  argTypes: argTypesData,
  decorators: [decorator],
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtHovercardDefaultTemplate,
);
export const Default = {
  render: DefaultTemplate,

  args: {},
};

const ManyTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtHovercardManyTemplate,
);
export const Many = {
  render: ManyTemplate,
  args: { ...Default.args, offset: [0, 5] },
};
