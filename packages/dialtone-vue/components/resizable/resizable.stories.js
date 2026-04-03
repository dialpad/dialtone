import { action } from 'storybook/actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { DtResizable } from './';

import ResizableDefaultStory from './resizable_default.story.vue';
import ResizableThreePanelStory from './resizable_three_panel.story.vue';
import ResizableCustomSizesStory from './resizable_custom_sizes.story.vue';
import ResizableConstraintsStory from './resizable_constraints.story.vue';
import ResizableCollapsibleStory from './resizable_collapsible.story.vue';
import ResizablePersistenceStory from './resizable_persistence.story.vue';
import ResizableCustomAdapterStory from './resizable_custom_adapter.story.vue';
import ResizableKeyboardStory from './resizable_keyboard.story.vue';
import ResizableOffsetStory from './resizable_offset.story.vue';

export const argsData = {
  direction: 'row',
  storageKey: null,
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

const ConstraintsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizableConstraintsStory);

const CollapsibleTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizableCollapsibleStory);

const PersistenceTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizablePersistenceStory);

const CustomAdapterTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizableCustomAdapterStory);

const KeyboardTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizableKeyboardStory);

const OffsetTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizableOffsetStory);

export const Default = {
  render: DefaultTemplate,
  args: {},
  parameters: {
    docs: {
      source: {
        code: `
<d-resizable>
  <d-resizable-panel id="left">
    Left Panel
  </d-resizable-panel>
  <d-resizable-handle />
  <d-resizable-panel id="right">
    Right Panel
  </d-resizable-panel>
</d-resizable>`,
      },
    },
  },
};

export const Vertical = {
  render: DefaultTemplate,
  args: {
    direction: 'column',
  },
  parameters: {
    docs: {
      source: {
        code: `
<d-resizable direction="column">
  <d-resizable-panel id="top">
    Top Panel
  </d-resizable-panel>
  <d-resizable-handle />
  <d-resizable-panel id="bottom">
    Bottom Panel
  </d-resizable-panel>
</d-resizable>`,
      },
    },
  },
};

export const ThreePanel = {
  render: ThreePanelTemplate,
  args: {},
  parameters: {
    docs: {
      source: {
        code: `
<d-resizable direction="row">
  <d-resizable-panel id="sidebar" initial-size="20p">
    Sidebar
  </d-resizable-panel>
  <d-resizable-handle />
  <d-resizable-panel id="content">
    Content
  </d-resizable-panel>
  <d-resizable-handle />
  <d-resizable-panel id="details" initial-size="25p">
    Details
  </d-resizable-panel>
</d-resizable>`,
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
<d-resizable direction="row">
  <d-resizable-panel id="narrow" initial-size="30p">
    30% Panel
  </d-resizable-panel>
  <d-resizable-handle />
  <d-resizable-panel id="wide" initial-size="70p">
    70% Panel
  </d-resizable-panel>
</d-resizable>`,
      },
    },
  },
};

export const Constraints = {
  render: ConstraintsTemplate,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Panels with userMinSize/userMaxSize constraints. The sidebar cannot be dragged below 20% or above 50%.',
      },
      source: {
        code: `
<d-resizable direction="row">
  <d-resizable-panel id="sidebar" initial-size="30p" user-min-size="20p" user-max-size="50p">
    Sidebar (min 20%, max 50%)
  </d-resizable-panel>
  <d-resizable-handle />
  <d-resizable-panel id="content" user-min-size="30p">
    Content (min 30%)
  </d-resizable-panel>
</d-resizable>`,
      },
    },
  },
};

export const Collapsible = {
  render: CollapsibleTemplate,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Panel with collapsible prop. Use the button to toggle collapse state programmatically.',
      },
      source: {
        code: `
<d-resizable ref="group" direction="row">
  <d-resizable-panel id="sidebar" initial-size="25p" user-min-size="20p" collapsible :collapsed="isCollapsed">
    Collapsible Sidebar
  </d-resizable-panel>
  <d-resizable-handle />
  <d-resizable-panel id="content">Content</d-resizable-panel>
</d-resizable>`,
      },
    },
  },
};

export const Persistence = {
  render: PersistenceTemplate,
  args: { storageKey: 'storybook-persistence-demo' },
  parameters: {
    docs: {
      description: {
        story: 'Panel sizes persist to localStorage via the storageKey prop. Resize panels, then refresh the page to see sizes restored.',
      },
      source: {
        code: `
<d-resizable direction="row" storage-key="my-layout">
  <d-resizable-panel id="sidebar" initial-size="25p" user-min-size="15p" user-max-size="40p">
    Sidebar
  </d-resizable-panel>
  <d-resizable-handle />
  <d-resizable-panel id="content">Content</d-resizable-panel>
</d-resizable>`,
      },
    },
  },
};

export const CustomAdapter = {
  render: CustomAdapterTemplate,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Custom storage adapter via the :storage prop. The adapter logs save/load operations to the console. Overrides storageKey when both are provided.',
      },
      source: {
        code: `
const myAdapter = {
  save(data) { store.commit('setLayout', data); },
  load() { return store.state.layout; },
  clear() { store.commit('clearLayout'); },
};

<d-resizable direction="row" :storage="myAdapter">
  ...
</d-resizable>`,
      },
    },
  },
};

export const Keyboard = {
  render: KeyboardTemplate,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Keyboard navigation demo. Tab to a handle, then use arrow keys to resize, Enter to collapse, R to reset, and Escape to blur.',
      },
      source: {
        code: `
<d-resizable>
  <d-resizable-panel id="left" initial-size="50p">
    Left Panel
  </d-resizable-panel>
  <d-resizable-handle />
  <d-resizable-panel id="right" initial-size="50p">
    Right Panel
  </d-resizable-panel>
</d-resizable>

<!-- Keyboard Controls (Tab to handle first):
  Arrow keys — Resize (8px)
  Shift + Arrow — Large resize (24px)
  Ctrl/Cmd + Arrow — Fine resize (1px)
  Enter — Collapse/expand adjacent panel
  Home — Set to minimum size
  End — Set to maximum size
  R — Reset adjacent panels
  Escape — Remove focus from handle -->`,
      },
    },
  },
};

export const Offset = {
  render: OffsetTemplate,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Handle with offset-element prop. The handle shortens to avoid overlapping a fixed toolbar.',
      },
      source: {
        code: `
<div style="position: relative;">
  <div id="toolbar" style="height: 48px;">Toolbar</div>
  <d-resizable>
    <d-resizable-panel id="left" initial-size="50p">
      Left Panel
    </d-resizable-panel>
    <d-resizable-handle offset-element="#toolbar" :offset-amount="8" />
    <d-resizable-panel id="right" initial-size="50p">
      Right Panel
    </d-resizable-panel>
  </d-resizable>
</div>`,
      },
    },
  },
};
