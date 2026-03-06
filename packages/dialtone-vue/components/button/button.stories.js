import { action } from 'storybook/actions';
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
  startIcon: {
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
  endIcon: {
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
  blockStartIcon: {
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
  blockEndIcon: {
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
    options: Object.keys(BUTTON_KIND_MODIFIERS).filter(k => k !== 'inverted'),
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
  linkInverted: {
    table: { category: 'Deprecated' },
    description: 'Deprecated.',
  },
  loading: {
    control: 'boolean',
  },
  iconPosition: {
    control: 'select',
    options: Object.keys(ICON_POSITION_MODIFIERS),
    table: { category: 'Deprecated' },
    description: 'Use `startIcon`/`endIcon`/`blockStartIcon`/`blockEndIcon` slots instead.',
  },
  labelClass: {
    description: 'Pass through classes. Used to customize the label container',
  },
  to: {
    control: 'text',
  },
  href: {
    control: 'text',
  },
  target: {
    control: 'select',
    options: ['_self', '_blank', '_parent', '_top'],
  },
  rel: {
    control: 'text',
  },
  replace: {
    control: 'boolean',
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

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, ButtonDefault);

export const Default = {
  render: Template,

  args: {
    default: 'Button',
  },
};

const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, ButtonVariants);

export const Variants = {
  render: VariantsTemplate,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};

export const WithStartIcon = {
  render: Template,

  args: {
    default: 'Start Icon',
    startIcon: 'send',
  },
};

export const WithEndIcon = {
  render: Template,

  args: {
    default: 'End Icon',
    endIcon: 'arrow-right',
  },
};

export const WithBothIcons = {
  render: Template,

  args: {
    default: 'Both Icons',
    startIcon: 'send',
    endIcon: 'arrow-right',
  },
};

export const WithBlockStartIcon = {
  render: Template,

  args: {
    default: 'Block Start Icon',
    blockStartIcon: 'phone',
  },
};

export const WithBlockEndIcon = {
  render: Template,

  args: {
    default: 'Block End Icon',
    blockEndIcon: 'phone',
  },
};
