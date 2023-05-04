import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { action } from '@storybook/addon-actions';
import DtLink from './link.vue';

import DtLinkDefaultTemplate from './link_default.story.vue';
import DtLinkVariantsTemplate from './link_variants.story.vue';
import { LINK_VARIANTS } from './link_constants';

// Default Prop Values
export const argsData = {
  default: 'Default link',
  href: '#',
  kind: '',
  rel: undefined,
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
    options: LINK_VARIANTS,
    control: {
      type: 'select',
    },
  },

  // HTML attributes
  href: {
    description: 'HTML a href attribute',
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
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtLinkDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtLinkVariantsTemplate);

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  args: {},

  parameters: {
    options: {
      showPanel: false,
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
    },
  },
};
