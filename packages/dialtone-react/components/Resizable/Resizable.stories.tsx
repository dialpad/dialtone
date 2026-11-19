import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtResizable, type DtResizableInstance, type DtResizableProps } from './Resizable';
import { DtResizablePanel } from './ResizablePanel';
import { DtResizableHandle } from './ResizableHandle';

type ResizableStoryArgs = DtResizableProps;

export const argsData = {
  direction: 'row',
  storageKey: null,
  onPanelResize: action('panel-resize'),
  onPanelCollapse: action('panel-collapse'),
  onResizeStart: action('resize-start'),
  onResizeEnd: action('resize-end'),
} satisfies Partial<ResizableStoryArgs>;

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
  children: {
    control: false,
    table: {
      type: {
        summary: 'ReactNode | (scope) => ReactNode',
        detail: `DtResizablePanel and DtResizableHandle children.
As a function, it receives: { panels, direction, isResizing, spaceAllocationStrategy, resizePanel, collapsePanel,
startResize, stopResize }`,
      },
    },
  },

  // Action Event Handlers
  onPanelResize: {
    description: 'Called when a panel is resized, with (panelId, size).',
    table: { disable: true },
  },
  onPanelCollapse: {
    description: 'Called when a panel is collapsed or expanded, with (panelId, collapsed).',
    table: { disable: true },
  },
  onResizeStart: {
    description: 'Called when a resize drag begins, with (handleId).',
    table: { disable: true },
  },
  onResizeEnd: {
    description: 'Called when a resize drag ends, with (handleId).',
    table: { disable: true },
  },
} satisfies Meta<ResizableStoryArgs>['argTypes'];

