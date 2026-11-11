import { act, cleanup, render, screen, type RenderResult } from '@testing-library/react';
import { DtModeIsland, type DtModeIslandProps } from './ModeIsland';

const baseProps: DtModeIslandProps = {};
const baseSlots = {
  children: <div data-qa="test-content">Test Content</div>,
};
const baseAttrs: Record<string, string> = {};

let mockProps: DtModeIslandProps = {};
let mockSlots: Partial<typeof baseSlots> = {};
let mockAttrs: Record<string, string> = {};

const waitForObservers = () => act(() => new Promise(resolve => setTimeout(resolve, 10)));

describe('DtModeIsland Tests', () => {
  let result: RenderResult;
  let island: HTMLElement;

  const updateWrapper = () => {
    cleanup();
    result = render(<DtModeIsland {...baseProps} {...mockProps} {...baseSlots} {...mockSlots} {...baseAttrs} {...mockAttrs} />);
    island = result.container.firstElementChild as HTMLElement;
  };

  beforeEach(() => {
    // Mock getRootMode, getRootContrast, getRootMaterial
    document.documentElement.setAttribute('data-dt-mode', 'light');
    document.documentElement.setAttribute('data-dt-contrast', 'default');
    document.documentElement.setAttribute('data-dt-material', 'sandstone');
    updateWrapper();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    document.documentElement.removeAttribute('data-dt-mode');
    document.documentElement.removeAttribute('data-dt-contrast');
    document.documentElement.removeAttribute('data-dt-material');
    mockProps = {};
    mockSlots = {};
    mockAttrs = {};
  });

  describe('Presentation Tests', () => {
    describe('When mode island renders', () => {
      it('should exist', () => {
        expect(screen.getByTestId('dt-mode-island')).toBeInTheDocument();
      });

      it('should render content', () => {
        expect(screen.getByTestId('test-content')).toHaveTextContent('Test Content');
      });

      it('should have correct data attributes', () => {
        expect(island).toHaveAttribute('data-qa', 'dt-mode-island');
        expect(island).toHaveAttribute('data-dt-mode');
        expect(island).toHaveAttribute('data-dt-contrast');
        expect(island).toHaveAttribute('data-dt-material');
      });
    });
  });

  describe('Mode Tests', () => {
    describe('When mode is "light"', () => {
      it('should set data-dt-mode to light', () => {
        mockProps = { mode: 'light' };

        updateWrapper();

        expect(island).toHaveAttribute('data-dt-mode', 'light');
      });
    });

    describe('When mode is "dark"', () => {
      it('should set data-dt-mode to dark', () => {
        mockProps = { mode: 'dark' };

        updateWrapper();

        expect(island).toHaveAttribute('data-dt-mode', 'dark');
      });
    });

    describe('When mode is "inverted" (default)', () => {
      it('should invert root mode when no parent', () => {
        // Root is set to light in beforeEach
        expect(island).toHaveAttribute('data-dt-mode', 'dark');
      });

      it('should invert dark root mode', () => {
        document.documentElement.setAttribute('data-dt-mode', 'dark');
        updateWrapper();
        expect(island).toHaveAttribute('data-dt-mode', 'light');
      });
    });
  });

  describe('Contrast Tests', () => {
    it('should inherit contrast from root', () => {
      expect(island).toHaveAttribute('data-dt-contrast', 'default');
    });

    it('should update contrast when root changes', async () => {
      document.documentElement.setAttribute('data-dt-contrast', 'high');
      // Trigger the mutation observer
      await waitForObservers();
      expect(island).toHaveAttribute('data-dt-contrast', 'high');
    });
  });

  describe('Material Tests', () => {
    it('should inherit material from root', () => {
      expect(island).toHaveAttribute('data-dt-material', 'sandstone');
    });

    it('should update material when root changes', async () => {
      document.documentElement.setAttribute('data-dt-material', 'graphite');
      // Trigger the mutation observer
      await waitForObservers();
      expect(island).toHaveAttribute('data-dt-material', 'graphite');
    });
  });

  describe('As Prop Tests', () => {
    it('should render as div by default', () => {
      expect(island.tagName.toLowerCase()).toBe('div');
    });

    it('should render as specified element', () => {
      mockProps = { as: 'section' };

      updateWrapper();

      expect(island.tagName.toLowerCase()).toBe('section');
    });
  });

  describe('Nested Mode Islands', () => {
    it('should invert parent mode island', () => {
      cleanup();
      render(
        <DtModeIsland mode="dark" data-qa="parent">
          <DtModeIsland mode="inverted" data-qa="child">
            <div>Nested Content</div>
          </DtModeIsland>
        </DtModeIsland>,
      );

      expect(screen.getByTestId('parent')).toHaveAttribute('data-dt-mode', 'dark');
      expect(screen.getByTestId('child')).toHaveAttribute('data-dt-mode', 'light');
    });

    it('should handle multiple nesting levels', () => {
      cleanup();
      render(
        <DtModeIsland mode="light" data-qa="level1">
          <DtModeIsland mode="inverted" data-qa="level2">
            <DtModeIsland mode="inverted" data-qa="level3">
              <div>Deep Nested</div>
            </DtModeIsland>
          </DtModeIsland>
        </DtModeIsland>,
      );

      expect(screen.getByTestId('level1')).toHaveAttribute('data-dt-mode', 'light');
      expect(screen.getByTestId('level2')).toHaveAttribute('data-dt-mode', 'dark');
      expect(screen.getByTestId('level3')).toHaveAttribute('data-dt-mode', 'light');
    });
  });

  describe('Brand Protection Tests', () => {
    it('should throw error when data-dt-brand is set', () => {
      // React reports the render error to the console before act rethrows it.
      vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<DtModeIsland {...{ 'data-dt-brand': 'test' }} />);
      }).toThrow('[DtModeIsland] The data-dt-brand attribute is not allowed on mode islands');
    });
  });

  describe('Attribute Passthrough Tests', () => {
    it('should pass through class attribute', () => {
      mockAttrs = { className: 'd-p-200 d-bgc-primary' };

      updateWrapper();

      expect(island).toHaveClass('d-p-200');
      expect(island).toHaveClass('d-bgc-primary');
    });

    it('should pass through id attribute', () => {
      mockAttrs = { id: 'test-island' };

      updateWrapper();

      expect(island).toHaveAttribute('id', 'test-island');
    });

    it('should pass through data attributes', () => {
      mockAttrs = { 'data-test': 'value' };

      updateWrapper();

      expect(island).toHaveAttribute('data-test', 'value');
    });
  });

  describe('Cleanup Tests', () => {
    it('should cleanup MutationObserver on unmount', () => {
      const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');
      updateWrapper();
      // updateWrapper unmounted the previous island; only this unmount counts.
      disconnectSpy.mockClear();

      result.unmount();
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  // React-only: what the port adds or does differently from Vue.
  describe('React-only Tests', () => {
    it('should keep the island class alongside a consumer class', () => {
      mockAttrs = { className: 'd-p-200' };

      updateWrapper();

      expect(island).toHaveClass('d-mode-island', 'd-p-200');
    });

    it('should mark only an inverted island', () => {
      expect(island).toHaveAttribute('data-mode-island-inverted', '');
      mockProps = { mode: 'dark' };

      updateWrapper();

      expect(island).not.toHaveAttribute('data-mode-island-inverted');
    });

    it('should re-invert when root mode changes', async () => {
      expect(island).toHaveAttribute('data-dt-mode', 'dark');

      document.documentElement.setAttribute('data-dt-mode', 'dark');
      await waitForObservers();

      expect(island).toHaveAttribute('data-dt-mode', 'light');
    });

    it('should invert a parent element with data-dt-mode', () => {
      cleanup();
      render(
        <div data-dt-mode="light">
          <DtModeIsland data-qa="child" />
        </div>,
      );
      expect(screen.getByTestId('child')).toHaveAttribute('data-dt-mode', 'dark');
    });

    it('should follow a parent island whose mode changes', async () => {
      cleanup();
      const { rerender } = render(
        <DtModeIsland mode="dark" data-qa="parent">
          <DtModeIsland data-qa="child" />
        </DtModeIsland>,
      );
      expect(screen.getByTestId('child')).toHaveAttribute('data-dt-mode', 'light');

      rerender(
        <DtModeIsland mode="light" data-qa="parent">
          <DtModeIsland data-qa="child" />
        </DtModeIsland>,
      );
      await waitForObservers();

      expect(screen.getByTestId('child')).toHaveAttribute('data-dt-mode', 'dark');
    });

    it('should forward its ref to the rendered element', () => {
      cleanup();
      const ref = { current: null as HTMLElement | null };
      render(<DtModeIsland as="section" ref={ref} />);
      expect(ref.current?.tagName.toLowerCase()).toBe('section');
    });
  });
});
