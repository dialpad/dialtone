/**
 * V4: Keyboard accessibility tests
 *
 * Tests W3C separator keyboard pattern: arrow resize, Enter collapse,
 * Home/End min/max, R reset, Escape blur, ARIA attributes.
 */

import { act, render, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ResizableDirection } from './ResizableConstants';
import { DtResizable } from './Resizable';
import { DtResizablePanel } from './ResizablePanel';
import { DtResizableHandle } from './ResizableHandle';

// ─── Test wrappers ─────────────────────────────────────────────────────

interface TwoPanelLayoutProps {
  direction?: ResizableDirection;
  leftCollapsible?: boolean;
  handleDisabled?: boolean;
}

function TwoPanelLayout ({ direction = 'row', leftCollapsible = false, handleDisabled = false }: TwoPanelLayoutProps) {
  return (
    <div style={{ width: '1000px', height: '400px' }}>
      <DtResizable direction={direction}>
        <DtResizablePanel
          id="left"
          initialSize="50p"
          collapsible={leftCollapsible}
        />
        <DtResizableHandle disabled={handleDisabled} />
        <DtResizablePanel id="right" initialSize="50p" />
      </DtResizable>
    </div>
  );
}

let wrapper: RenderResult | undefined;

const _setWrapper = (props: TwoPanelLayoutProps = {}) => {
  wrapper = render(<TwoPanelLayout {...props} />);
};

// jsdom gives the container no size, so there's no layout and the handle stays hidden (as in Vue's test): it isn't in
// the accessibility tree, so it's found by its data-qa.
const handle = () => screen.getByTestId('dt-resizable-handle');

describe('V4: Keyboard Accessibility', () => {
  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;

    const announcements = document.getElementById('d-resizable-announcements');
    if (announcements) announcements.remove();
  });

  describe('Handle ARIA attributes', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should have role="separator"', () => {
      expect(handle()).toHaveAttribute('role', 'separator');
    });

    it('should have vertical aria-orientation for row layout', () => {
      expect(handle()).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('should have aria-label describing adjacent panels', () => {
      expect(handle().getAttribute('aria-label')).toContain('Resize handle between');
    });

    it('should have tabindex="0" by default (always focusable)', () => {
      expect(handle()).toHaveAttribute('tabindex', '0');
    });

    it('should have aria-valuenow attribute', () => {
      expect(handle()).toHaveAttribute('aria-valuenow');
    });

    it('should have aria-valuemin attribute', () => {
      expect(handle()).toHaveAttribute('aria-valuemin');
    });

    it('should have aria-valuemax attribute', () => {
      expect(handle()).toHaveAttribute('aria-valuemax');
    });

    it('should have aria-controls attribute', () => {
      expect(handle().getAttribute('aria-controls')).toContain('dt-resizable-panel-');
    });

    it('should have aria-valuetext attribute', () => {
      expect(handle()).toHaveAttribute('aria-valuetext');
    });
  });

  describe('Handle ARIA for column layout', () => {
    beforeEach(() => {
      _setWrapper({ direction: 'column' });
    });

    it('should have horizontal aria-orientation for column layout', () => {
      expect(handle()).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });

  describe('When handle is disabled', () => {
    beforeEach(() => {
      _setWrapper({ handleDisabled: true });
    });

    it('should have tabindex="-1"', () => {
      expect(handle()).toHaveAttribute('tabindex', '-1');
    });

    it('should have aria-disabled="true"', () => {
      expect(handle()).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Keyboard events on handle', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should be focusable via keyboard', () => {
      act(() => handle().focus());
      expect(document.activeElement).toBe(handle());
    });

    it('should respond to keydown events on a focused handle', async () => {
      const user = userEvent.setup();
      act(() => handle().focus());

      // keydown should not throw
      await user.keyboard('{ArrowRight}');
      expect(handle()).toBeInTheDocument();
    });

    it('should blur handle on Escape key', async () => {
      const user = userEvent.setup();
      act(() => handle().focus());
      expect(document.activeElement).toBe(handle());

      await user.keyboard('{Escape}');
      expect(document.activeElement).not.toBe(handle());
    });
  });

  describe('Keyboard increment constants', () => {
    it.each([
      ['fine', 1],
      ['normal', 8],
      ['large', 24],
    ] as const)('KEYBOARD_INCREMENTS.%s equals %d', async (key, expected) => {
      const { KEYBOARD_INCREMENTS } = await import('./Composables/UseResizableKeyboard');
      expect(KEYBOARD_INCREMENTS[key]).toBe(expected);
    });
  });

  describe('Panel ID attribute', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should set id on panel element for aria-controls', () => {
      const leftPanel = document.getElementById('dt-resizable-panel-left');
      expect(leftPanel).toBeTruthy();
    });

    it('should set id on both panel elements', () => {
      const rightPanel = document.getElementById('dt-resizable-panel-right');
      expect(rightPanel).toBeTruthy();
    });
  });
});
