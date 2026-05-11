import { action } from 'storybook/actions';
import { DtCollapsible } from './';
import { createTemplateFromVueFile } from '@/common/storybook_utils';

import DtCollapsibleDefaultStory from './CollapsibleDefault.story.vue';

export const argsData = {
  anchorText: 'Click me to toggle Content',
  onOpened: action('opened'),
};

const argTypesData = {
  // Slots
  anchor: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  content: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  anchorText: {
    description: 'Text on the anchor if slot is unused.',
    table: {
      type: { summary: 'string' },
    },
    control: {
      type: 'text',
    },
  },

  id: {
    table: {
      defaultValue: { summary: 'generated unique ID' },
    },
  },

  maxHeight: {
    control: { type: 'text' },
  },
  maxWidth: {
    control: { type: 'text' },
  },
  elementType: {
    control: { type: 'text' },
  },
  contentElementType: {
    control: { type: 'text' },
  },
  anchorClass: {
    description: 'Additional class name for the anchor wrapper element.',
  },
  contentClass: {
    description: 'Additional class name for the content wrapper element.',
  },
  ariaLabel: {
    control: { type: 'text' },
  },
  ariaLabelledBy: {
    control: { type: 'text' },
  },
  open: {
    control: { type: 'boolean' },
  },

  // Action Event Handlers
  onOpened: {
    table: {
      disable: true,
    },
  },

  opened: {
    description: 'Emitted whenever the content is collapsed or expanded.',
    table: {
      type: { summary: 'event' },
    },
  },
  'update:open': {
    table: {
      disable: true,
    },
  },
};

export default {
  title: 'Components/Collapsible',
  component: DtCollapsible,
  argTypes: argTypesData,
  args: argsData,
  excludeStories: /.Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtCollapsibleDefaultStory);

export const Default = {
  render: DefaultTemplate,

  args: {
    maxWidth: '512px',
  },
};
