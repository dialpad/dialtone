import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeIvrNode from './ivr_node.vue';

import DtRecipeIvrNodeDefaultTemplate from './ivr_node_default.story.vue';
import { IVR_NODE_ICON_TYPES } from './ivr_node_constants';

// Default Prop Values
export const argsData = {
  onClick: action('click'),
  menuButtonAriaLabel: 'Node menu',
  isSelected: false,
};

export const argTypesData = {
  // Slots
  content: {
    description: 'Slot for card content',
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  menuItems: {
    description: 'Slot for node header menu items',
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  connector: {
    description: 'Slot for top connector',
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  nodeLabel: {
    control: {
      type: 'text',
    },
  },
  dtmfKey: {
    control: {
      type: 'text',
    },
  },
  nodeType: {
    options: Object.keys(IVR_NODE_ICON_TYPES),
    control: {
      type: 'select',
    },
  },
  isSelected: {
    control: {
      type: 'boolean',
    },
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },

  click: {
    description: 'IVR node click event',
    table: {
      type: { summary: 'event' },
    },
  },
};

// Story Collection
export default {
  title: 'Recipes/Cards/Ivr Node',
  component: DtRecipeIvrNode,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtRecipeIvrNodeDefaultTemplate);

export const Default = {
  render: DefaultTemplate,

  args: {
    nodeType: 'hangup',
  },

  parameters: {
    docs: {
      source: {
        code: `
  <dt-recipe-ivr-node
    :node-label="Hangup"
    :node-type="hangup"
    :drop-down-menu-items="items"
    :is-selected="false"
    :menu-button-label="'Node menu'"
  >
    <p class="d-fs14 d-fw-bold">Hangup</p>
    <p class="d-fs14">Description</p>
  </dt-recipe-ivr-node>
     `,
      },
    },
  },
};

export const PromptMenu = {
  render: DefaultTemplate,

  args: {
    nodeType: 'promptmenu',
  },
};

export const PromptCollect = {
  render: DefaultTemplate,

  args: {
    nodeType: 'promptcollect',
  },
};

export const PromptPlay = {
  render: DefaultTemplate,

  args: {
    nodeType: 'promptplay',
  },
};

export const Expert = {
  render: DefaultTemplate,

  args: {
    nodeType: 'gotoexpert',
  },
};

export const GoTo = {
  render: DefaultTemplate,

  args: {
    nodeType: 'goto',
  },
};

export const Branch = {
  render: DefaultTemplate,

  args: {
    nodeType: 'branch',
  },
};

export const Transfer = {
  render: DefaultTemplate,

  args: {
    nodeType: 'transfer',
  },
};

export const Hangup = {
  render: DefaultTemplate,

  args: {
    nodeType: 'hangup',
  },
};

export const SelectedNode = {
  render: DefaultTemplate,

  args: {
    nodeType: 'promptmenu',
    isSelected: true,
  },
};

export const NodeWithDtmf = {
  render: DefaultTemplate,

  args: {
    nodeType: 'transfer',
    dtmfKey: '1',
  },
};

export const NodeWithTopConnector = {
  render: DefaultTemplate,

  args: {
    nodeType: 'branch',
    connector: 'text',
  },
};
