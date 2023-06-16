import DtModal from './modal.vue';

import DtModalDefaultTemplate from './modal_default.story.vue';
import { MODAL_KIND_MODIFIERS, MODAL_SIZE_MODIFIERS } from './modal_constants';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { action } from '@storybook/addon-actions';
import { NOTICE_KINDS } from '@/components/notice';

// Default Props for all variations
export const argsData = {
  size: 'default',
  kind: 'default',
  bannerKind: 'warning',
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
  visuallyHiddenCloseLabel: 'Close Modal',
};

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
    options: Object.keys(MODAL_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  kind: {
    options: Object.keys(MODAL_KIND_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  bannerKind: {
    options: NOTICE_KINDS,
    control: {
      type: 'select',
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

export default {
  title: 'Components/Modal',
  component: DtModal,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(args, DtModalDefaultTemplate);

export const Default = {
  render: DefaultTemplate,

  args: {},
};

export const WithFooter = {
  render: DefaultTemplate,

  args: {
    showFooter: true,
  },
};

export const WithFixedHeaderFooter = {
  render: DefaultTemplate,

  args: {
    showFooter: true,
    fixedHeaderFooter: true,
    copy: argsData.copy.repeat(4),
  },
};

export const WithBanner = {
  render: DefaultTemplate,

  args: {
    bannerTitle: 'Example banner',
  },
};

export const WithDangerStyle = {
  render: DefaultTemplate,

  args: {
    kind: 'danger',
    showFooter: true,
  },
};

export const WithFullSize = {
  render: DefaultTemplate,

  args: {
    size: 'full',
    showFooter: true,
  },
};

export const WithCustomHeaderAndContent = {
  render: DefaultTemplate,

  args: {
    header: `
      <div class="d-fl-center d-p12 d-bgc-purple-100">
        <div>[custom header]</div>
      </div>`,
    default: `
      <div class="d-fl-center d-p32 d-bgc-gold-200">
        <h2>[custom body]</h2>
      </div>`,
  },
};
