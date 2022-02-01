import {
  DtPopover,
  POPOVER_PADDING_CLASSES,
  POPOVER_ROLES,
  POPOVER_CONTENT_WIDTHS,
} from './';
import PopoverDefault from './popover_default.story.vue';
import PopoverVariants from './popover_variants.story.vue';
import { createTemplateFromVueFile } from '../storybook_utils';
import PopoverMdx from './popover.mdx';
import { action } from '@storybook/addon-actions';
import { TOOLTIP_HIDE_ON_CLICK_VARIANTS } from '../tooltip';
import { POPOVER_DIRECTIONS } from './popover_constants';

const argTypesData = {
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

  // Events
  onUpdateOpen: {
    table: {
      disable: true,
    },
  },

  'update:open': {
    description: `The popover will emit a boolean value for this event when the \
user performs a popover-closing or opening action and also the popover content reference when it was open. \
Parent components can sync on this value to create a 2-way binding to control popover visibility.`,
    table: {
      type: {
        summary: 'boolean',
      },
    },
  },
  hideOnClick: {
    type: 'select',
    options: TOOLTIP_HIDE_ON_CLICK_VARIANTS,
  },
};

// Default Props for all variations
export const argsData = {
  onUpdateOpen: action('update:show'),
};

export default {
  title: 'Components/Popovers',
  component: DtPopover,
  args: argsData,
  argTypes: argTypesData,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
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
Default.parameters = {
  docs: {
    source: {
      code: `
<dt-popover :open.sync="open">
  <template #anchor="{ attrs }">
    <dt-button
      v-bind="attrs"
      @click="open = !open"
    >
      Click to open
    </dt-button>
  </template>
  <template #content>
    <p>I will be displayed in the popover!</p>
  </template>
</dt-popover>
    `,
    },
  },
};

export const Variants = TemplateVariants.bind({});
