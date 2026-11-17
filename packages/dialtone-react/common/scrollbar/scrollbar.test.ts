import { createElement, StrictMode, useState } from 'react';
import { render, type RenderResult } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OverlayScrollbars } from 'overlayscrollbars';
import { useScrollbar, type ScrollbarOptions, type ScrollbarShowMode } from './useScrollbar';

interface ScrollableProps {
  /** `v-dt-scrollbar="value"` */
  opts?: ScrollbarOptions | null;
  /** `v-dt-scrollbar:arg` */
  arg?: ScrollbarShowMode;
}

// The element Vue's templates put `v-dt-scrollbar` on: `<div v-dt-scrollbar><div id="viewport"></div></div>`.
function Scrollable ({ opts, arg }: ScrollableProps) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useScrollbar(el, opts, { arg });
  return createElement('div', { ref: setEl, 'data-qa': 'scrollbar' }, createElement('div', { id: 'viewport' }));
}

const mocks = vi.hoisted(() => {
  const blockScrollbar = document.createElement('div');
  const inlineScrollbar = document.createElement('div');
  return {
    destroy: vi.fn(),
    options: vi.fn(),
    elements: vi.fn(() => ({
      scrollbarVertical: { scrollbar: blockScrollbar },
      scrollbarHorizontal: { scrollbar: inlineScrollbar },
    })),
    blockScrollbar,
    inlineScrollbar,
  };
});

vi.mock('overlayscrollbars', () => {
  const mockPlugin = vi.fn();
  const OverlayScrollbarsMock = Object.assign(vi.fn().mockImplementation(() => ({
    destroy: mocks.destroy,
    options: mocks.options,
    elements: mocks.elements,
  })), { plugin: mockPlugin });
  return {
    OverlayScrollbars: OverlayScrollbarsMock,
    ClickScrollPlugin: vi.fn(),
  };
});

