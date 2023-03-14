import DtScroller from './DtScroller';
import BaseScrollerMdx from './scroller.mdx';
import ScrollerDefault from './scroller_default.story';
import ScrollerDynamic from '@/components/scroller/scroller_dynamic.story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { action } from '@storybook/addon-actions';

export const argTypesData = {
  default: {
    control: { type: null },
    description: 'Markup to display each item from the items array.\n\n' +
      'item {*}: the item currently being rendered from within your items array.\n\n' +
      'index {number}: the index of this item in the items array.\n\n' +
      'active {boolean}: whether this item is currently visible to the user.',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  items: {
    control: { type: null },
  },

  dynamic: {
    control: { type: null },
  },

  keyField: {
    control: { type: null },
  },

  direction: {
    control: {
      type: 'select',
      options: ['horizontal', 'vertical'],
    },
  },

  listTag: {
    control: { type: 'text' },
    defaultValue: 'div',
  },

  itemTag: {
    control: { type: 'text' },
    defaultValue: 'div',
  },

  itemSize: {
    control: { type: 'number' },
    defaultValue: 32,
  },

  minItemSize: {
    control: { type: null },
  },

  scrollerWidth: {
    control: { type: 'number' },
    defaultValue: 300,
  },

  scrollerHeight: {
    control: { type: 'number' },
    defaultValue: 200,
  },

  // Action Event Handlers
  onScrollStart: {
    table: {
      disable: true,
    },
  },

  onScrollEnd: {
    table: {
      disable: true,
    },
  },

  'scroll-start': {
    description: 'Emitted when the first item is rendered.',
    table: {
      type: { summary: 'event' },
    },
  },

  'scroll-end': {
    description: 'Emitted when the last item is rendered.',
    table: {
      type: { summary: 'event' },
    },
  },
};

export const argsData = {
  onScrollStart: action('scroll-start'),
  onScrollEnd: action('scroll-end'),
};

export default {
  title: 'Components/Scroller',
  component: DtScroller,
  parameters: {
    docs: {
      page: BaseScrollerMdx,
    },
    controls: {
      sort: 'requiredFirst',
    },
    options: {
      showPanel: true,
    },
  },
  argTypes: argTypesData,
  args: argsData,
  excludeStories: /.*Data$/,
};

const Template = (args) => createTemplateFromVueFile(args, ScrollerDefault);

export const Default = Template.bind({});
Default.args = {
  default: 'Scroller',
};

const DynamicTemplate = (args) => createTemplateFromVueFile(args, ScrollerDynamic);

export const Dynamic = DynamicTemplate.bind({});
Dynamic.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
Dynamic.args = {};
