import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeIvrNode from './ivr_node';
import DtRecipeIvrNodeMdx from './ivr_node.mdx';
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
    control: {
      type: 'select',
      options: Object.keys(IVR_NODE_ICON_TYPES),
    },
  },
  isSelected: {
    defaultValue: false,
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
  parameters: {
    docs: {
      page: DtRecipeIvrNodeMdx,
    },
    controls: {
      sort: 'requiredFirst',
    },
    options: { showPanel: true },
  },
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeIvrNodeDefaultTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  nodeType: 'hangup',
};

Default.parameters = {
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
};

export const PromptMenu = DefaultTemplate.bind({});
PromptMenu.args = {
  nodeType: 'promptmenu',
};

export const PromptCollect = DefaultTemplate.bind({});
PromptCollect.args = {
  nodeType: 'promptcollect',
};

export const PromptPlay = DefaultTemplate.bind({});
PromptPlay.args = {
  nodeType: 'promptplay',
};

export const Expert = DefaultTemplate.bind({});
Expert.args = {
  nodeType: 'gotoexpert',
};

export const GoTo = DefaultTemplate.bind({});
GoTo.args = {
  nodeType: 'goto',
};

export const Branch = DefaultTemplate.bind({});
Branch.args = {
  nodeType: 'branch',
};

export const Transfer = DefaultTemplate.bind({});
Transfer.args = {
  nodeType: 'transfer',
};

export const Hangup = DefaultTemplate.bind({});
Hangup.args = {
  nodeType: 'hangup',
};

export const SelectedNode = DefaultTemplate.bind({});
SelectedNode.args = {
  nodeType: 'promptmenu',
  isSelected: true,
};

export const NodeWithDtmf = DefaultTemplate.bind({});
NodeWithDtmf.args = {
  nodeType: 'transfer',
  dtmfKey: '1',
};

export const NodeWithTopConnector = DefaultTemplate.bind({});
NodeWithTopConnector.args = {
  nodeType: 'branch',
  connector: 'text',
};
