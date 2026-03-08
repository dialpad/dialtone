import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { action } from 'storybook/actions';
import DtLink from './link.vue';

import DtLinkDefaultTemplate from './link_default.story.vue';
import DtLinkVariantsTemplate from './link_variants.story.vue';
import { LINK_VARIANTS } from './link_constants';

// Default Prop Values
export const argsData = {
  default: 'Default link',
  href: '#',
  to: null,
  replace: false,
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
  inverted: {
    table: { disable: true },
  },
  href: {
    description: 'URL for anchor link navigation. Renders as a native <a> element.',
    type: {
      summary: 'string',
    },
    control: 'text',
  },
  to: {
    description: 'Vue Router destination. Renders as a <router-link>. Takes precedence over href.',
    type: {
      summary: 'string | object',
    },
    control: 'text',
  },
  replace: {
    description: 'When true, navigation replaces the current history entry. Only applies when `to` is provided.',
    control: 'boolean',
  },

  // HTML attributes
  target: {
    description: 'HTML a target attribute. Where to display the linked URL.',
    type: {
      summary: 'string',
    },
    table: {
      category: 'html attributes',
    },
    control: 'select',
    options: ['_self', '_blank', '_parent', '_top'],
  },
  rel: {
    description: `HTML a rel attribute. Relationship between the location in the document containing the hyperlink and the destination resource.`,
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
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtLinkDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtLinkVariantsTemplate);

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
