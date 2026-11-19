/**
 * V6: Offset positioning tests
 *
 * Tests useResizableOffset and handle offset props.
 */

import { render, screen, type RenderResult } from '@testing-library/react';
import { DtResizable } from './Resizable';
import { DtResizablePanel } from './ResizablePanel';
import { DtResizableHandle } from './ResizableHandle';

interface OffsetLayoutProps {
  offsetElement?: string;
  offsetAmount?: number;
  offsetDirection?: string;
}

// As in Vue's test, the offset props go on the handle, which doesn't declare them: they fall through as attributes.
function OffsetLayout ({ offsetElement, offsetAmount = 0, offsetDirection = 'both' }: OffsetLayoutProps) {
  return (
    <div style={{ width: '1000px', height: '400px' }}>
      <div id="toolbar" style={{ height: '48px' }}>Toolbar</div>
      <DtResizable>
        <DtResizablePanel
          id="left"
          initialSize="50p"
        />
        <DtResizableHandle
          offset-element={offsetElement}
          offset-amount={offsetAmount}
          offset-direction={offsetDirection}
        />
        <DtResizablePanel
          id="right"
          initialSize="50p"
        />
      </DtResizable>
    </div>
  );
}

let wrapper: RenderResult | undefined;

const _setWrapper = (props: OffsetLayoutProps = {}) => {
  wrapper = render(<OffsetLayout {...props} />);
};

describe('V6: Offset Positioning', () => {
  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    const announcements = document.getElementById('d-resizable-announcements');
    if (announcements) announcements.remove();
  });

  describe('Handle without offset', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should render handle', () => {
      expect(screen.getByTestId('dt-resizable-handle')).toHaveClass('d-resizable-handle');
    });

    it('should not add offset styles when no offsetElement', () => {
      expect(screen.getByTestId('dt-resizable-handle').getAttribute('style')).not.toContain('padding');
    });
  });

  describe('Handle with offset props', () => {
    beforeEach(() => {
      _setWrapper({ offsetElement: '#toolbar', offsetAmount: 8 });
    });

    it('should render handle with offset element configured', () => {
      expect(screen.getByTestId('dt-resizable-handle')).toHaveClass('d-resizable-handle');
    });
  });

  describe('useResizableOffset composable', () => {
    it('should export the composable', async () => {
      const mod = await import('./Composables/UseResizableOffset');
      expect(typeof mod.useResizableOffset).toBe('function');
    });
  });

  describe('Offset direction prop', () => {
    it.each([
      ['start'],
      ['end'],
      ['both'],
    ])('should accept %s direction', (direction) => {
      _setWrapper({ offsetElement: '#toolbar', offsetDirection: direction });
      expect(screen.getByTestId('dt-resizable-handle')).toHaveClass('d-resizable-handle');
    });
  });
});
