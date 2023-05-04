import { action } from '@storybook/addon-actions';
import DtNotice from './notice.vue';
import { NOTICE_KINDS, NOTICE_ROLES } from './notice_constants';
import NoticeDefault from './notice_default.story.vue';

import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';

const iconsList = getIconNames();

// Default Prop Values
export const argsData = {
  onClose: action('close'),
  onClick: action('click'),
  visuallyHiddenCloseLabel: 'Close Notice',
  show: undefined,
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
  kind: {
    options: NOTICE_KINDS,
    control: {
      type: 'select',
    },
  },
  role: {
    options: NOTICE_ROLES,
    control: {
      type: 'select',
    },
  },
  show: {
    table: {
      disable: true,
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
  title: 'Components/Notice',
  component: DtNotice,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.Data$/,
};

const Template = (args) => createTemplateFromVueFile(args, NoticeDefault);

export const Default = {
  render: Template,

  args: {
    title: 'Base title (optional)',
    kind: 'base',
  },
};

export const Error = {
  render: Template,

  args: {
    ...Default.args,
    title: 'Error title (optional)',
    kind: 'error',
  },
};

export const Info = {
  render: Template,

  args: {
    ...Default.args,
    title: 'Info title (optional)',
    kind: 'info',
  },
};

export const Success = {
  render: Template,

  args: {
    ...Default.args,
    title: 'Success title (optional)',
    kind: 'success',
  },
};

export const Warning = {
  render: Template,

  args: {
    ...Default.args,
    title: 'Warning title (optional)',
    kind: 'warning',
  },
};

export const Important = {
  render: Template,

  args: {
    ...Default.args,
    important: true,
  },
};
