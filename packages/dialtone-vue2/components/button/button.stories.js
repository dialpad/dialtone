import { action } from '@storybook/addon-actions';
import DtButton from './button.vue';
import {
  BUTTON_SIZE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_TYPES,
  ICON_POSITION_MODIFIERS,
} from './button_constants';
import { LINK_KIND_MODIFIERS } from '../link/link_constants';

import ButtonDefault from './button_default.story.vue';
import ButtonVariants from './button_variants.story.vue';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';

export const argsData = {
  onClick: action('click'),
  onFocusIn: action('focusin'),
  onFocusOut: action('focusout'),
  size: 'md',
  link: false,
};

const iconsList = getIconNames();

export const argTypesData = {
  // Slots
  default: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  icon: {
    options: iconsList,
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },

  // Props
  active: {
    control: 'boolean',
  },
  assertiveOnFocus: {
    control: 'boolean',
  },
  circle: {
    control: 'boolean',
  },
  importance: {
    options: Object.keys(BUTTON_IMPORTANCE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  size: {
    options: Object.keys(BUTTON_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  kind: {
    options: Object.keys(BUTTON_KIND_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  link: {
    type: {
      summary: 'boolean',
    },
    table: {
      defaultValue: {
        summary: 'false',
      },
    },
    control: 'boolean',
  },
  linkKind: {
    options: Object.keys(LINK_KIND_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  loading: {
    control: 'boolean',
  },
  iconPosition: {
    options: Object.keys(ICON_POSITION_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  labelClass: {
    description: 'Pass through classes. Used to customize the label container',
  },

  // HTML attributes
  disabled: {
    table: {
      category: 'html attributes',
      defaultValue: {
        summary: false,
      },
    },
    control: 'boolean',
  },
  type: {
    table: {
      category: 'html attributes',
      defaultValue: {
        summary: 'button',
      },
    },
    control: 'select',
    options: BUTTON_TYPES,
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
    description: 'Native button click event',
    table: {
      type: { summary: 'event' },
    },
  },
  focusin: {
    description: 'Native button focusin event',
    table: {
      type: { summary: 'event' },
    },
  },
  focusout: {
    description: 'Native button focusout event',
    table: {
      type: { summary: 'event' },
    },
  },
};

export default {
  title: 'Components/Button',
  component: DtButton,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, ButtonDefault);

export const Default = {
  render: Template,

  args: {
    default: 'Button',
  },
};

const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ButtonVariants);

export const Variants = {
  render: VariantsTemplate,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};
