import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtSplitButton from './split_button.vue';
import DtSplitButtonDefaultTemplate from './split_button_default.story.vue';
import DtSplitButtonVariantsTemplate from './split_button_variants.story.vue';
import {
  BUTTON_SIZE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_IMPORTANCE_MODIFIERS,
  ICON_POSITION_MODIFIERS,
} from '@/components/button';
import { POPOVER_DIRECTIONS } from '../popover/popover_constants';

const iconsList = getIconNames();

// Set default values at the story level here.
export const argsData = {
  onAlphaClicked: action('alpha-clicked'),
  onOmegaClicked: action('omega-clicked'),
  omegaAriaLabel: 'Open dropdown',
  default: 'Place call',
  dropdownPlacement: 'bottom-end',
  omegaTooltipText: 'More calling options',
  alphaIcon: undefined,
  omegaIcon: undefined,
};

export const argTypesData = {
  // Slots
  alphaIcon: {
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

  dropdownList: {
    table: {
      type: { summary: 'VNode' },
    },
  },

  omega: {
    table: {
      type: { summary: 'VNode' },
    },
  },

  omegaIcon: {
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

  default: {
    table: {
      type: { summary: 'VNode' },
    },
  },

  // Props
  assertiveOnFocus: {
    control: 'boolean',
  },

  disabled: {
    control: 'boolean',
  },

  importance: {
    control: 'select',
    options: Object.keys(BUTTON_IMPORTANCE_MODIFIERS),
  },

  kind: {
    control: 'select',
    options: Object.keys(BUTTON_KIND_MODIFIERS),
  },

  size: {
    control: 'select',
    options: Object.keys(BUTTON_SIZE_MODIFIERS),
  },

  alphaActive: {
    control: 'boolean',
  },

  alphaIconPosition: {
    control: 'select',
    options: Object.keys(ICON_POSITION_MODIFIERS),
  },

  alphaLoading: {
    control: 'boolean',
  },

  omegaActive: {
    control: 'boolean',
  },

  dropdownPlacement: {
    options: POPOVER_DIRECTIONS,
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: 'bottom',
      },
    },
  },

  // Action Event Handlers
  onAlphaClicked: {
    table: {
      disable: true,
    },
  },

  onOmegaClicked: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Components/Split Button',
  component: DtSplitButton,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtSplitButtonDefaultTemplate,
);

const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtSplitButtonVariantsTemplate,
);

export const Default = {
  render: DefaultTemplate,

  decorators: [
    () => ({
      template: `<div class="d-d-flex d-jc-center d-ai-center d-h164"><story /></div>`,
    }),
  ],
};

export const Variants = {
  render: VariantsTemplate,

  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
