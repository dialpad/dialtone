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

  parameters: {
    percy: {
      args: {
        show: true,
      },
    },
  },
};

export const Error = {
  render: Template,
  args: { ...Default.args, kind: 'error' },
  parameters: Default.parameters,
};

export const Info = {
  render: Template,
  args: { ...Default.args, kind: 'info' },
  parameters: Default.parameters,
};

export const Success = {
  render: Template,
  args: { ...Default.args, kind: 'success' },
  parameters: Default.parameters,
};

export const Warning = {
  render: Template,
  args: { ...Default.args, kind: 'warning' },
  parameters: Default.parameters,
};

export const Pinned = {
  render: Template,
  args: { ...Default.args, pinned: true },
  parameters: Default.parameters,
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
    dialogClass: 'd-fc-white',
    default: 'The power of Dialpad. On your desktop',
  },
  parameters: Default.parameters,
};
