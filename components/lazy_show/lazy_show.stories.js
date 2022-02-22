import { DtLazyShow } from './';
import LazyShowDefault from './lazy_show_default.story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import LazyShowMdx from './lazy_show.mdx';

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
    control: {
      type: 'select',
      options: ['', 'fade', 'slide-down', 'pop', 'shake'],
    },
  },
};

export default {
  title: 'Utilities/Lazy Show',
  component: DtLazyShow,
  argTypes: argTypesData,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: LazyShowMdx,
    },
    options: {
      showPanel: true,
    },
  },
  excludeStories: /.Data$/,
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, LazyShowDefault);

export const Default = Template.bind({});
Default.args = {};
