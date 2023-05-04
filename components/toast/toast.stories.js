import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtToast from './toast.vue';

import DtToastDefaultTemplate from './toast_default.story.vue';
import { NOTICE_KINDS } from '../notice';

const iconsList = getIconNames();

// Default Prop Values
export const argsData = {
  duration: 6000,
  onClose: action('close'),
  onClick: action('click'),
  visuallyHiddenCloseLabel: 'Close Toast',
};

export const argTypesData = {
  // Slots
  titleOverride: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  icon: {
    options: iconsList,
    table: {
      type: { summary: 'component' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  default: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  action: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },

  // Props
  titleId: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  contentId: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  kind: {
    options: NOTICE_KINDS,
    control: {
      type: 'select',
    },
  },
  show: {
    table: {
      defaultValue: {
        summary: 'false',
      },
    },
  },
  duration: {
    table: {
      defaultValue: {
        summary: 'null',
      },
    },
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },
  onClose: {
    table: {
      disable: true,
    },
  },

  close: {
    description: 'Close button click event',
    table: {
      type: { summary: 'event' },
    },
  },
};

// Story Collection
export default {
  title: 'Components/Toast',
  component: DtToast,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtToastDefaultTemplate,
);

export const Default = {
  render: DefaultTemplate,

  args: {
    title: 'Base title (optional)',
    kind: 'base',
  },
};

export const Error = {
  render: DefaultTemplate,

  args: {
    ...Default.args,
    title: 'Error title (optional)',
    kind: 'error',
  },
};

export const Info = {
  render: DefaultTemplate,

  args: {
    ...Default.args,
    title: 'Info title (optional)',
    kind: 'info',
  },
};

export const Success = {
  render: DefaultTemplate,

  args: {
    ...Default.args,
    title: 'Success title (optional)',
    kind: 'success',
  },
};

export const Warning = {
  render: DefaultTemplate,

  args: {
    ...Default.args,
    title: 'Warning title (optional)',
    kind: 'warning',
  },
};

export const Important = {
  render: DefaultTemplate,

  args: {
    ...Default.args,
    important: true,
  },
};
