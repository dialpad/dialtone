import { action } from 'storybook/actions';
import DtNotice from './Notice.vue';
import { NOTICE_KINDS, NOTICE_ROLES } from './NoticeConstants';
import NoticeDefault from './NoticeDefault.story.vue';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';

const iconsList = getIconNames();

// Default Prop Values
export const argsData = {
  onClose: action('close'),
  onClick: action('click'),
  show: undefined,
};

const argsDataLongText = {
  headerText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
  default: `Duis aute irure dolor in reprehenderit in voluptate velit
      esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
};

export const argTypesData = {
  // Slots
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
  showClose: {
    control: {
      type: 'boolean',
    },
  },
  showIcon: {
    control: {
      type: 'boolean',
    },
  },
  showAction: {
    control: {
      type: 'boolean',
    },
  },
  important: {
    control: {
      type: 'boolean',
    },
  },
  truncateText: {
    control: {
      type: 'boolean',
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

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, NoticeDefault);

export const Default = {
  render: Template,

  args: {
    headerText: 'Base title (optional)',
    kind: 'base',
  },
};

export const Critical = {
  render: Template,

  args: {
    ...Default.args,
    headerText: 'Critical title (optional)',
    kind: 'critical',
  },
};

export const Info = {
  render: Template,

  args: {
    ...Default.args,
    headerText: 'Info title (optional)',
    kind: 'info',
  },
};

export const Positive = {
  render: Template,

  args: {
    ...Default.args,
    headerText: 'Positive title (optional)',
    kind: 'positive',
  },
};

export const Warning = {
  render: Template,

  args: {
    ...Default.args,
    headerText: 'Warning title (optional)',
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

export const TruncateContent = {
  render: Template,

  args: {
    ...Default.args,
    truncateText: true,
    headerText: argsDataLongText.headerText,
    default: argsDataLongText.default,
  },
};
