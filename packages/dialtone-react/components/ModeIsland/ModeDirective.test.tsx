import { useState, type ElementType, type ReactNode } from 'react';
import { act, cleanup, render, screen, type RenderResult } from '@testing-library/react';
import type { ContentMode } from '../../common/mode_constants';
import { useModeRegion } from './ModeDirective';
import { DtModeIsland } from './ModeIsland';

// The hook is the directive: one element per directive use, as in the Vue tests' templates.
interface RegionProps {
  as?: ElementType;
  mode?: ContentMode | false;
  qa: string;
  children?: ReactNode;
}

function Region ({ as: Tag = 'section', mode, qa, children }: RegionProps) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useModeRegion(el, mode);
  return <Tag ref={setEl} data-qa={qa}>{children}</Tag>;
}

const waitForObservers = () => act(() => new Promise(resolve => setTimeout(resolve, 10)));
const target = () => screen.getByTestId('target');

describe('DtModeDirective Tests', () => {
  let wrapper: RenderResult | undefined;

  beforeEach(() => {
    document.documentElement.setAttribute('data-dt-mode', 'light');
    document.documentElement.setAttribute('data-dt-contrast', 'default');
    document.documentElement.setAttribute('data-dt-material', 'sandstone');
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    cleanup();
    vi.restoreAllMocks();
    document.documentElement.removeAttribute('data-dt-mode');
    document.documentElement.removeAttribute('data-dt-contrast');
    document.documentElement.removeAttribute('data-dt-material');
  });

  describe('Explicit Mode Tests', () => {
    it('should set data-dt-mode to light with v-dt-mode:light', () => {
      wrapper = render(<Region mode="light" qa="target">Content</Region>);

      expect(target()).toHaveAttribute('data-dt-mode', 'light');
    });

    it('should set data-dt-mode to dark with v-dt-mode:dark', () => {
      wrapper = render(<Region mode="dark" qa="target">Content</Region>);

      expect(target()).toHaveAttribute('data-dt-mode', 'dark');
    });
  });

  describe('Invert Mode Tests', () => {
    it('should invert root mode when no arg is provided (default)', () => {
      wrapper = render(<Region qa="target">Content</Region>);

      // Root is light, so invert should be dark
      expect(target()).toHaveAttribute('data-dt-mode', 'dark');
    });

    it('should invert root mode with explicit :invert arg', () => {
      wrapper = render(<Region mode="invert" qa="target">Content</Region>);

      expect(target()).toHaveAttribute('data-dt-mode', 'dark');
    });

    it('should invert dark root mode', () => {
      document.documentElement.setAttribute('data-dt-mode', 'dark');

      wrapper = render(<Region qa="target">Content</Region>);

      expect(target()).toHaveAttribute('data-dt-mode', 'light');
    });

    it('should invert nearest parent with data-dt-mode', () => {
      wrapper = render(
        <div data-dt-mode="dark">
          <Region mode="invert" qa="target">Content</Region>
        </div>,
      );

      expect(target()).toHaveAttribute('data-dt-mode', 'light');
    });
  });

  describe('Contrast Tests', () => {
    it('should set data-dt-contrast from root', () => {
      wrapper = render(<Region mode="dark" qa="target">Content</Region>);

      expect(target()).toHaveAttribute('data-dt-contrast', 'default');
    });

    it('should update data-dt-contrast when root changes', async () => {
      wrapper = render(<Region mode="dark" qa="target">Content</Region>);

      document.documentElement.setAttribute('data-dt-contrast', 'high');
      // Wait for MutationObserver callback
      await waitForObservers();

      expect(target()).toHaveAttribute('data-dt-contrast', 'high');
    });
  });

  describe('Material Tests', () => {
    it('should set data-dt-material from root', () => {
      wrapper = render(<Region mode="dark" qa="target">Content</Region>);

      expect(target()).toHaveAttribute('data-dt-material', 'sandstone');
    });

    it('should update data-dt-material when root changes', async () => {
      wrapper = render(<Region mode="dark" qa="target">Content</Region>);

      document.documentElement.setAttribute('data-dt-material', 'graphite');
      // Wait for MutationObserver callback
      await waitForObservers();

      expect(target()).toHaveAttribute('data-dt-material', 'graphite');
    });
  });

  describe('Reactive Tests', () => {
    it('should re-invert when root mode changes', async () => {
      wrapper = render(<Region qa="target">Content</Region>);

      expect(target()).toHaveAttribute('data-dt-mode', 'dark');

      document.documentElement.setAttribute('data-dt-mode', 'dark');
      await waitForObservers();

      expect(target()).toHaveAttribute('data-dt-mode', 'light');
    });

    it('should not apply mode when value is false', () => {
      wrapper = render(<Region mode={false} qa="target">Content</Region>);

      expect(target()).not.toHaveAttribute('data-dt-mode');
      expect(target()).not.toHaveAttribute('data-dt-contrast');
      expect(target()).not.toHaveAttribute('data-dt-material');
    });

    it('should apply mode when value changes from false to true', () => {
      wrapper = render(<Region mode={false} qa="target">Content</Region>);

      expect(target()).not.toHaveAttribute('data-dt-mode');

      wrapper.rerender(<Region mode="invert" qa="target">Content</Region>);

      expect(target()).toHaveAttribute('data-dt-mode', 'dark');
    });

    it('should remove mode when value changes from true to false', () => {
      wrapper = render(<Region mode="invert" qa="target">Content</Region>);

      expect(target()).toHaveAttribute('data-dt-mode', 'dark');

      wrapper.rerender(<Region mode={false} qa="target">Content</Region>);

      expect(target()).not.toHaveAttribute('data-dt-mode');
    });

    it('should not teardown observers on re-render when arg is unchanged', () => {
      const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');

      wrapper = render(<Region mode="dark" qa="target">{0}</Region>);

      disconnectSpy.mockClear();

      // Trigger a re-render without changing the directive arg or value
      wrapper.rerender(<Region mode="dark" qa="target">{1}</Region>);

      expect(target()).toHaveTextContent('1');
      expect(disconnectSpy).not.toHaveBeenCalled();
      disconnectSpy.mockRestore();
    });

    it('should re-initialize when dynamic arg changes', () => {
      wrapper = render(<Region mode="dark" qa="target">Content</Region>);

      expect(target()).toHaveAttribute('data-dt-mode', 'dark');

      wrapper.rerender(<Region mode="light" qa="target">Content</Region>);

      expect(target()).toHaveAttribute('data-dt-mode', 'light');
    });
  });

  describe('Nesting Tests', () => {
    it('should read parent mode from DtModeIsland correctly', () => {
      wrapper = render(
        <DtModeIsland mode="dark" data-qa="parent">
          <Region mode="invert" qa="child">Content</Region>
        </DtModeIsland>,
      );

      expect(screen.getByTestId('parent')).toHaveAttribute('data-dt-mode', 'dark');
      expect(screen.getByTestId('child')).toHaveAttribute('data-dt-mode', 'light');
    });

    it('should nest directive inside directive correctly', async () => {
      wrapper = render(
        <Region as="div" mode="dark" qa="outer">
          <Region mode="invert" qa="inner">Content</Region>
        </Region>,
      );

      // Wait for MutationObserver to propagate (child layout effects run before the parent's)
      await waitForObservers();

      expect(screen.getByTestId('outer')).toHaveAttribute('data-dt-mode', 'dark');
      expect(screen.getByTestId('inner')).toHaveAttribute('data-dt-mode', 'light');
    });

    it('should alternate correctly with triple nesting', async () => {
      wrapper = render(
        <Region as="div" mode="light" qa="level1">
          <Region as="div" mode="invert" qa="level2">
            <Region as="div" mode="invert" qa="level3">Content</Region>
          </Region>
        </Region>,
      );

      // Wait for MutationObserver to propagate through nesting levels
      await waitForObservers();

      expect(screen.getByTestId('level1')).toHaveAttribute('data-dt-mode', 'light');
      expect(screen.getByTestId('level2')).toHaveAttribute('data-dt-mode', 'dark');
      expect(screen.getByTestId('level3')).toHaveAttribute('data-dt-mode', 'light');
    });
  });

  describe('Cleanup Tests', () => {
    it('should disconnect MutationObservers on unmount', () => {
      const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');

      wrapper = render(<Region qa="target">Content</Region>);
      disconnectSpy.mockClear();

      wrapper.unmount();
      wrapper = undefined;
      expect(disconnectSpy).toHaveBeenCalled();
      disconnectSpy.mockRestore();
    });
  });

  describe('Validation Tests', () => {
    it('should suggest "invert" when "inverted" is used', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // @ts-expect-error 'inverted' is DtModeIsland's value, not the directive's: the hook warns and falls back.
      wrapper = render(<Region mode="inverted" qa="target">Content</Region>);

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Did you mean "invert"?'),
      );
      // Falls back to invert — root is light, so should be dark
      expect(target()).toHaveAttribute('data-dt-mode', 'dark');
      warnSpy.mockRestore();
    });

    it('should warn and fall back to invert on invalid arg', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // @ts-expect-error an invalid mode: the hook warns and falls back to invert.
      wrapper = render(<Region mode="invalid" qa="target">Content</Region>);

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid mode "invalid"'),
      );
      // Falls back to invert — root is light, so should be dark
      expect(target()).toHaveAttribute('data-dt-mode', 'dark');
      warnSpy.mockRestore();
    });
  });

  describe('Class Tests', () => {
    it('should NOT auto-add d-mode-island class', () => {
      wrapper = render(<Region mode="dark" qa="target">Content</Region>);

      expect(target()).toHaveAttribute('data-dt-mode', 'dark');
      expect(target()).not.toHaveClass('d-mode-island');
    });
  });

  // React-only: what the port adds or does differently from Vue.
  describe('React-only Tests', () => {
    it('should remove its attributes on unmount', () => {
      const element = document.createElement('section');
      document.body.appendChild(element);
      function External () {
        useModeRegion(element, 'dark');
        return null;
      }

      wrapper = render(<External />);
      expect(element).toHaveAttribute('data-dt-mode', 'dark');

      wrapper.unmount();
      wrapper = undefined;
      expect(element).not.toHaveAttribute('data-dt-mode');
      expect(element).not.toHaveAttribute('data-dt-contrast');
      expect(element).not.toHaveAttribute('data-dt-material');
      element.remove();
    });

    it('should move its attributes to a new element when the element changes and the mode is unchanged', () => {
      wrapper = render(<Region as="section" mode="dark" qa="target">Content</Region>);
      const first = target();
      expect(first).toHaveAttribute('data-dt-mode', 'dark');

      // A different tag is a different element, with the same arguments passed to the hook.
      wrapper.rerender(<Region as="div" mode="dark" qa="target">Content</Region>);

      const second = target();
      expect(second).not.toBe(first);
      expect(second).toHaveAttribute('data-dt-mode', 'dark');
      expect(second).toHaveAttribute('data-dt-contrast', 'default');
      expect(second).toHaveAttribute('data-dt-material', 'sandstone');
      expect(first).not.toHaveAttribute('data-dt-mode');
    });

    it('should warn once for an invalid mode across re-renders', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // @ts-expect-error an invalid mode: the hook warns and falls back to invert.
      wrapper = render(<Region mode="invalid" qa="target">{0}</Region>);
      // @ts-expect-error an invalid mode: the hook warns and falls back to invert.
      wrapper.rerender(<Region mode="invalid" qa="target">{1}</Region>);

      expect(warnSpy).toHaveBeenCalledTimes(1);
    });
  });
});
