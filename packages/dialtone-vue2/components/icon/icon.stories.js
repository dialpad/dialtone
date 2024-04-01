import DtIcon from './icon.vue';
import { ICON_SIZE_MODIFIERS } from './icon_constants';

import DtIconDefaultTemplate from './icon_default.story.vue';
import DtIconVariantsTemplate from './icon_variants.story.vue';
import { createRenderConfig, getIconNames } from '@/common/storybook_utils';
const iconsList = getIconNames();
export const argTypesData = {
  size: {
    options: Object.keys(ICON_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  name: {
    options: iconsList,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  showSkeleton: {
    control: {
      type: 'boolean',
    },
  },
};

export const argsData = {};

export default {
  title: 'Components/Icon',
  component: DtIcon,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(DtIcon, DtIconDefaultTemplate, argsData),

  args: {
    name: 'accessibility',
  },
  parameters: {
    percy: {
      args: {
        showSkeleton: false,
      },
    },
  },
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtIcon, DtIconVariantsTemplate, argsData),
  args: { limit: undefined },
  parameters: {
    percy: {
      args: {
        limit: 10,
        showSkeleton: false,
      },
    },
    options: { showPanel: false },
    controls: { disable: true },
  },
};
