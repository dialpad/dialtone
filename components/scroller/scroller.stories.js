import DtScroller from './DtScroller.vue';
import ScrollerDefault from './scroller_default.story.vue';
import ScrollerDynamic from '@/components/scroller/scroller_dynamic.story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { action } from '@storybook/addon-actions';

// Default Prop Values
export const argsData = {
  listTag: 'div',
  itemTag: 'div',
  itemSize: 32,
  scrollerWidth: 300,
  scrollerHeight: 200,
  onScrollStart: action('scroll-start'),
  onScrollEnd: action('scroll-end'),
};

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

export default {
  title: 'Components/Scroller',
  component: DtScroller,
  argTypes: argTypesData,
  args: argsData,
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args) => createTemplateFromVueFile(args, ScrollerDefault);

export const Default = {
  render: DefaultTemplate,
  args: {
    default: 'Scroller',
  },
};

const DynamicTemplate = (args) => createTemplateFromVueFile(args, ScrollerDynamic);

export const Dynamic = {
  render: DynamicTemplate,
  parameters: { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } },
};
