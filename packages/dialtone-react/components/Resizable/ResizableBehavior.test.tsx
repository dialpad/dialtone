/**
 * React-only tests: behaviour the Vue tests only check doesn't throw (keyboard resize, double-click reset, Escape
 * during a drag), plus the `collapsed` prop and persistence through a real drag.
 */

import { act, render, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DtResizable, type DtResizableProps } from './Resizable';
import { DtResizablePanel } from './ResizablePanel';
import { DtResizableHandle } from './ResizableHandle';

const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

function mockClientWidth () {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get () { return 1000; },
  });
}

function restoreClientWidth () {
  if (originalClientWidth) {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
  }
}

interface LayoutProps extends Partial<DtResizableProps> {
  leftCollapsed?: boolean;
}

function Layout ({ leftCollapsed = false, ...props }: LayoutProps) {
  return (
    <DtResizable {...props}>
      <DtResizablePanel id="left" initialSize="50p" collapsible collapsed={leftCollapsed} />
      <DtResizableHandle />
      <DtResizablePanel id="right" initialSize="50p" />
    </DtResizable>
  );
}

let wrapper: RenderResult | undefined;

const handle = () => screen.getByTestId('dt-resizable-handle');
const panel = (id: string) => document.getElementById(`dt-resizable-panel-${id}`)!;

const drag = async (from: number, to: number, release = true) => {
  const user = userEvent.setup();
  await user.pointer([
    { keys: '[MouseLeft>]', target: handle(), coords: { clientX: from, clientY: 200 } },
    { target: handle(), coords: { clientX: to, clientY: 200 } },
  ]);
  if (release) await user.pointer({ keys: '[/MouseLeft]', target: handle() });
  return user;
};

describe('DtResizable behaviour (React-only)', () => {
  beforeEach(() => {
    mockClientWidth();
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    restoreClientWidth();
    localStorage.clear();
  });

  describe('Keyboard resize', () => {
    it('moves the boundary by 8px on ArrowRight and announces it', async () => {
      const user = userEvent.setup();
      wrapper = render(<Layout />);
      act(() => handle().focus());

      await user.keyboard('{ArrowRight}');

      expect(panel('left').style.insetInlineEnd).toBe('492px');
      expect(panel('right').style.insetInlineStart).toBe('508px');
      expect(handle().style.insetInlineStart).toBe('506px');
      expect(handle()).toHaveAttribute('aria-valuenow', '50');
      // Vue announces the sizes the panels had before the key (Reviewer attention); the port keeps that.
      await vi.waitFor(() => {
        expect(document.getElementById('d-resizable-announcements')).toHaveTextContent('left: 500px, right: 500px');
      });
    });

    it('collapses the panel before the handle on Enter', async () => {
      const user = userEvent.setup();
      const onPanelCollapse = vi.fn();
      wrapper = render(<Layout onPanelCollapse={onPanelCollapse} />);
      act(() => handle().focus());

      await user.keyboard('{Enter}');

      expect(onPanelCollapse).toHaveBeenCalledWith('left', true);
      expect(panel('left')).toHaveClass('d-resizable-panel--collapsed');
      expect(handle()).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Double-click reset', () => {
    it('restores the initial sizes after a resize', async () => {
      const user = userEvent.setup();
      wrapper = render(<Layout />);
      act(() => handle().focus());
      await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
      expect(panel('right').style.insetInlineStart).toBe('476px');

      await user.dblClick(handle());

      expect(panel('right').style.insetInlineStart).toBe('500px');
    });
  });

  describe('Pointer drag', () => {
    it('commits the dragged size and reports the handle', async () => {
      const onResizeEnd = vi.fn();
      wrapper = render(<Layout onResizeEnd={onResizeEnd} />);

      await drag(500, 400);

      expect(onResizeEnd).toHaveBeenCalledWith('left:right');
      expect(panel('left').style.insetInlineEnd).toBe('600px');
      expect(panel('right').style.insetInlineStart).toBe('400px');
      expect(wrapper.container.querySelector('.d-resizable--resizing')).not.toBeInTheDocument();
    });

    it('cancels on Escape, keeping the sizes it started with', async () => {
      const onResizeEnd = vi.fn();
      wrapper = render(<Layout onResizeEnd={onResizeEnd} />);

      const user = await drag(500, 400, false);
      expect(panel('right').style.insetInlineStart).toBe('400px');
      await user.keyboard('{Escape}');
      await user.pointer({ keys: '[/MouseLeft]', target: handle() });

      expect(onResizeEnd).not.toHaveBeenCalled();
      expect(panel('right').style.insetInlineStart).toBe('500px');
      expect(panel('left').style.insetInlineEnd).toBe('500px');
    });

    it('persists the dragged size under storageKey', async () => {
      wrapper = render(<Layout storageKey="behaviour-layout" />);

      await drag(500, 300);

      const saved = JSON.parse(localStorage.getItem('behaviour-layout')!);
      expect(saved.find((p: { id: string }) => p.id === 'left').pixelSize).toBe(300);
    });
  });

  describe('collapsed prop', () => {
    // As in Vue, the new config re-registers before the collapse request runs, so the panel is already collapsed by
    // then and onPanelCollapse isn't called.
    it('collapses and expands the panel when it changes', () => {
      wrapper = render(<Layout />);

      wrapper.rerender(<Layout leftCollapsed />);
      expect(panel('left')).toHaveClass('d-resizable-panel--collapsed');
      expect(panel('right').style.insetInlineStart).toBe('0px');
      expect(handle()).toHaveAttribute('aria-disabled', 'true');

      wrapper.rerender(<Layout />);
      expect(panel('left')).not.toHaveClass('d-resizable-panel--collapsed');
      expect(panel('right').style.insetInlineStart).toBe('500px');
    });
  });
});
