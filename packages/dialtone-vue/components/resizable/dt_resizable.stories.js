import { action } from 'storybook/actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { DtResizable } from './';

import ResizableDefaultStory from './resizable_default.story.vue';
import ResizableThreePanelStory from './resizable_three_panel.story.vue';
import ResizableCustomSizesStory from './resizable_custom_sizes.story.vue';
import ResizableConstraintsStory from './resizable_constraints.story.vue';
import ResizableCollapsibleStory from './resizable_collapsible.story.vue';
import ResizableProgrammaticStory from './resizable_programmatic.story.vue';
import ResizablePersistenceStory from './resizable_persistence.story.vue';
import ResizableCustomAdapterStory from './resizable_custom_adapter.story.vue';
import ResizableKeyboardStory from './resizable_keyboard.story.vue';
import ResizablePeekHoverStory from './resizable_peek_hover.story.vue';
import ResizablePeekButtonStory from './resizable_peek_button.story.vue';
import ResizableOffsetStory from './resizable_offset.story.vue';

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

const ConstraintsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizableConstraintsStory);

const CollapsibleTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizableCollapsibleStory);

const ProgrammaticTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizableProgrammaticStory);

const PersistenceTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizablePersistenceStory);

const CustomAdapterTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizableCustomAdapterStory);

const KeyboardTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizableKeyboardStory);

const PeekHoverTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizablePeekHoverStory);

const PeekButtonTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizablePeekButtonStory);

const OffsetTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, ResizableOffsetStory);

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
<dt-resizable direction="row">
  <dt-resizable-panel id="sidebar" initial-size="30p" user-min-size="20p" user-max-size="50p">
    Sidebar (min 20%, max 50%)
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="content" user-min-size="30p">
    Content (min 30%)
  </dt-resizable-panel>
</dt-resizable>`,
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
<dt-resizable ref="group" direction="row">
  <dt-resizable-panel id="sidebar" initial-size="25p" user-min-size="20p" collapsible :collapsed="isCollapsed">
    Collapsible Sidebar
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="content">Content</dt-resizable-panel>
</dt-resizable>`,
      },
    },
  },
};

export const Programmatic = {
  render: ProgrammaticTemplate,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Programmatic control via component ref. Demonstrates resizePanel, collapsePanel, lockPanel, unlockPanel, and resetPanels.',
      },
      source: {
        code: `
<dt-resizable ref="group" direction="row">
  <dt-resizable-panel id="sidebar" initial-size="25p" user-min-size="10p" collapsible>
    Sidebar
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="content">Content</dt-resizable-panel>
</dt-resizable>

// Programmatic control via ref:
this.$refs.group.collapsePanel('sidebar', true);
this.$refs.group.lockPanel('content');
this.$refs.group.resetPanels();`,
      },
    },
  },
};

export const Persistence = {
  render: PersistenceTemplate,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Panel sizes persist to localStorage via the storageKey prop. Resize panels, then refresh the page to see sizes restored.',
      },
      source: {
        code: `
<dt-resizable direction="row" storage-key="my-layout">
  <dt-resizable-panel id="sidebar" initial-size="25p" user-min-size="15p" user-max-size="40p">
    Sidebar
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="content">Content</dt-resizable-panel>
</dt-resizable>`,
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

<dt-resizable direction="row" :storage="myAdapter">
  ...
</dt-resizable>`,
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
        story: 'Keyboard navigation demo. Use Ctrl/Cmd+E to enter edit mode, arrow keys to resize, and Escape to exit.',
      },
      source: {
        code: `
<dt-resizable>
  <dt-resizable-panel id="left" initial-size="50p">
    Left Panel
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="right" initial-size="50p">
    Right Panel
  </dt-resizable-panel>
</dt-resizable>

<!-- Keyboard Controls:
  Ctrl/Cmd + E — Toggle edit mode
  Arrow keys — Resize (8px)
  Shift + Arrow — Large resize (24px)
  Ctrl/Cmd + Arrow — Fine resize (1px)
  R — Reset current handle
  Escape — Exit edit mode -->`,
      },
    },
  },
};

export const PeekHover = {
  render: PeekHoverTemplate,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Collapsed panel with hover-triggered peek. Hover over the collapsed sidebar to temporarily reveal it.',
      },
      source: {
        code: `
<dt-resizable>
  <dt-resizable-panel
    id="sidebar"
    initial-size="925"
    collapsible
    :collapsed="true"
    peek-enabled
    peek-trigger="hover"
    peek-when-manual
  >
    Sidebar (hover to peek)
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="main" initial-size="50p">
    Main Content
  </dt-resizable-panel>
</dt-resizable>`,
      },
    },
  },
};

export const PeekButton = {
  render: PeekButtonTemplate,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Collapsed panel with button-triggered peek. Uses the #peek-trigger slot to render a custom toggle button.',
      },
      source: {
        code: `
<dt-resizable>
  <dt-resizable-panel
    id="sidebar"
    initial-size="925"
    collapsible
    :collapsed="true"
    peek-enabled
    peek-trigger="button"
    peek-when-manual
  >
    <template #peek-trigger="{ togglePeek, isPeeking }">
      <button @click="togglePeek">
        {{ isPeeking ? 'Hide' : 'Peek' }}
      </button>
    </template>
    Sidebar (click button to peek)
  </dt-resizable-panel>
  <dt-resizable-handle />
  <dt-resizable-panel id="main" initial-size="50p">
    Main Content
  </dt-resizable-panel>
</dt-resizable>`,
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
  <dt-resizable>
    <dt-resizable-panel id="left" initial-size="50p">
      Left Panel
    </dt-resizable-panel>
    <dt-resizable-handle offset-element="#toolbar" :offset-amount="8" />
    <dt-resizable-panel id="right" initial-size="50p">
      Right Panel
    </dt-resizable-panel>
  </dt-resizable>
</div>`,
      },
    },
  },
};
