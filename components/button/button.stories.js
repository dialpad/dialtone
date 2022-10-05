import { action } from '@storybook/addon-actions';
import DtButton from './button';
import {
  BUTTON_SIZE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_TYPES,
  ICON_POSITION_MODIFIERS,
} from './button_constants';
import { LINK_KIND_MODIFIERS } from '../link/link_constants';
import BaseButtonMdx from './button.mdx';
import ButtonDefault from './button_default.story.vue';
import ButtonVariants from './button_variants.story.vue';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';

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
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'select',
      options: getIconNames(),
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
    control: {
      type: 'select',
      options: Object.keys(BUTTON_IMPORTANCE_MODIFIERS),
    },
  },
  size: {
    control: {
      type: 'select',
      options: Object.keys(BUTTON_SIZE_MODIFIERS),
    },
  },
  kind: {
    control: {
      type: 'select',
      options: Object.keys(BUTTON_KIND_MODIFIERS),
    },
  },
  link: {
    defaultValue: false,
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
    control: {
      type: 'select',
      options: Object.keys(LINK_KIND_MODIFIERS),
    },
  },
  loading: {
    control: 'boolean',
  },
  iconPosition: {
    control: {
      type: 'select',
      options: Object.keys(ICON_POSITION_MODIFIERS),
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

export const argsData = {
  onClick: action('click'),
  onFocusIn: action('focusin'),
  onFocusOut: action('focusout'),
};

export default {
  title: 'Components/Button',
  component: DtButton,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: BaseButtonMdx,
    },
    options: {
      showPanel: true,
    },
  },
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, ButtonDefault);

export const Default = Template.bind({});
Default.args = {
  default: 'Button',
};

const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, ButtonVariants);

export const Variants = VariantsTemplate.bind({});
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
Variants.args = {};
