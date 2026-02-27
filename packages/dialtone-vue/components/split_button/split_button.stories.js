import { action } from 'storybook/actions';
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
  onStartClicked: action('start-clicked'),
  onEndClicked: action('end-clicked'),
  endAriaLabel: 'Open dropdown',
  default: 'Place call',
  dropdownPlacement: 'bottom-end',
  endTooltipText: 'More calling options',
  startIcon: undefined,
  endIcon: undefined,
};

export const argTypesData = {
  // Slots
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

  dropdownList: {
    table: {
      type: { summary: 'VNode' },
    },
  },

  end: {
    table: {
      type: { summary: 'VNode' },
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

  default: {
    table: {
      type: { summary: 'VNode' },
    },
  },

  // Deprecated slots (hidden)
  alphaIcon: { table: { disable: true } },
  omega: { table: { disable: true } },
  omegaIcon: { table: { disable: true } },

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
    options: Object.keys(BUTTON_KIND_MODIFIERS).filter(k => k !== 'inverted'),
  },

  size: {
    control: 'select',
    options: Object.keys(BUTTON_SIZE_MODIFIERS),
  },

  startActive: {
    control: 'boolean',
  },

  startDisabled: {
    control: 'boolean',
  },

  startIconPosition: {
    control: 'select',
    options: Object.keys(ICON_POSITION_MODIFIERS),
  },

  startLoading: {
    control: 'boolean',
  },

  endActive: {
    control: 'boolean',
  },

  endDisabled: {
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

  // Deprecated props (hidden)
  alphaActive: { table: { disable: true } },
  alphaAriaLabel: { table: { disable: true } },
  alphaDisabled: { table: { disable: true } },
  alphaIconPosition: { table: { disable: true } },
  alphaLabelClass: { table: { disable: true } },
  alphaLoading: { table: { disable: true } },
  alphaTooltipText: { table: { disable: true } },
  omegaActive: { table: { disable: true } },
  omegaAriaLabel: { table: { disable: true } },
  omegaDisabled: { table: { disable: true } },
  omegaId: { table: { disable: true } },
  omegaTooltipText: { table: { disable: true } },

  // Action Event Handlers
  onStartClicked: {
    table: {
      disable: true,
    },
  },

  onEndClicked: {
    table: {
      disable: true,
    },
  },

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
      template: `<dt-stack direction="row" justify="center" align="center" class="d-h164"><story /></dt-stack>`,
    }),
  ],
};

export const Variants = {
  render: VariantsTemplate,

  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