const meta = {
  title: 'Components/Resizable',
  component: DtResizable,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<ResizableStoryArgs>;

export default meta;
type Story = StoryObj<ResizableStoryArgs>;

const FRAME = { height: '400px', border: '1px solid var(--dt-color-border-default)' };

// The panel content every Vue story repeats: a centred label on a coloured background.
function PanelContent ({ color, label }: { color: 'purple' | 'gold' | 'green'; label: string }) {
  const textColor = { purple: 'd-fc-purple-600', gold: 'd-fc-gold-500', green: 'd-fc-green-500' }[color];
  return (
    <div className={`d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-${color}-100`}>
      <span className={`d-fs-200 d-fw-bold ${textColor}`}>{label}</span>
    </div>
  );
}

// The story callbacks, as actions. Vue's templates leave them on the story's root element, where they never fire;
// here they reach DtResizable, so the actions panel shows its callbacks.
const callbacksOf = (args: ResizableStoryArgs) => ({
  onPanelResize: args.onPanelResize,
  onPanelCollapse: args.onPanelCollapse,
  onResizeStart: args.onResizeStart,
  onResizeEnd: args.onResizeEnd,
});

// ResizableDefault.story.vue
function ResizableDefault (args: ResizableStoryArgs) {
  const isColumn = args.direction === 'column';
  return (
    <div style={FRAME}>
      <DtResizable direction={args.direction} {...callbacksOf(args)}>
        <DtResizablePanel id={isColumn ? 'top' : 'left'}>
          <PanelContent color="purple" label={`${isColumn ? 'Top' : 'Left'} Panel`} />
        </DtResizablePanel>
        <DtResizableHandle />
        <DtResizablePanel id={isColumn ? 'bottom' : 'right'}>
          <PanelContent color="gold" label={`${isColumn ? 'Bottom' : 'Right'} Panel`} />
        </DtResizablePanel>
      </DtResizable>
    </div>
  );
}

// ResizableThreePanel.story.vue
function ResizableThreePanel (args: ResizableStoryArgs) {
  return (
    <div style={FRAME}>
      <DtResizable direction="row" {...callbacksOf(args)}>
        <DtResizablePanel id="sidebar" initialSize="20p">
          <PanelContent color="purple" label="Sidebar" />
        </DtResizablePanel>
        <DtResizableHandle />
        <DtResizablePanel id="content">
          <PanelContent color="gold" label="Content" />
        </DtResizablePanel>
        <DtResizableHandle />
        <DtResizablePanel id="details" initialSize="25p">
          <PanelContent color="green" label="Details" />
        </DtResizablePanel>
      </DtResizable>
    </div>
  );
}

// ResizableConstraints.story.vue
function ResizableConstraints (args: ResizableStoryArgs) {
  return (
    <div style={FRAME}>
      <DtResizable {...callbacksOf(args)}>
        <DtResizablePanel id="sidebar" initialSize="25p" userMinSize="300" userMaxSize="50p">
          <PanelContent color="purple" label="Sidebar (min 192px, max 50%)" />
        </DtResizablePanel>
        <DtResizableHandle />
        <DtResizablePanel id="content" userMinSize="30p">
          <PanelContent color="gold" label="Content (min 30%)" />
        </DtResizablePanel>
      </DtResizable>
    </div>
  );
}

// ResizableCollapsible.story.vue. Vue's template also has a <pre> of the group's panel state, from a computed that
// reads $refs: refs aren't reactive, so it stays null and the <pre> never renders. It's left out here.
function ResizableCollapsible (args: ResizableStoryArgs) {
  const group = useRef<DtResizableInstance>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const onPanelCollapse = (panelId: string, collapsed: boolean) => {
    if (panelId === 'sidebar') setSidebarCollapsed(collapsed);
    args.onPanelCollapse?.(panelId, collapsed);
  };

  const resetAll = () => {
    setSidebarCollapsed(false);
    group.current?.resetPanels();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button className="d-btn d-btn--primary d-btn--sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          {sidebarCollapsed ? 'Expand' : 'Collapse'} Sidebar
        </button>
        <button className="d-btn d-btn--danger d-btn--sm" onClick={resetAll}>
          Reset All
        </button>
      </div>
      <div style={FRAME}>
        <DtResizable ref={group} {...callbacksOf(args)} onPanelCollapse={onPanelCollapse}>
          <DtResizablePanel id="sidebar" initialSize="25p" userMinSize="300" collapsible collapsed={sidebarCollapsed}>
            <PanelContent color="purple" label="Sidebar" />
          </DtResizablePanel>
          <DtResizableHandle />
          <DtResizablePanel id="content">
            <PanelContent color="gold" label="Content" />
          </DtResizablePanel>
        </DtResizable>
      </div>
    </div>
  );
}

// ResizablePersistence.story.vue
function ResizablePersistence (args: ResizableStoryArgs) {
  const clearStorage = () => {
    localStorage.removeItem('storybook-persistence-demo');
    window.location.reload();
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button className="d-btn d-btn--primary d-btn--sm" onClick={clearStorage}>
          Clear Saved Layout
        </button>
        <span className="d-fs-100 d-fc-tertiary">
          Resize panels and refresh the page — sizes persist via localStorage.
        </span>
      </div>
      <div style={FRAME}>
        <DtResizable direction="row" storageKey="storybook-persistence-demo" {...callbacksOf(args)}>
          <DtResizablePanel id="sidebar" initialSize="25p" userMinSize="15p" userMaxSize="40p">
            <PanelContent color="purple" label="Sidebar (25% default)" />
          </DtResizablePanel>
          <DtResizableHandle />
          <DtResizablePanel id="content">
            <PanelContent color="gold" label="Content" />
          </DtResizablePanel>
        </DtResizable>
      </div>
    </div>
  );
}

// ResizableKeyboard.story.vue
function ResizableKeyboard (args: ResizableStoryArgs) {
  return (
    <div style={FRAME}>
      <DtResizable {...callbacksOf(args)}>
        <DtResizablePanel id="left" initialSize="50p">
          <PanelContent color="purple" label="Left Panel" />
        </DtResizablePanel>
        <DtResizableHandle />
        <DtResizablePanel id="right" initialSize="50p">
          <PanelContent color="gold" label="Right Panel" />
        </DtResizablePanel>
      </DtResizable>
      <div
        style={{
          marginTop: 'var(--dt-size-500)',
          padding: 'var(--dt-size-450)',
          background: 'var(--dt-color-surface-secondary)',
          borderRadius: 'var(--dt-size-radius-400)',
          fontSize: 'var(--dt-font-size-100)',
          lineHeight: 1.5,
        }}
      >
        <strong>Keyboard Controls</strong> (Tab to a handle, then use these keys)
        <ul style={{ margin: 'var(--dt-size-300) 0 0', paddingLeft: 'var(--dt-size-550)' }}>
          <li><kbd>Arrow keys</kbd> — Resize (8px)</li>
          <li><kbd>Shift + Arrow</kbd> — Large resize (24px)</li>
          <li><kbd>Ctrl/Cmd + Arrow</kbd> — Fine resize (1px)</li>
          <li><kbd>Enter</kbd> — Collapse/expand adjacent panel</li>
          <li><kbd>Home</kbd> — Set to minimum size</li>
          <li><kbd>End</kbd> — Set to maximum size</li>
          <li><kbd>R</kbd> — Reset adjacent panels</li>
          <li><kbd>Escape</kbd> — Remove focus from handle</li>
        </ul>
      </div>
    </div>
  );
}

// ResizableOffset.story.vue
function ResizableOffset (args: ResizableStoryArgs) {
  return (
    <div style={{ ...FRAME, position: 'relative' }}>
      <div
        id="demo-toolbar"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '48px',
          zIndex: 10,
          background: 'var(--dt-color-surface-secondary)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 var(--dt-size-500)',
          borderBottom: '1px solid var(--dt-color-border-default)',
          fontSize: 'var(--dt-font-size-100)',
        }}
      >
        Fixed Toolbar (48px) — handles and panel content offset below
      </div>
      <DtResizable offsetElement="#demo-toolbar" {...callbacksOf(args)}>
        <DtResizablePanel id="left" initialSize="50p">
          <PanelContent color="purple" label="Left Panel" />
        </DtResizablePanel>
        <DtResizableHandle />
        <DtResizablePanel id="right" initialSize="50p">
          <PanelContent color="gold" label="Right Panel" />
        </DtResizablePanel>
      </DtResizable>
    </div>
  );
}

