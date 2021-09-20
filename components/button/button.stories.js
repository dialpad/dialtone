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
import { createTemplateFromVueFile, getIconNames } from '../storybook_utils';

export const argTypesData = {
  // Props
  disabled: {
    description: 'native "disabled" prop',
    defaultValue: false,
    type: {
      summary: 'boolean',
    },
    table: {
      category: 'native props',
      defaultValue: {
        summary: 'false',
      },
    },
    control: 'boolean',
  },
  width: {
    table: {
      category: 'native props',
      defaultValue: {
        summary: 'auto',
      },
    },
    control: {
      type: 'text',
    },
  },

  // Buttons
  importance: {
    control: {
      type: 'select',
      options: Object.keys(BUTTON_IMPORTANCE_MODIFIERS),
    },
  },
  type: {
    control: {
      type: 'select',
      options: BUTTON_TYPES,
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

  // Links
  link: {
    defaultValue: false,
    type: {
      summary: 'boolean',
    },
    table: {
      category: 'Link props',
      defaultValue: {
        summary: 'false',
      },
    },
    control: 'boolean',
  },
  linkKind: {
    table: {
      category: 'Link props',
    },
    control: {
      type: 'select',
      options: Object.keys(LINK_KIND_MODIFIERS),
    },
  },

  // Args related to icons.
  icon: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'select',
      options: getIconNames(),
    },
  },
  iconPosition: {
    table: {
      category: 'Icon props',
    },
    control: {
      type: 'select',
      options: Object.keys(ICON_POSITION_MODIFIERS),
    },
  },

  default: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },

  // Pass Through Class Controls
  labelClass: {
    table: {
      category: 'pass through classes',
    },
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },
  onFocusOut: {
    table: {
      disable: true,
    },
  },
  onFocusIn: {
    table: {
      disable: true,
    },
  },

  focusout: {
    table: {
      type: { summary: 'event' },
    },
  },
  focusin: {
    table: {
      type: { summary: 'event' },
    },
  },
};

export const argsData = {
  onClick: action('click'),
  onFocusOut: action('focusout'),
  onFocusIn: action('focusin'),
};

export default {
  title: 'Elements/Button',
  component: DtButton,
  parameters: {
    docs: {
      page: BaseButtonMdx,
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
Variants.parameters = { controls: { disable: true }, actions: { disable: true } };
Variants.args = {};
