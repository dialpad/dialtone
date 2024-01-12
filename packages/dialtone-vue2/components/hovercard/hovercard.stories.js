import DtHovercard from './hovercard.vue';

import DtHovercardDefaultTemplate from './hovercard_default.story.vue';
import DtHovercardManyTemplate from './hovercard_many.story.vue';
import { createRenderConfig } from '@/common/storybook_utils';
import { action } from '@storybook/addon-actions';
import {
  POPOVER_DIRECTIONS,
  POPOVER_PADDING_CLASSES,
} from '@/components/popover/index.js';

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
  fallbackPlacements: {
    description: `If the popover does not fit in the direction described by "placement",
    it will attempt to change its direction to the "fallbackPlacements".
    <a
      class="d-link"
      href="https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements"
      target="_blank"
    >
      Popper.js docs
    </a>`,
  },
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  offset: {
    description: `Displaces the content box from its anchor element
    by the specified number of pixels.
    <a
      class="d-link"
      href="https://atomiks.github.io/tippyjs/v6/all-props/#offset"
      target="_blank"
    >
      Tippy.js docs
    </a>`,
  },
  padding: {
    options: Object.keys(POPOVER_PADDING_CLASSES),
    control: {
      type: 'select',
    },
  },
  placement: {
    description: `The direction the popover displays relative to the anchor.
    <a
      class="d-link"
      href="https://atomiks.github.io/tippyjs/v6/all-props/#placement"
      target="_blank"
    >
      Tippy.js docs
    </a>`,
    options: POPOVER_DIRECTIONS,
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: 'top-start',
      },
      type: {
        summary: `top, top-start, top-end,
        right, right-start, right-end,
        left, left-start, left-end,
        bottom, bottom-start, bottom-end,
        auto, auto-start, auto-end`,
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
  offset: [0, 16],
  appendTo: 'body',
  onOpened: action('opened'),
  transition: false,
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

export const Default = {
  render: (argsData) => createRenderConfig(DtHovercard, DtHovercardDefaultTemplate, argsData),

  args: {},
};

export const Many = {
  render: (argsData) => createRenderConfig(DtHovercard, DtHovercardManyTemplate, argsData),
  args: { ...Default.args, offset: [0, 5] },
};
