import DtHovercard from './hovercard.vue';

import DtHovercardDefaultTemplate from './hovercard_default.story.vue';
import DtHovercardManyTemplate from './hovercard_many.story.vue';
import DtHovercardWithInputTemplate from './hovercard_with_input.story.vue';
import DtHovercardExternalAnchorTemplate from './hovercard_external_anchor.story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { action } from 'storybook/actions';
import {
  POPOVER_DIRECTIONS,
  POPOVER_PADDING_CLASSES,
} from '@/components/popover/index.js';
import { CONTENT_MODE_ARG_TYPE } from '@/common/mode_constants';

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
  contentMode: CONTENT_MODE_ARG_TYPE,
  open: {
    control: {
      type: 'boolean',
    },
  },
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

export default {
  title: 'Components/Hovercard',
  component: DtHovercard,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtHovercardDefaultTemplate,
);
export const Default = {
  render: DefaultTemplate,
  decorators: [() => ({
    template: `<div> <story /> </div>`,
  })],

  args: {},
};

const ManyTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtHovercardManyTemplate,
);
export const Many = {
  render: ManyTemplate,
  decorators: [() => ({
    template: `<div><story /></div>`,
  })],
  args: { ...Default.args, offset: [0, 5] },
};

const InputTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtHovercardWithInputTemplate,
);
export const WithInput = {
  render: InputTemplate,
  decorators: [() => ({
    template: `<div><story /></div>`,
  })],
  args: { ...Default.args, offset: [0, 5] },
};

const ExternalAnchorTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtHovercardExternalAnchorTemplate,
);
export const ExternalAnchor = {
  render: ExternalAnchorTemplate,
  decorators: [() => ({
    template: `<dt-stack direction="row" justify="center" align="center" class="d-h-700">
      <div class="d-w-500">
        <story />
      </div>
    </dt-stack>`,
  })],
  args: { ...Default.args },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates using <code>externalAnchorElement</code> with the exposed <code>show()</code>/<code>hide()</code> API. ' +
          'This pattern is used when the anchor lives outside the hovercard\'s DOM scope (e.g. inside a Shadow DOM), ' +
          'so the hovercard cannot detect hover events automatically. ' +
          'The parent listens for hover events and calls <code>show()</code>/<code>hide()</code> directly on the hovercard ref.',
      },
    },
  },
};
