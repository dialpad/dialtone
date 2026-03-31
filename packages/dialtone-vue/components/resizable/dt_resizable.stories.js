import { action } from 'storybook/actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { DtResizable } from './';

import ResizableDefaultStory from './resizable_default.story.vue';
import ResizableThreePanelStory from './resizable_three_panel.story.vue';
import ResizableCustomSizesStory from './resizable_custom_sizes.story.vue';

export const argsData = {
  direction: 'row',
  onPanelResize: action('panel-resize'),
  onPanelCollapse: action('panel-collapse'),
  onResizeStart: action('resize-start'),
  onResizeEnd: action('resize-end'),
};

export const argTypesData = {
  // Props
  direction: {
    options: ['row', 'column'],
    control: {
      type: 'select',
    },
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'row' },
    },
  },
  storageKey: {
    control: 'text',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'null' },
    },
  },
  spaceAllocationStrategy: {
    options: ['proportional', 'preserve-manual'],
    control: {
      type: 'select',
    },
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'proportional' },
    },
  },

  // Slots
  default: {
    control: { type: null },
    table: {
      type: {
        summary: 'VNode',
        detail: `Slot for DtResizablePanel and DtResizableHandle children.
Scoped slot provides: { panels, direction, isResizing, resizePanel, collapsePanel, startResize, stopResize }`,
      },
    },
  },

  // Action Event Handlers
  onPanelResize: {
    table: { disable: true },
  },
  onPanelCollapse: {
    table: { disable: true },
  },
  onResizeStart: {
    table: { disable: true },
  },
  onResizeEnd: {
    table: { disable: true },
  },

  // Events
  'panel-resize': {
    description: 'Emitted when a panel is resized. Payload: (panelId, size)',
    table: {
      type: { summary: 'event' },
    },
  },
  'panel-collapse': {
    description: 'Emitted when a panel is collapsed or expanded. Payload: (panelId, collapsed)',
    table: {
      type: { summary: 'event' },
    },
  },
  'resize-start': {
    description: 'Emitted when a resize drag begins. Payload: (handleId)',
    table: {
      type: { summary: 'event' },
    },
  },
  'resize-end': {
    description: 'Emitted when a resize drag ends. Payload: (handleId)',
    table: {
      type: { summary: 'event' },
    },
  },
};

export default {
  title: 'Components/Resizable',
  component: DtResizable,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    layout: 'padded',
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizableDefaultStory);

const ThreePanelTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizableThreePanelStory);

const CustomSizesTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizableCustomSizesStory);

export const Default = {
  render: DefaultTemplate,
  args: {
    direction: 'row',
  },
};

export const Vertical = {
  render: DefaultTemplate,
  args: {
    direction: 'column',
  },
};

export const ThreePanel = {
  render: ThreePanelTemplate,
  args: {},
  parameters: {
    docs: {
      source: {
        code: `
<dt-resizable direction="row">
  <dt-resizable-panel id="sidebar" initial-size="20p">
    Sidebar
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="content">
    Content
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="details" initial-size="25p">
    Details
  </dt-resizable-panel>
</dt-resizable>`,
      },
    },
  },
};

export const CustomSizes = {
  render: CustomSizesTemplate,
  args: {},
  parameters: {
    docs: {
      source: {
        code: `
<dt-resizable direction="row">
  <dt-resizable-panel id="narrow" initial-size="30p">
    30% Panel
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="wide" initial-size="70p">
    70% Panel
  </dt-resizable-panel>
</dt-resizable>`,
      },
    },
  },
};
