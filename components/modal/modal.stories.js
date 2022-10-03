import DtModal from './modal.vue';
import ModalMdx from './modal.mdx';
import DtModalDefaultTemplate from './modal_default.story.vue';
import { MODAL_KIND_MODIFIERS, MODAL_SIZE_MODIFIERS } from './modal_constants';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { action } from '@storybook/addon-actions';

export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  banner: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  footer: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  header: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  size: {
    defaultValue: 'default',
    control: {
      type: 'select',
      options: Object.keys(MODAL_SIZE_MODIFIERS),
    },
  },
  kind: {
    defaultValue: 'default',
    control: {
      type: 'select',
      options: Object.keys(MODAL_KIND_MODIFIERS),
    },
  },
  showFooter: {
    table: {
      disable: true,
    },
  },
  labelledById: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },

  // Events
  'update:show': {
    description: `The modal will emit a "false" boolean value for this event when the \
user performs a modal-closing action.  Parent components can sync on this value to create \
a 2-way binding to control modal visibility.`,
    table: {
      type: {
        summary: 'boolean',
      },
    },
  },
  onClose: {
    table: {
      disable: true,
    },
  },
};

// Default Props for all variations
export const argsData = {
  closeButtonProps: {
    ariaLabel: 'Close',
  },
  copy: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget lacus quis velit \
viverra iaculis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum \
maximus ipsum ex. Curabitur elementum luctus augue, quis eleifend tortor feugiat vel. \
Maecenas maximus, ipsum et laoreet congue, diam massa aliquam libero, at pellentesque \
orci ipsum et velit.`,
  title: 'Example Title',
  onClose: action('update:show'),
};

export default {
  title: 'Components/Modal',
  component: DtModal,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: ModalMdx,
    },
    options: {
      showPanel: true,
    },
  },
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtModalDefaultTemplate);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
};

export const WithFooter = DefaultTemplate.bind({});
WithFooter.args = {
  showFooter: true,
};

export const WithFixedHeaderFooter = DefaultTemplate.bind({});
WithFixedHeaderFooter.args = {
  showFooter: true,
  fixedHeaderFooter: true,
  copy: argsData.copy.repeat(4),
};

export const WithBanner = DefaultTemplate.bind({});
WithBanner.args = {
  bannerTitle: 'Example banner',
};

export const WithDangerStyle = DefaultTemplate.bind({});
WithDangerStyle.args = {
  kind: 'danger',
  showFooter: true,
};

export const WithFullSize = DefaultTemplate.bind({});
WithFullSize.args = {
  size: 'full',
  showFooter: true,
};

export const WithCustomHeaderAndContent = DefaultTemplate.bind({});
WithCustomHeaderAndContent.args = {
  header: `
    <div class="d-fl-center d-p12 d-bgc-purple-100">
      <div>[custom header]</div>
    </div>`,
  default: `
    <div class="d-fl-center d-p32 d-bgc-gold-200">
      <h2>[custom body]</h2>
    </div>`,
};