const DefaultTemplate: Story['render'] = args => <ResizableDefault {...args} />;
const ThreePanelTemplate: Story['render'] = args => <ResizableThreePanel {...args} />;
const ConstraintsTemplate: Story['render'] = args => <ResizableConstraints {...args} />;
const CollapsibleTemplate: Story['render'] = args => <ResizableCollapsible {...args} />;
const PersistenceTemplate: Story['render'] = args => <ResizablePersistence {...args} />;
const KeyboardTemplate: Story['render'] = args => <ResizableKeyboard {...args} />;
const OffsetTemplate: Story['render'] = args => <ResizableOffset {...args} />;

export const Default: Story = {
  render: DefaultTemplate,
  args: {},
  parameters: {
    docs: {
      source: {
        code: `
<DtResizable>
  <DtResizablePanel id="left">
    Left Panel
  </DtResizablePanel>
  <DtResizableHandle />
  <DtResizablePanel id="right">
    Right Panel
  </DtResizablePanel>
</DtResizable>`,
      },
    },
  },
};

export const Vertical: Story = {
  render: DefaultTemplate,
  args: {
    direction: 'column',
  },
  parameters: {
    docs: {
      source: {
        code: `
<DtResizable direction="column">
  <DtResizablePanel id="top">
    Top Panel
  </DtResizablePanel>
  <DtResizableHandle />
  <DtResizablePanel id="bottom">
    Bottom Panel
  </DtResizablePanel>
</DtResizable>`,
      },
    },
  },
};

