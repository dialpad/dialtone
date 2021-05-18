import DtBanner from './banner';
import BannerDefault from './banner_default.story.vue';
import { createTemplateFromVueFile } from '../storybook_utils';
import { argTypesData } from '../notice/notice.stories.js';

argTypesData.titleId = {
  defaultValue: '',
  table: {
    defaultValue: {
      summary: 'generated unique ID',
    },
  },
};
argTypesData.contentId = {
  defaultValue: '',
  table: {
    defaultValue: {
      summary: 'generated unique ID',
    },
  },
};

export default {
  title: 'Elements/Banner',
  component: DtBanner,
  argTypes: argTypesData,
  excludeStories: /.Data$/,
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, BannerDefault);

export const Default = Template.bind({});
Default.args = {
  title: 'Banner title',
  default: 'Main content of the banner goes here.',
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
