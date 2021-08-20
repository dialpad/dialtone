import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '../storybook_utils';
import DtToast from './toast';
import DtToastMdx from './toast.mdx';
import DtToastDefaultTemplate from './toast_default.story.vue';
import { NOTICE_KINDS } from '../notice';

// Default Prop Values
export const argsData = {
  onClose: action('close'),
};

export const argTypesData = {
  // Props
  titleId: {
    defaultValue: '',
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  contentId: {
    defaultValue: '',
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

  // Slots
  titleOverride: {
    table: {
      type: { summary: 'text/html' },
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
      type: { summary: 'text/html' },
    },
    control: {
      type: 'text',
    },
  },

  // Action Event Handlers
  onClose: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Elements/Toast',
  component: DtToast,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      page: DtToastMdx,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
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
