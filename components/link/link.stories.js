import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { action } from '@storybook/addon-actions';
import DtLink from './link';
import DtLinkMdx from './link.mdx';
import DtLinkDefaultTemplate from './link_default.story.vue';
import DtLinkVariantsTemplate from './link_variants.story.vue';
import { LINK_VARIANTS } from './link_constants';

// Default Prop Values
export const argsData = {
  default: 'Default link',
  href: '#',
  onClick: action('click'),
  onFocusIn: action('focusin'),
  onFocusOut: action('focusout'),
};

// Controls
export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  kind: {
    defaultValue: '',
    control: {
      type: 'select',
      options: LINK_VARIANTS,
    },
  },

  // HTML attributes
  href: {
    description: 'HTML a href attribute',
    defaultValue: undefined,
    type: {
      summary: 'string',
    },
    table: {
      category: 'html attributes',
    },
    control: 'text',
  },
  rel: {
    description: `HTML a rel attribute. Relationship between the location in the document containing the hyperlink
        and the destination resource.`,
    defaultValue: undefined,
    type: {
      summary: 'string',
    },
    table: {
      category: 'html attributes',
    },
    control: 'text',
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },
  onFocusIn: {
    table: {
      disable: true,
    },
  },
  onFocusOut: {
    table: {
      disable: true,
    },
  },

  click: {
    description: 'Native click event',
    table: {
      type: { summary: 'event' },
    },
  },
  focusin: {
    description: 'Native focusin event',
    table: {
      type: { summary: 'event' },
    },
  },
  focusout: {
    description: 'Native focusout event',
    table: {
      type: { summary: 'event' },
    },
  },
};

// Story Collection
export default {
  title: 'Components/Link',
  component: DtLink,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtLinkMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtLinkDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtLinkVariantsTemplate);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
