import DtModal from './modal.vue';

import DtModalDefaultTemplate from './modal_default.story.vue';
import { MODAL_KIND_MODIFIERS, MODAL_SIZE_MODIFIERS } from './modal_constants';
import { createRenderConfig } from '@/common/storybook_utils';
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
  toggleOpen: action('update:show'),
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
  closeOnClick: {
    control: {
      type: 'boolean',
    },
  },
  fixedHeaderFooter: {
    control: {
      type: 'boolean',
    },
  },
  hideClose: {
    control: {
      type: 'boolean',
    },
  },
  show: {
    control: {
      type: 'boolean',
    },
  },
  visuallyHiddenClose: {
    control: {
      type: 'boolean',
    },
  },

  // Events
  'update:show': {
    description: `The modal will emit a "false" boolean value when the user performs a modal-closing action \
     and a "true" boolean value after the modal is fully-shown.\
     Parent components can sync on this value to create a 2-way binding to control modal visibility.`,
    table: {
      type: {
        summary: 'boolean',
      },
    },
  },
  toggleOpen: {
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

export const Default = {
  render: (argsData) => createRenderConfig(DtModal, DtModalDefaultTemplate, argsData),

  args: {},
  parameters: {
    percy: {
      args: {
        show: true,
      },
    },
  },
};

export const WithFooter = {
  render: (argsData) => createRenderConfig(DtModal, DtModalDefaultTemplate, argsData),

  args: {
    showFooter: true,
  },

  parameters: { ...Default.parameters },
};

export const WithFixedHeaderFooter = {
  render: (argsData) => createRenderConfig(DtModal, DtModalDefaultTemplate, argsData),

  args: {
    showFooter: true,
    fixedHeaderFooter: true,
    copy: argsData.copy.repeat(4),
  },

  parameters: { ...Default.parameters },
};

export const WithBanner = {
  render: (argsData) => createRenderConfig(DtModal, DtModalDefaultTemplate, argsData),

  args: {
    bannerTitle: 'Example banner',
  },

  parameters: { ...Default.parameters },
};

export const WithDangerStyle = {
  render: (argsData) => createRenderConfig(DtModal, DtModalDefaultTemplate, argsData),

  args: {
    kind: 'danger',
    showFooter: true,
  },

  parameters: { ...Default.parameters },
};

export const WithFullSize = {
  render: (argsData) => createRenderConfig(DtModal, DtModalDefaultTemplate, argsData),

  args: {
    size: 'full',
    showFooter: true,
  },

  parameters: { ...Default.parameters },
};

export const WithCustomHeaderAndContent = {
  render: (argsData) => createRenderConfig(DtModal, DtModalDefaultTemplate, argsData),

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

  parameters: { ...Default.parameters },
};
