import {
  DtPopover,
  POPOVER_PADDING_CLASSES,
  POPOVER_ROLES,
  POPOVER_CONTENT_WIDTHS,
  POPOVER_INITIAL_FOCUS_STRINGS,
} from './';
import PopoverDefault from './popover_default.story.vue';
import PopoverVariants from './popover_variants.story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import PopoverMdx from './popover.mdx';
import { action } from '@storybook/addon-actions';
import { POPOVER_DIRECTIONS, POPOVER_STICKY_VALUES } from './popover_constants';

// Default Props for all variations
export const argsData = {
  onOpened: action('opened'),
  visuallyHiddenCloseLabel: 'Close popover',
};

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
    control: {
      type: 'select',
      options: Object.keys(POPOVER_PADDING_CLASSES),
    },
  },
  initialFocusElement: {
    control: {
      type: 'select',
      options: [...Object.values(POPOVER_INITIAL_FOCUS_STRINGS), '#content-close'],
    },
  },
  role: {
    control: {
      type: 'select',
      options: POPOVER_ROLES,
    },
  },
  placement: {
    defaultValue: 'bottom-end',
    control: {
      type: 'select',
      options: POPOVER_DIRECTIONS,
    },
    table: {
      defaultValue: {
        summary: 'bottom-end',
      },
    },
  },
  contentWidth: {
    defaultValue: null,
    control: {
      type: 'select',
      options: POPOVER_CONTENT_WIDTHS,
    },
    table: {
      defaultValue: {
        summary: 'null',
      },
    },
  },
  sticky: {
    defaultValue: false,
    control: {
      type: 'select',
      options: POPOVER_STICKY_VALUES,
    },
    table: {
      defaultValue: {
        summary: 'false',
      },
    },
  },
  transition: {
    control: {
      type: 'select',
      options: ['', 'fade', 'pop', 'shake'],
    },
  },
  offset: {
    defaultValue: [0, 4],
  },

  // Events
  onOpened: {
    table: {
      disable: true,
    },
  },

  'update:open': {
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

export default {
  title: 'Components/Popover',
  component: DtPopover,
  args: argsData,
  argTypes: argTypesData,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    options: { showPanel: true },
    docs: {
      page: PopoverMdx,
    },
  },
  excludeStories: /.Data$/,
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, PopoverDefault);
const TemplateVariants = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, PopoverVariants);

export const Default = Template.bind({});
Default.args = {};
Default.decorators = [() => ({
  template: `<div class="d-d-flex d-jc-center d-ai-center d-h332"><story /></div>`,
})];
Default.parameters = {};

export const Variants = TemplateVariants.bind({});
Variants.args = {};
Variants.parameters = {
  controls: {
    disable: true,
  },
  actions: {
    disable: true,
  },
  options: {
    showPanel: false,
  },
  a11y: {
    config: {
      rules: [
        {
          id: 'aria-allowed-attr',
          enabled: false,
        },
      ],
    },
  },
};
