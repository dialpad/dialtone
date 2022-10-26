import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtToast from './toast';
import DtToastMdx from './toast.mdx';
import DtToastDefaultTemplate from './toast_default.story.vue';
import { NOTICE_KINDS } from '../notice';

// Default Prop Values
export const argsData = {
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
    table: {
      type: { summary: 'component' },
    },
    control: {
      type: 'select',
      options: getIconNames(),
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
    control: {
      type: 'select',
      options: NOTICE_KINDS,
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
    defaultValue: 6000,
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
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtToastMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtToastDefaultTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  title: 'Base title (optional)',
  kind: 'base',
};

export const Error = DefaultTemplate.bind({});
Error.args = {
  ...Default.args,
  title: 'Error title (optional)',
  kind: 'error',
};

export const Info = DefaultTemplate.bind({});
Info.args = {
  ...Default.args,
  title: 'Info title (optional)',
  kind: 'info',
};

export const Success = DefaultTemplate.bind({});
Success.args = {
  ...Default.args,
  title: 'Success title (optional)',
  kind: 'success',
};

export const Warning = DefaultTemplate.bind({});
Warning.args = {
  ...Default.args,
  title: 'Warning title (optional)',
  kind: 'warning',
};

export const Important = DefaultTemplate.bind({});
Important.args = {
  ...Default.args,
  important: true,
};
