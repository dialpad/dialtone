import { createTemplateFromVueFile } from '@/common/storybook_utils';
import {
  DtCollapsible,
} from './';
import CollapsibleMdx from './collapsible.mdx';
import DtCollapsibleDefaultStory from './collapsible_default.story.vue';
import DtCollapsibleVariantsStory from './collapsible_variants.story.vue';

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
  contentOnCollapsed: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  contentOnExpanded: {
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
    defaultValue: 'Click me to toggle Content',
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

  // Action Event Handlers
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
  excludeStories: /.Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: CollapsibleMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtCollapsibleDefaultStory,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  maxWidth: '512px',
};

const VariantTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtCollapsibleVariantsStory,
);

export const Variants = VariantTemplate.bind({});
