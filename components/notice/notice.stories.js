import DtNotice from './notice';
import { NOTICE_KINDS, NOTICE_ROLES } from './notice_constants';
import NoticeDefault from './notice_default.story.vue';
import { createTemplateFromVueFile, getIconNames } from '../storybook_utils';

export const argTypesData = {
  kind: {
    control: {
      type: 'select',
      options: NOTICE_KINDS,
    },
  },
  role: {
    control: {
      type: 'select',
      options: NOTICE_ROLES,
    },
  },
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
};

export default {
  title: 'Elements/Notice',
  component: DtNotice,
  argTypes: argTypesData,
  excludeStories: /.Data$/,
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, NoticeDefault);

export const Default = Template.bind({});
Default.args = {
  title: 'Base title (optional)',
  default: 'Message body with <a href="#" class="d-link d-link--muted">a link.</a>',
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  title: 'Error title (optional)',
  kind: 'error',
};

export const Info = Template.bind({});
Info.args = {
  ...Default.args,
  title: 'Info title (optional)',
  kind: 'info',
};

export const Success = Template.bind({});
Success.args = {
  ...Default.args,
  title: 'Success title (optional)',
  kind: 'success',
};

export const Warning = Template.bind({});
Warning.args = {
  ...Default.args,
  title: 'Warning title (optional)',
  kind: 'warning',
};

export const Important = Template.bind({});
Important.args = {
  ...Default.args,
  important: true,
  default: 'Message body with <a href="#" class="d-link d-link--inverted">a link.</a>',
};
