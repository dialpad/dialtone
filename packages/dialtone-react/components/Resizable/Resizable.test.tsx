/**
 * DtResizable component tests
 *
 * Tests rendering, context wiring, and basic drag interaction.
 */

import { act, render, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { DtResizable, type DtResizableInstance, type DtResizableProps, type DtResizableSlotScope } from './Resizable';
import { DtResizablePanel, type DtResizablePanelProps } from './ResizablePanel';
import { DtResizableHandle } from './ResizableHandle';
import { RESIZABLE_HANDLE_CENTER_OFFSET_PX, useResizableContext } from './ResizableConstants';
import { isValidSizing, parseSizeToPixels } from './ResizableUtils';
import { DT_BOX_LAYOUT_VALUES } from '../Box/BoxConstants';

// dialtone-vue's LAYOUT_VALUES (common/constants/layout.js), which DtBox's value list mirrors, and its size half.
const LAYOUT_VALUES: readonly string[] = DT_BOX_LAYOUT_VALUES;
const LAYOUT_SIZE_VALUES = LAYOUT_VALUES.filter(value => !value.endsWith('p'));

const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

function mockClientWidth (width: number) {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get () { return width; },
  });
}

function restoreClientWidth () {
  if (originalClientWidth) {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
  }
}

// ─── Test child component that reads the context ────────────────────────────
function InjectionReader () {
  const ctx = useResizableContext();
  const direction = ctx?.direction ?? 'none';
  const panels = ctx?.panels ?? [];
  const isResizing = ctx?.isResizing ?? false;

  return (
    <div
      data-qa="injection-reader"
      data-direction={direction}
      data-panels={JSON.stringify(panels)}
      data-is-resizing={String(isResizing)}
    />
  );
}

function PanelSizeValidationLayout ({ panelProps = {} }: { panelProps?: Partial<DtResizablePanelProps> }) {
  return (
    <div style={{ width: '1000px', height: '400px' }}>
      <DtResizable>
        <DtResizablePanel id="left" {...panelProps} />
        <DtResizableHandle />
        <DtResizablePanel id="right" initialSize="50p" />
      </DtResizable>
    </div>
  );
}

let wrapper: RenderResult | undefined;

const CONTAINER_WIDTH = 1000;
const PANEL_BOUNDARY = CONTAINER_WIDTH / 2;
const LAYOUT_BASE_PX = 64;
const REPRESENTATIVE_LAYOUT_VALUES = LAYOUT_SIZE_VALUES.filter(value => ['350', '650', '750'].includes(value));
const RESIZABLE_SIZE_PROPS = ['initialSize', 'userMinSize', 'userMaxSize', 'systemMinSize', 'systemMaxSize', 'collapseSize'];
const EXPANDED_LAYOUT_TOKEN_VALUES = LAYOUT_SIZE_VALUES.filter((value) => {
  const token = Number(value);
  // Intermediate stops between 100-multiple base stops, such as 125, 350, and 1550.
  return Number.isInteger(token) && token > 100 && token % 100 !== 0;
});
const REPRESENTATIVE_LAYOUT_TOKEN_PIXEL_CASES = REPRESENTATIVE_LAYOUT_VALUES.map(value => [
  value,
  (Number(value) * LAYOUT_BASE_PX) / 100,
] as const);
const PRESERVED_SIZE_VALUES = [
  ...LAYOUT_SIZE_VALUES.filter(value => ['0', '1px', '2px', '8px', '20px', '24px'].includes(value)),
  ...LAYOUT_VALUES.filter(value => value === '50p'),
];
const INVALID_SIZE_VALUES = ['72', '225', '9999', '101p'];

const _setWrapper = (props: Partial<DtResizableProps> = {}, children?: DtResizableProps['children']) => {
  wrapper = render(<DtResizable {...props}>{children}</DtResizable>);
};

const root = () => wrapper!.container.querySelector('.d-resizable');

