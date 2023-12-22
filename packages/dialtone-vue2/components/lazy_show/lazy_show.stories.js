import { DtLazyShow } from './';
import LazyShowDefault from './lazy_show_default.story.vue';
import { createRenderConfig } from '@/common/storybook_utils';

const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  transition: {
    options: ['', 'fade', 'slide-down', 'pop', 'shake'],
    control: {
      type: 'select',
    },
  },
};

export default {
  title: 'Utilities/Lazy Show',
  component: DtLazyShow,
  argTypes: argTypesData,
  excludeStories: /.Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(DtLazyShow, LazyShowDefault, argsData),
  args: {},
};
