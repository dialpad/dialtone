import DtBanner from './banner.vue';

import BannerDefault from './banner_default.story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { argsData, argTypesData } from '../notice/notice.stories.js';

import backgroundImage from '../../docs/assets/dialpad-gradient.png';

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
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.Data$/,
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, BannerDefault);

export const Default = {
  render: Template,

  args: {
    title: 'Optional title',
    action: 'Action',
    kind: 'base',
  },
};

export const Error = {
  render: Template,
  args: { ...Default.args, kind: 'error' },
};

export const Info = {
  render: Template,
  args: { ...Default.args, kind: 'info' },
};

export const Success = {
  render: Template,
  args: { ...Default.args, kind: 'success' },
};

export const Warning = {
  render: Template,
  args: { ...Default.args, kind: 'warning' },
};

export const Pinned = {
  render: Template,
  args: { ...Default.args, pinned: true },
};

export const CustomBackground = {
  render: Template,

  args: {
    ...Default.args,
    backgroundImage,
    backgroundSize: 'contain',
    title: '',
    action: '',
    hideIcon: true,
    dialogClass: 'd-fc-neutral-white',
    default: 'The power of Dialpad. On your desktop',
  },
};
