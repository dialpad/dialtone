import DtNotice from './notice';
import { NOTICE_KINDS } from './notice_constants';
import NoticeDefault from './notice_default.story.vue';
import { createTemplateFromVueFile, getIconNames } from '../storybook_utils';

export const argTypesData = {
  kind: {
    control: {
      type: 'select',
      options: NOTICE_KINDS,
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
  action: {
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
  title: 'Notice title',
  default: 'Main content of the notice goes here.',
  action: 'try this <a href="https://www.dialpad.com" target="_blank">action</a>',
};

export const Info = Template.bind({});
Info.args = { ...Default.args, kind: 'info' };

export const Warning = Template.bind({});
Warning.args = { ...Default.args, kind: 'warning' };

export const Error = Template.bind({});
Error.args = { ...Default.args, kind: 'error' };

export const Success = Template.bind({});
Success.args = { ...Default.args, kind: 'success' };