export const ThreePanel: Story = {
  render: ThreePanelTemplate,
  args: {},
  parameters: {
    docs: {
      source: {
        code: `
<DtResizable direction="row">
  <DtResizablePanel id="sidebar" initialSize="20p">
    Sidebar
  </DtResizablePanel>
  <DtResizableHandle />
  <DtResizablePanel id="content">
    Content
  </DtResizablePanel>
  <DtResizableHandle />
  <DtResizablePanel id="details" initialSize="25p">
    Details
  </DtResizablePanel>
</DtResizable>`,
      },
    },
  },
};

export const Constraints: Story = {
  render: ConstraintsTemplate,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Initial sizes with min/max constraints. Sidebar uses a Dialtone layout token (300 = 192px) for minimum '
          + 'and a percentage for maximum.',
      },
      source: {
        code: `
<DtResizable>
  <DtResizablePanel id="sidebar" initialSize="25p" userMinSize="300" userMaxSize="50p">
    Sidebar (min 192px, max 50%)
  </DtResizablePanel>
  <DtResizableHandle />
  <DtResizablePanel id="content" userMinSize="30p">
    Content (min 30%)
  </DtResizablePanel>
</DtResizable>`,
      },
    },
  },
};

export const Collapsible: Story = {
  render: CollapsibleTemplate,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Panel with collapsible prop. Use the button to toggle collapse state programmatically.',
      },
      source: {
        code: `
<DtResizable ref={group} direction="row">
  <DtResizablePanel id="sidebar" initialSize="25p" userMinSize="20p" collapsible collapsed={isCollapsed}>
    Collapsible Sidebar
  </DtResizablePanel>
  <DtResizableHandle />
  <DtResizablePanel id="content">Content</DtResizablePanel>
</DtResizable>`,
      },
    },
  },
};

export const Persistence: Story = {
  render: PersistenceTemplate,
  args: { storageKey: 'storybook-persistence-demo' },
  parameters: {
    docs: {
      description: {
        story: 'Panel sizes persist to localStorage via the storageKey prop. Resize panels, then refresh the page to see '
          + 'sizes restored.',
      },
      source: {
        code: `
<DtResizable direction="row" storageKey="my-layout">
  <DtResizablePanel id="sidebar" initialSize="25p" userMinSize="15p" userMaxSize="40p">
    Sidebar
  </DtResizablePanel>
  <DtResizableHandle />
  <DtResizablePanel id="content">Content</DtResizablePanel>
</DtResizable>`,
      },
    },
  },
};

export const Keyboard: Story = {
  render: KeyboardTemplate,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Keyboard navigation demo. Tab to a handle, then use arrow keys to resize, Enter to collapse, R to reset, '
          + 'and Escape to blur.',
      },
      source: {
        code: `
<DtResizable>
  <DtResizablePanel id="left" initialSize="50p">
    Left Panel
  </DtResizablePanel>
  <DtResizableHandle />
  <DtResizablePanel id="right" initialSize="50p">
    Right Panel
  </DtResizablePanel>
</DtResizable>

{/* Keyboard Controls (Tab to handle first):
  Arrow keys — Resize (8px)
  Shift + Arrow — Large resize (24px)
  Ctrl/Cmd + Arrow — Fine resize (1px)
  Enter — Collapse/expand adjacent panel
  Home — Set to minimum size
  End — Set to maximum size
  R — Reset adjacent panels
  Escape — Remove focus from handle */}`,
      },
    },
  },
};

export const Offset: Story = {
  render: OffsetTemplate,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Handle with offset-element prop. The handle shortens to avoid overlapping a fixed toolbar.',
      },
      source: {
        code: `
<div style={{ position: 'relative' }}>
  <div id="toolbar" style={{ height: '48px' }}>Toolbar</div>
  <DtResizable offsetElement="#toolbar" offsetAmount={8}>
    <DtResizablePanel id="left" initialSize="50p">
      Left Panel
    </DtResizablePanel>
    <DtResizableHandle />
    <DtResizablePanel id="right" initialSize="50p">
      Right Panel
    </DtResizablePanel>
  </DtResizable>
</div>`,
      },
    },
  },
};
