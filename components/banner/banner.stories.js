import DtBanner from './banner';
import BaseBannerMdx from './banner.mdx';
import BannerDefault from './banner_default.story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { argsData, argTypesData } from '../notice/notice.stories.js';

argTypesData.role = {
  table: {
    disable: true,
  },
};
argTypesData.titleId = {
  table: {
    defaultValue: {
      summary: 'generated unique ID',
    },
  },
};
argTypesData.contentId = {
  table: {
    defaultValue: {
      summary: 'generated unique ID',
    },
  },
};
argsData.visuallyHiddenCloseLabel = 'Close Banner';

export { argsData, argTypesData };

export default {
  title: 'Components/Banner',
  component: DtBanner,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: BaseBannerMdx,
    },
    options: {
      showPanel: true,
    },
  },
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.Data$/,
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, BannerDefault);

const backgroundImage = require('../../docs/assets/dialpad-gradient.png');

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

export const CustomBackground = Template.bind({});
CustomBackground.args = {
  ...Default.args,
  backgroundImage,
  backgroundSize: 'contain',
  title: '',
  action: '',
  hideIcon: true,
  dialogClass: 'd-fc-white',
  default: 'The power of Dialpad. On your desktop',
};