describe('DtResizable Tests', () => {
  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    restoreClientWidth();
    vi.restoreAllMocks();
  });

  describe('Presentation', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should render the component', () => {
      expect(wrapper!.container.firstElementChild).toBeInTheDocument();
    });

    it('should render with d-resizable class', () => {
      expect(root()).toBeInTheDocument();
    });

    it('should apply row direction class by default', () => {
      expect(root()).toHaveClass('d-resizable--row');
    });
  });

  describe('When direction is column', () => {
    beforeEach(() => {
      _setWrapper({ direction: 'column' });
    });

    it('should apply column direction class', () => {
      expect(root()).toHaveClass('d-resizable--column');
    });

    it('should not apply row direction class', () => {
      expect(root()).not.toHaveClass('d-resizable--row');
    });
  });

  describe('When storageKey is provided', () => {
    beforeEach(() => {
      _setWrapper({ storageKey: 'test-layout' });
    });

    it('should set data-storage-key attribute', () => {
      expect(root()).toHaveAttribute('data-storage-key', 'test-layout');
    });
  });

  describe('When custom class is provided', () => {
    beforeEach(() => {
      _setWrapper({ className: 'custom-layout' });
    });

    it('should apply custom class alongside component classes', () => {
      expect(root()).toHaveClass('custom-layout');
      expect(root()).toHaveClass('d-resizable--row');
    });
  });

  describe('Provide/inject wiring', () => {
    it('should provide direction to child components', () => {
      _setWrapper({ direction: 'column' }, <InjectionReader />);

      expect(screen.getByTestId('injection-reader')).toHaveAttribute('data-direction', 'column');
    });
  });

  describe('Scoped slot props', () => {
    it('should expose panels array in scoped slot', () => {
      let slotProps: DtResizableSlotScope | undefined;
      _setWrapper({}, (props) => {
        slotProps = props;
        return <div />;
      });

      expect(slotProps).toBeDefined();
      expect(Array.isArray(slotProps!.panels)).toBe(true);
      expect(slotProps!.direction).toBe('row');
      expect(slotProps!.isResizing).toBe(false);
      expect(typeof slotProps!.resizePanel).toBe('function');
      expect(typeof slotProps!.collapsePanel).toBe('function');
      expect(typeof slotProps!.startResize).toBe('function');
      expect(typeof slotProps!.stopResize).toBe('function');
    });
  });

  describe('Exposed methods', () => {
    const ref = createRef<DtResizableInstance>();

    beforeEach(() => {
      _setWrapper({ ref });
    });

    it('should expose resizePanel method', () => {
      expect(typeof ref.current!.resizePanel).toBe('function');
    });

    it('should expose collapsePanel method', () => {
      expect(typeof ref.current!.collapsePanel).toBe('function');
    });

    it('should expose resetPanels method', () => {
      expect(typeof ref.current!.resetPanels).toBe('function');
    });

    it('should expose readonly state', () => {
      expect(ref.current!.state).toBeDefined();
      expect(ref.current!.state.direction).toBe('row');
    });
  });

  describe('Sizing validation', () => {
    it.each(EXPANDED_LAYOUT_TOKEN_VALUES)('should accept expanded layout token %s', (value) => {
      expect(isValidSizing(value)).toBe(true);
    });

    it.each(EXPANDED_LAYOUT_TOKEN_VALUES)('should not warn when validating expanded layout token %s', (value) => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      isValidSizing(value);

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it.each(REPRESENTATIVE_LAYOUT_TOKEN_PIXEL_CASES)('should resolve layout token %s to %ipx', (value, expectedPixels) => {
      expect(parseSizeToPixels(value, 2000)).toBe(expectedPixels);
    });

    it.each(PRESERVED_SIZE_VALUES)('should preserve existing valid size value %s', (value) => {
      expect(isValidSizing(value)).toBe(true);
    });

    it.each(INVALID_SIZE_VALUES)('should reject invalid size value %s', (value) => {
      expect(isValidSizing(value)).toBe(false);
    });

    it.each(INVALID_SIZE_VALUES)('should fall back to zero for invalid size value %s', (value) => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(parseSizeToPixels(value, 1000)).toBe(0);
    });

    it.each(INVALID_SIZE_VALUES)('should warn for invalid size value %s', (value) => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      parseSizeToPixels(value, 1000);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[resizable] Invalid ResizableSizeValue'));
    });

    it.each(
      RESIZABLE_SIZE_PROPS.flatMap(prop => REPRESENTATIVE_LAYOUT_VALUES.map(value => [prop, value] as const)),
    )('should not error when %s uses expanded layout token %s', (prop, value) => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockClientWidth(CONTAINER_WIDTH);

      wrapper = render(<PanelSizeValidationLayout panelProps={{ [prop]: value }} />);

      expect(errorSpy).not.toHaveBeenCalled();
    });

    it.each(
      RESIZABLE_SIZE_PROPS.flatMap(prop => REPRESENTATIVE_LAYOUT_VALUES.map(value => [prop, value] as const)),
    )('should not warn when %s uses expanded layout token %s', (prop, value) => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockClientWidth(CONTAINER_WIDTH);

      wrapper = render(<PanelSizeValidationLayout panelProps={{ [prop]: value }} />);

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should warn when a panel size prop uses an invalid value', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      wrapper = render(<PanelSizeValidationLayout panelProps={{ userMinSize: '225' }} />);

      expect(errorSpy).toHaveBeenCalledWith('[DtResizablePanel] Invalid userMinSize: "225".');
    });
  });

  describe('Event emissions', () => {
    const callbacks = {
      onPanelResize: vi.fn(),
      onPanelCollapse: vi.fn(),
      onResizeStart: vi.fn(),
      onResizeEnd: vi.fn(),
    };
    const ref = createRef<DtResizableInstance>();

    function FullLayout () {
      return (
        <div style={{ width: '1000px', height: '400px' }}>
          <DtResizable ref={ref} {...callbacks}>
            <DtResizablePanel id="left" initialSize="50p" collapsible />
            <DtResizableHandle />
            <DtResizablePanel id="right" initialSize="50p" />
          </DtResizable>
        </div>
      );
    }

    let fullWrapper: RenderResult | undefined;

    const mountFullLayout = () => {
      fullWrapper = render(<FullLayout />);
    };

    // Drags the handle from the panel boundary to `to` (jsdom's container rect starts at 0).
    const dragHandle = async (to: number) => {
      const user = userEvent.setup();
      const handle = screen.getByTestId('dt-resizable-handle');
      await user.pointer([
        { keys: '[MouseLeft>]', target: handle, coords: { clientX: PANEL_BOUNDARY, clientY: 200 } },
        { target: handle, coords: { clientX: to, clientY: 200 } },
        { keys: '[/MouseLeft]', target: handle },
      ]);
    };

    beforeEach(() => {
      Object.values(callbacks).forEach(fn => fn.mockClear());
      mountFullLayout();
    });

    afterEach(() => {
      fullWrapper?.unmount();
      const announcements = document.getElementById('d-resizable-announcements');
      if (announcements) announcements.remove();
    });

    it('should emit panel-collapse when collapsePanel is called', () => {
      act(() => ref.current!.collapsePanel('left', true));

      const events = callbacks.onPanelCollapse.mock.calls;
      expect(events.length).toBeGreaterThanOrEqual(1);
      expect(events[events.length - 1]).toEqual(['left', true]);
    });

    it('should emit panel-resize when resizePanel is called', () => {
      act(() => ref.current!.resizePanel('left', 300));

      expect(callbacks.onPanelResize.mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    // Vue's test reads the emits declaration; the port has none, so it checks that a drag calls both callbacks.
    it('should define resize-start and resize-end events', async () => {
      fullWrapper?.unmount();
      mockClientWidth(CONTAINER_WIDTH);
      mountFullLayout();

      await dragHandle(400);

      expect(callbacks.onResizeStart).toHaveBeenCalledWith('left:right');
      expect(callbacks.onResizeEnd).toHaveBeenCalledWith('left:right');
    });

    it('should define all four event types', async () => {
      fullWrapper?.unmount();
      mockClientWidth(CONTAINER_WIDTH);
      mountFullLayout();

      await dragHandle(400);
      act(() => ref.current!.resizePanel('right', 500));
      act(() => ref.current!.collapsePanel('left', true));

      expect(callbacks.onPanelResize).toHaveBeenCalledWith('right', 500);
      expect(callbacks.onPanelCollapse).toHaveBeenCalledWith('left', true);
      expect(callbacks.onResizeStart).toHaveBeenCalledWith('left:right');
      expect(callbacks.onResizeEnd).toHaveBeenCalledWith('left:right');
    });
  });

  describe('Handle positioning', () => {
    function CenteredHandleLayout () {
      return (
        <div style={{ width: '1000px', height: '400px' }}>
          <DtResizable>
            <DtResizablePanel id="left" initialSize="50p" />
            <DtResizableHandle />
            <DtResizablePanel id="right" initialSize="50p" />
          </DtResizable>
        </div>
      );
    }

    it('should center the resting handle over the panel boundary', () => {
      mockClientWidth(CONTAINER_WIDTH);

      wrapper = render(<CenteredHandleLayout />);

      const handle = screen.getByTestId('dt-resizable-handle');
      expect(handle.style.insetInlineStart).toBe(
        `${PANEL_BOUNDARY - RESIZABLE_HANDLE_CENTER_OFFSET_PX}px`,
      );
    });
  });
});
