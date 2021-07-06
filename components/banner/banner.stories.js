import DtBanner from './banner';
import BaseBannerMdx from './banner.mdx';
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
  parameters: {
    docs: {
      page: BaseBannerMdx,
    },
  },
  argTypes: argTypesData,
  excludeStories: /.Data$/,
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, BannerDefault);

export const Default = Template.bind({});
Default.args = {
  title: 'Optional title',
  action: 'Action',
  kind: 'base',
};

export const Error = Template.bind({});
Error.args = { ...Default.args, kind: 'error' };

export const Info = Template.bind({});
Info.args = { ...Default.args, kind: 'info' };

export const Success = Template.bind({});
Success.args = { ...Default.args, kind: 'success' };

export const Warning = Template.bind({});
Warning.args = { ...Default.args, kind: 'warning' };

export const Pinned = Template.bind({});
Pinned.args = { ...Default.args, pinned: true };
