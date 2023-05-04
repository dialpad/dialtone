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
    control: 'select',
    options: Object.keys(BUTTON_IMPORTANCE_MODIFIERS),
  },
  size: {
    control: 'select',
    options: Object.keys(BUTTON_SIZE_MODIFIERS),
  },
  kind: {
    control: 'select',
    options: Object.keys(BUTTON_KIND_MODIFIERS),
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
    control: 'select',
    options: Object.keys(LINK_KIND_MODIFIERS),
  },
  loading: {
    control: 'boolean',
  },
  iconPosition: {
    control: 'select',
    options: Object.keys(ICON_POSITION_MODIFIERS),
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

const Template = (args) => createTemplateFromVueFile(args, ButtonDefault);

export const Default = {
  render: Template,

  args: {
    default: 'Button',
  },
};

const VariantsTemplate = (args) => createTemplateFromVueFile(args, ButtonVariants);

export const Variants = {
  render: VariantsTemplate,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};
