import { action } from '@storybook/addon-actions';
import { createRenderConfig, getIconNames } from '@/common/storybook_utils';
import DtSplitButton from './split_button.vue';
import DtSplitButtonDefaultTemplate from './split_button_default.story.vue';
import DtSplitButtonVariantsTemplate from './split_button_variants.story.vue';
import {
  BUTTON_SIZE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_IMPORTANCE_MODIFIERS,
  ICON_POSITION_MODIFIERS,
} from '@/components/button';

const iconsList = getIconNames();

// Set default values at the story level here.
export const argsData = {
  onAlphaClicked: action('alpha-clicked'),
  onOmegaClicked: action('omega-clicked'),
  omegaAriaLabel: 'Open dropdown',
  default: 'Place call',
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

// Stories
export const Default = {
  render: (argsData) => createRenderConfig(DtSplitButton, DtSplitButtonDefaultTemplate, argsData),
  args: {},
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtSplitButton, DtSplitButtonVariantsTemplate, argsData),
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
