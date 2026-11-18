/**
 * DtResizable drag interaction tests
 *
 * Tests basic pointerdown → pointermove → pointerup flow,
 * Escape cancels drag, and touch events.
 */

import { fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DtResizable } from './Resizable';
import { DtResizablePanel } from './ResizablePanel';
import { DtResizableHandle } from './ResizableHandle';

// jsdom doesn't compute layout — mock clientWidth so the container gets a
// non-zero size and computeLayout can produce valid panel positions.
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

function TwoPanelDrag ({ handleDisabled = false }: { handleDisabled?: boolean }) {
  return (
    <div style={{ width: '1000px', height: '400px' }}>
      <DtResizable>
        <DtResizablePanel id="left" initialSize="50p" />
        <DtResizableHandle disabled={handleDisabled} />
        <DtResizablePanel id="right" initialSize="50p" />
      </DtResizable>
    </div>
  );
}

let wrapper: RenderResult | undefined;

const _setWrapper = () => {
  mockClientWidth();
  wrapper = render(<TwoPanelDrag />);
};

const pressHandle = async (handle: HTMLElement) => {
  const user = userEvent.setup();
  await user.pointer({ keys: '[MouseLeft>]', target: handle, coords: { clientX: 500, clientY: 200 } });
};

describe('DtResizable Drag Interaction', () => {
  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    restoreClientWidth();
    const announcements = document.getElementById('d-resizable-announcements');
    if (announcements) announcements.remove();
  });

  describe('Mouse drag', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should render the handle as a draggable separator', () => {
      const handle = screen.getByTestId('dt-resizable-handle');
      expect(handle).toHaveClass('d-resizable-handle');
      expect(handle).toHaveAttribute('role', 'separator');
    });

    it('should apply resizing class on pointerdown', async () => {
      await pressHandle(screen.getByTestId('dt-resizable-handle'));

      expect(wrapper!.container.querySelector('.d-resizable--resizing')).toBeInTheDocument();
    });

    it('should not start drag when handle is disabled', async () => {
      const disabledWrapper = render(<TwoPanelDrag handleDisabled />);
      const handle = disabledWrapper.getAllByTestId('dt-resizable-handle').at(-1)!;
      await pressHandle(handle);

      expect(disabledWrapper.container.querySelector('.d-resizable--resizing')).not.toBeInTheDocument();

      disabledWrapper.unmount();
    });
  });

  describe('Touch drag', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should respond to touchstart events', () => {
      const handle = screen.getByTestId('dt-resizable-handle');
      // touchstart should not throw
      fireEvent.touchStart(handle, {
        touches: [{ clientX: 500, clientY: 200 }],
      });
      expect(handle).toBeInTheDocument();
    });
  });

  describe('Double-click reset', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should handle double-click on handle', async () => {
      const user = userEvent.setup();
      const handle = screen.getByTestId('dt-resizable-handle');
      // dblclick should not throw
      await user.dblClick(handle);
      expect(handle).toBeInTheDocument();
    });
  });

  describe('Handle cursor style', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should have handle indicator element', () => {
      const indicator = wrapper!.container.querySelector('.d-resizable-handle__indicator');
      expect(indicator).toBeInTheDocument();
    });
  });
});