describe('DtScrollbarDirective Tests', () => {
  let wrapper: RenderResult | null;
  let viewportElement: HTMLElement;

  const ui = (props: ScrollableProps) => createElement(Scrollable, props);
  const root = () => wrapper!.getByTestId('scrollbar');
  const mountWith = (props: ScrollableProps = {}) => {
    wrapper = render(ui(props));
    viewportElement = wrapper.container.querySelector('#viewport')!;
  };
  // Vue's `wrapper.setProps` is a rerender with new props.
  const setProps = (props: ScrollableProps) => wrapper!.rerender(ui(props));
  const unmount = () => {
    wrapper?.unmount();
    wrapper = null;
  };

  afterEach(() => {
    unmount();
  });

  beforeEach(() => {
    vi.mocked(OverlayScrollbars).mockClear();
    mocks.destroy.mockClear();
    mocks.options.mockClear();
    mocks.elements.mockClear();
    mocks.blockScrollbar.className = '';
    mocks.inlineScrollbar.className = '';
    globalThis.CSS = { registerProperty: vi.fn() } as unknown as typeof CSS;
  });

  describe('Presentation Tests', () => {
    describe('when directive has no argument (default enter)', () => {
      beforeEach(() => {
        mountWith();
      });

      it('should render the component', () => {
        expect(root()).toBeInTheDocument();
      });

      it('should initialize OverlayScrollbars with autoHide leave (enter mode)', () => {
        expect(OverlayScrollbars).toHaveBeenCalledWith(
          { target: root(), elements: { viewport: viewportElement } },
          { scrollbars: { autoHide: 'leave', clickScroll: true, autoHideDelay: 0 } },
        );
      });

      it('should add d-scrollbar class and data attribute', () => {
        expect(root().classList.contains('d-scrollbar')).toBe(true);
        expect(root().getAttribute('data-overlayscrollbars-initialize')).toBe('true');
      });

      it('should destroy on unmount', () => {
        unmount();
        expect(mocks.destroy).toHaveBeenCalledTimes(1);
      });

      it('should register the --os-scroll-percent CSS property globally', () => {
        expect(globalThis.CSS.registerProperty).toHaveBeenCalledWith({
          name: '--os-scroll-percent',
          syntax: '<number>',
          inherits: true,
          initialValue: '0',
        });
      });
    });

    describe('when --os-scroll-percent is already registered', () => {
      beforeEach(() => {
        vi.mocked(globalThis.CSS.registerProperty).mockImplementationOnce(() => {
          throw new DOMException('already registered', 'InvalidModificationError');
        });
      });

      it('should not throw', () => {
        expect(() => mountWith()).not.toThrow();
      });
    });

    describe('when CSS.registerProperty fails for an unrelated reason', () => {
      beforeEach(() => {
        vi.mocked(globalThis.CSS.registerProperty).mockImplementationOnce(() => {
          throw new TypeError('invalid property descriptor');
        });
        // React reports the error it rethrows.
        vi.spyOn(console, 'error').mockImplementation(() => {});
      });

      afterEach(() => {
        vi.mocked(console.error).mockRestore();
      });

      it('should propagate the error', () => {
        expect(() => mountWith()).toThrow(TypeError);
      });
    });

    describe('when directive arg is :always', () => {
      beforeEach(() => {
        mountWith({ arg: 'always' });
      });

      it('should initialize with autoHide never', () => {
        expect(OverlayScrollbars).toHaveBeenCalledWith(
          expect.any(Object),
          { scrollbars: { autoHide: 'never', clickScroll: true, autoHideDelay: 0 } },
        );
      });
    });

    describe('when directive arg is :enter', () => {
      beforeEach(() => {
        mountWith({ arg: 'enter' });
      });

      it('should initialize with autoHide leave', () => {
        expect(OverlayScrollbars).toHaveBeenCalledWith(
          expect.any(Object),
          { scrollbars: { autoHide: 'leave', clickScroll: true, autoHideDelay: 0 } },
        );
      });
    });

    describe('when directive arg is :scroll', () => {
      beforeEach(() => {
        mountWith({ arg: 'scroll' });
      });

      it('should initialize with autoHide scroll and delay', () => {
        expect(OverlayScrollbars).toHaveBeenCalledWith(
          expect.any(Object),
          { scrollbars: { autoHide: 'scroll', clickScroll: true, autoHideDelay: 1300 } },
        );
      });
    });

    describe('when directive value has an invalid showScrollbar', () => {
      beforeEach(() => {
        vi.spyOn(console, 'info').mockImplementation(() => {});
        mountWith({
          // @ts-expect-error showScrollbar is one of the four modes; the directive still falls back at runtime.
          opts: { showScrollbar: 'invalid-value' },
        });
      });

      afterEach(() => {
        vi.mocked(console.info).mockRestore();
      });

      it('should log an informational message', () => {
        expect(console.info).toHaveBeenCalledWith(expect.stringContaining('"invalid-value"'));
      });

      it('should fall back to enter mode (autoHide leave)', () => {
        expect(OverlayScrollbars).toHaveBeenCalledWith(
          expect.any(Object),
          { scrollbars: { autoHide: 'leave', clickScroll: true, autoHideDelay: 0 } },
        );
      });
    });

    describe('when directive value is an object with showScrollbar', () => {
      beforeEach(() => {
        mountWith({ opts: { showScrollbar: 'always' } });
      });

      it('should initialize with autoHide from showScrollbar value', () => {
        expect(OverlayScrollbars).toHaveBeenCalledWith(
          expect.any(Object),
          { scrollbars: { autoHide: 'never', clickScroll: true, autoHideDelay: 0 } },
        );
      });
    });

    describe('when directive value has offset', () => {
      beforeEach(() => {
        mountWith({ opts: { offset: { blockStart: '2rem', inlineEnd: '4rem' } } });
      });

      it('should set block-start offset custom property', () => {
        expect(root().style.getPropertyValue('--dt-scrollbar-offset-block-start')).toBe('2rem');
      });

      it('should set inline-end offset custom property', () => {
        expect(root().style.getPropertyValue('--dt-scrollbar-offset-inline-end')).toBe('4rem');
      });

      it('should not set unspecified offset properties', () => {
        expect(root().style.getPropertyValue('--dt-scrollbar-offset-block-end')).toBe('');
        expect(root().style.getPropertyValue('--dt-scrollbar-offset-inline-start')).toBe('');
      });
    });

    describe('when directive value has numeric offset', () => {
      beforeEach(() => {
        mountWith({ opts: { offset: { blockStart: 64, inlineEnd: 16 } } });
      });

      it('should append px to numeric block-start offset', () => {
        expect(root().style.getPropertyValue('--dt-scrollbar-offset-block-start')).toBe('64px');
      });

      it('should append px to numeric inline-end offset', () => {
        expect(root().style.getPropertyValue('--dt-scrollbar-offset-inline-end')).toBe('16px');
      });
    });

    describe('when directive value has block/inline shorthand offset', () => {
      beforeEach(() => {
        mountWith({ opts: { offset: { block: '1rem', inline: '2rem' } } });
      });

      it('should set block-start from block shorthand', () => {
        expect(root().style.getPropertyValue('--dt-scrollbar-offset-block-start')).toBe('1rem');
      });

      it('should set block-end from block shorthand', () => {
        expect(root().style.getPropertyValue('--dt-scrollbar-offset-block-end')).toBe('1rem');
      });

      it('should set inline-start from inline shorthand', () => {
        expect(root().style.getPropertyValue('--dt-scrollbar-offset-inline-start')).toBe('2rem');
      });

      it('should set inline-end from inline shorthand', () => {
        expect(root().style.getPropertyValue('--dt-scrollbar-offset-inline-end')).toBe('2rem');
      });
    });

    describe('when directive value has blockClasses', () => {
      beforeEach(() => {
        mountWith({ opts: { blockClasses: 'd-w12 d-bgc-purple-300' } });
      });

      it('should add blockClasses to the vertical scrollbar element', () => {
        expect(mocks.blockScrollbar.classList.contains('d-w12')).toBe(true);
        expect(mocks.blockScrollbar.classList.contains('d-bgc-purple-300')).toBe(true);
      });

      it('should not add blockClasses to the horizontal scrollbar element', () => {
        expect(mocks.inlineScrollbar.classList.contains('d-w12')).toBe(false);
      });
    });

    describe('when directive value has inlineClasses', () => {
      beforeEach(() => {
        mountWith({ opts: { inlineClasses: 'd-h8 d-bgc-blue-300' } });
      });

      it('should add inlineClasses to the horizontal scrollbar element', () => {
        expect(mocks.inlineScrollbar.classList.contains('d-h8')).toBe(true);
        expect(mocks.inlineScrollbar.classList.contains('d-bgc-blue-300')).toBe(true);
      });

      it('should not add inlineClasses to the vertical scrollbar element', () => {
        expect(mocks.blockScrollbar.classList.contains('d-h8')).toBe(false);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('when showScrollbar prop changes', () => {
      beforeEach(() => {
        mountWith({ opts: { showScrollbar: 'enter' } });
        setProps({ opts: { showScrollbar: 'always' } });
      });

      it('should call options on the existing instance with new autoHide', () => {
        expect(mocks.options).toHaveBeenCalledWith(
          { scrollbars: { autoHide: 'never', autoHideDelay: 0 } },
        );
      });

      it('should not re-initialize OverlayScrollbars', () => {
        expect(OverlayScrollbars).toHaveBeenCalledTimes(1);
      });

      it('should not call destroy during update', () => {
        expect(mocks.destroy).not.toHaveBeenCalled();
      });
    });

    describe('when showScrollbar changes from always to scroll', () => {
      beforeEach(() => {
        mountWith({ opts: { showScrollbar: 'always' } });
        setProps({ opts: { showScrollbar: 'scroll' } });
      });

      it('should call options with autoHide scroll and delay', () => {
        expect(mocks.options).toHaveBeenCalledWith(
          { scrollbars: { autoHide: 'scroll', autoHideDelay: 1300 } },
        );
      });
    });

    describe('when offset prop changes', () => {
      beforeEach(() => {
        mountWith({ opts: { offset: { blockStart: '1rem' } } });
        setProps({ opts: { offset: { blockStart: '3rem', inlineEnd: '2rem' } } });
      });

      it('should update block-start custom property', () => {
        expect(root().style.getPropertyValue('--dt-scrollbar-offset-block-start')).toBe('3rem');
      });

      it('should set newly added inline-end custom property', () => {
        expect(root().style.getPropertyValue('--dt-scrollbar-offset-inline-end')).toBe('2rem');
      });
    });

    describe('when blockClasses prop changes', () => {
      beforeEach(() => {
        mountWith({ opts: { blockClasses: 'd-w8' } });
        setProps({ opts: { blockClasses: 'd-w12' } });
      });

      it('should remove old blockClasses from the vertical scrollbar', () => {
        expect(mocks.blockScrollbar.classList.contains('d-w8')).toBe(false);
      });

      it('should add new blockClasses to the vertical scrollbar', () => {
        expect(mocks.blockScrollbar.classList.contains('d-w12')).toBe(true);
      });
    });

    describe('when inlineClasses prop changes', () => {
      beforeEach(() => {
        mountWith({ opts: { inlineClasses: 'd-h8' } });
        setProps({ opts: { inlineClasses: 'd-h12' } });
      });

      it('should remove old inlineClasses from the horizontal scrollbar', () => {
        expect(mocks.inlineScrollbar.classList.contains('d-h8')).toBe(false);
      });

      it('should add new inlineClasses to the horizontal scrollbar', () => {
        expect(mocks.inlineScrollbar.classList.contains('d-h12')).toBe(true);
      });
    });
  });

  // React-only: what the hook adds to the directive's behaviour.
  describe('Hook behaviour (React only)', () => {
    it('should not call options when an equal value is passed in a new object', () => {
      mountWith({ opts: { showScrollbar: 'always', offset: { block: '1rem' } } });
      setProps({ opts: { showScrollbar: 'always', offset: { block: '1rem' } } });
      expect(mocks.options).not.toHaveBeenCalled();
    });

    it('should let the value override the arg', () => {
      mountWith({ arg: 'scroll', opts: { showScrollbar: 'always' } });
      expect(OverlayScrollbars).toHaveBeenCalledWith(
        expect.any(Object),
        { scrollbars: { autoHide: 'never', clickScroll: true, autoHideDelay: 0 } },
      );
    });

    it('should use the arg when the value has no showScrollbar', () => {
      mountWith({ arg: 'always', opts: { offset: { block: '1rem' } } });
      expect(OverlayScrollbars).toHaveBeenCalledWith(
        expect.any(Object),
        { scrollbars: { autoHide: 'never', clickScroll: true, autoHideDelay: 0 } },
      );
    });

    it('should remove an offset property that a new value drops', () => {
      mountWith({ opts: { offset: { blockStart: '1rem', inlineEnd: '2rem' } } });
      setProps({ opts: { offset: { blockStart: '1rem' } } });
      expect(root().style.getPropertyValue('--dt-scrollbar-offset-block-start')).toBe('1rem');
      expect(root().style.getPropertyValue('--dt-scrollbar-offset-inline-end')).toBe('');
    });

    it('should remove all offset properties when the offset goes away', () => {
      mountWith({ opts: { offset: { block: '1rem' } } });
      setProps({ opts: {} });
      expect(root().style.getPropertyValue('--dt-scrollbar-offset-block-start')).toBe('');
      expect(root().style.getPropertyValue('--dt-scrollbar-offset-block-end')).toBe('');
    });

    it('should remove the old classes when the value goes away', () => {
      mountWith({ opts: { blockClasses: 'd-w8', inlineClasses: 'd-h8' } });
      setProps({});
      expect(mocks.blockScrollbar.classList.contains('d-w8')).toBe(false);
      expect(mocks.inlineScrollbar.classList.contains('d-h8')).toBe(false);
    });

    it('should leave the class and attribute on the element after unmounting, as Vue does', () => {
      mountWith();
      const el = root();
      unmount();
      expect(el.classList.contains('d-scrollbar')).toBe(true);
      expect(el.getAttribute('data-overlayscrollbars-initialize')).toBe('true');
    });

    it('should have one live instance after a StrictMode mount and none after unmounting', () => {
      wrapper = render(createElement(StrictMode, null, ui({})));
      expect(vi.mocked(OverlayScrollbars).mock.calls.length - mocks.destroy.mock.calls.length).toBe(1);
      unmount();
      expect(vi.mocked(OverlayScrollbars).mock.calls.length).toBe(mocks.destroy.mock.calls.length);
    });

    describe('when the element changes', () => {
      function Swapping ({ swapped }: { swapped: boolean }) {
        const [el, setEl] = useState<HTMLElement | null>(null);
        useScrollbar(el);
        return swapped
          ? createElement('section', { key: 'b', ref: setEl, 'data-qa': 'second' }, createElement('div'))
          : createElement('div', { key: 'a', ref: setEl, 'data-qa': 'first' }, createElement('div'));
      }

      it('should destroy the instance of the old element and create one on the new', () => {
        wrapper = render(createElement(Swapping, { swapped: false }));
        wrapper.rerender(createElement(Swapping, { swapped: true }));
        expect(mocks.destroy).toHaveBeenCalledTimes(1);
        expect(OverlayScrollbars).toHaveBeenCalledTimes(2);
        expect(wrapper.getByTestId('second').classList.contains('d-scrollbar')).toBe(true);
      });
    });

    describe('when two hooks are on one element', () => {
      function Twice ({ first, second, showSecond = true }: {
        first?: ScrollbarOptions;
        second?: ScrollbarOptions;
        showSecond?: boolean;
      }) {
        const [el, setEl] = useState<HTMLElement | null>(null);
        useScrollbar(el, first);
        return createElement(
          'div',
          { ref: setEl, 'data-qa': 'scrollbar' },
          createElement('div'),
          createElement(Second, { el, value: second, show: showSecond }),
        );
      }
      function Second ({ el, value, show }: { el: HTMLElement | null; value?: ScrollbarOptions; show: boolean }) {
        return show ? createElement(Hooked, { el, value }) : null;
      }
      function Hooked ({ el, value }: { el: HTMLElement | null; value?: ScrollbarOptions }) {
        useScrollbar(el, value);
        return null;
      }

      it('should keep one instance for the element', () => {
        wrapper = render(createElement(Twice, {}));
        expect(OverlayScrollbars).toHaveBeenCalledTimes(1);
      });

      it('should keep the state of the hooks still on the element when one lets go', () => {
        wrapper = render(createElement(Twice, {
          first: { showScrollbar: 'scroll' },
          second: { showScrollbar: 'always' },
        }));
        wrapper.rerender(createElement(Twice, {
          first: { showScrollbar: 'scroll' },
          second: { showScrollbar: 'always' },
          showSecond: false,
        }));
        expect(mocks.destroy).not.toHaveBeenCalled();
        expect(mocks.options).toHaveBeenLastCalledWith({ scrollbars: { autoHide: 'scroll', autoHideDelay: 1300 } });
      });

      it('should destroy the instance when the last of them lets go', () => {
        wrapper = render(createElement(Twice, {}));
        unmount();
        expect(mocks.destroy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
