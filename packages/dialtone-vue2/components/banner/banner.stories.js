import { action } from '@storybook/addon-actions';
import DtBanner from './banner.vue';
import { NOTICE_KINDS } from '@/components/notice/index.js';
import BannerDefault from './banner_default.story.vue';
import backgroundImage from '@/common/assets/dialpad-gradient.png';
import { createRenderConfig, getIconNames } from '@/common/storybook_utils';

const iconsList = getIconNames();

export const argsData = {
  onClose: action('close'),
  onClick: action('click'),
  show: undefined,
  backgroundImage: null,
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
  show: {
    table: {
      disable: true,
    },
  },
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
  hideClose: {
    control: {
      type: 'boolean',
    },
  },
  hideIcon: {
    control: {
      type: 'boolean',
    },
  },
  hideAction: {
    control: {
      type: 'boolean',
    },
  },
  important: {
    control: {
      type: 'boolean',
    },
  },
  pinned: {
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

export default {
  title: 'Components/Banner',
  component: DtBanner,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(DtBanner, BannerDefault, argsData),

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
  render: (argsData) => createRenderConfig(DtBanner, BannerDefault, argsData),
  args: { ...Default.args, kind: 'error' },
  parameters: Default.parameters,
};

export const Info = {
  render: (argsData) => createRenderConfig(DtBanner, BannerDefault, argsData),
  args: { ...Default.args, kind: 'info' },
  parameters: Default.parameters,
};

export const Success = {
  render: (argsData) => createRenderConfig(DtBanner, BannerDefault, argsData),
  args: { ...Default.args, kind: 'success' },
  parameters: Default.parameters,
};

export const Warning = {
  render: (argsData) => createRenderConfig(DtBanner, BannerDefault, argsData),
  args: { ...Default.args, kind: 'warning' },
  parameters: Default.parameters,
};

export const Pinned = {
  render: (argsData) => createRenderConfig(DtBanner, BannerDefault, argsData),
  args: { ...Default.args, pinned: true },
  parameters: Default.parameters,
};

export const CustomBackground = {
  render: (argsData) => createRenderConfig(DtBanner, BannerDefault, argsData),

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
  parameters: Default.parameters,
};
