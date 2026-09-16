import { mount } from '@vue/test-utils';
import { DtScrollbarDirective } from './scrollbar.js';
import { OverlayScrollbars } from 'overlayscrollbars';

const makeWrapper = (template, options = {}) => ({
  name: 'wrapper-component',
  template,
  ...options,
});

const WrapperDefault = makeWrapper(`<div v-dt-scrollbar><div id="viewport"></div></div>`);

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

describe('DtScrollbarDirective Tests', () => {
  let wrapper;
  let viewportElement;

  const mountWith = (component, props = {}) => {
    wrapper = mount(component, {
      props,
      global: { plugins: [DtScrollbarDirective] },
    });
    viewportElement = wrapper.find('#viewport').element;
  };

  afterEach(() => {
    wrapper.unmount();
  });

  beforeEach(() => {
    OverlayScrollbars.mockClear();
    mocks.destroy.mockClear();
    mocks.options.mockClear();
    mocks.elements.mockClear();
    mocks.blockScrollbar.className = '';
    mocks.inlineScrollbar.className = '';
    globalThis.CSS = { registerProperty: vi.fn() };
  });

  beforeAll(() => {
    vi.mock('overlayscrollbars', () => {
      const mockPlugin = vi.fn();
      const OverlayScrollbarsMock = vi.fn().mockImplementation(() => ({
        destroy: mocks.destroy,
        options: mocks.options,
        elements: mocks.elements,
      }));
      OverlayScrollbarsMock.plugin = mockPlugin;
      return {
        OverlayScrollbars: OverlayScrollbarsMock,
        ClickScrollPlugin: vi.fn(),
      };
    });
  });

  describe('Presentation Tests', () => {
    describe('when directive has no argument (default enter)', () => {
      beforeEach(() => {
        mountWith(WrapperDefault);
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should initialize OverlayScrollbars with autoHide leave (enter mode)', () => {
        expect(OverlayScrollbars).toHaveBeenCalledWith(
          { target: wrapper.element, elements: { viewport: viewportElement } },
          { scrollbars: { autoHide: 'leave', clickScroll: true, autoHideDelay: 0 } },
        );
      });

      it('should add d-scrollbar class and data attribute', () => {
        expect(wrapper.element.classList.contains('d-scrollbar')).toBe(true);
        expect(wrapper.element.getAttribute('data-overlayscrollbars-initialize')).toBe('true');
      });

      it('should destroy on unmount', () => {
        wrapper.unmount();
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
        globalThis.CSS.registerProperty.mockImplementationOnce(() => {
          throw new DOMException('already registered', 'InvalidModificationError');
        });
      });

      it('should not throw', () => {
        expect(() => mountWith(WrapperDefault)).not.toThrow();
      });
    });

    describe('when CSS.registerProperty fails for an unrelated reason', () => {
      beforeEach(() => {
        globalThis.CSS.registerProperty.mockImplementationOnce(() => {
          throw new TypeError('invalid property descriptor');
        });
      });

      it('should propagate the error', () => {
        expect(() => mountWith(WrapperDefault)).toThrow(TypeError);
      });
    });

    describe('when directive arg is :always', () => {
      beforeEach(() => {
        mountWith(makeWrapper(`<div v-dt-scrollbar:always><div id="viewport"></div></div>`));
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
        mountWith(makeWrapper(`<div v-dt-scrollbar:enter><div id="viewport"></div></div>`));
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
        mountWith(makeWrapper(`<div v-dt-scrollbar:scroll><div id="viewport"></div></div>`));
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
        mountWith(
          makeWrapper(`<div v-dt-scrollbar="opts"><div id="viewport"></div></div>`, { props: { opts: { type: Object, default: () => ({}) } } }),
          { opts: { showScrollbar: 'invalid-value' } },
        );
      });

      afterEach(() => {
        console.info.mockRestore();
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
        mountWith(
          makeWrapper(`<div v-dt-scrollbar="opts"><div id="viewport"></div></div>`, { props: { opts: { type: Object, default: () => ({}) } } }),
          { opts: { showScrollbar: 'always' } },
        );
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
        mountWith(
          makeWrapper(`<div v-dt-scrollbar="opts"><div id="viewport"></div></div>`, { props: { opts: { type: Object, default: () => ({}) } } }),
          { opts: { offset: { blockStart: '2rem', inlineEnd: '4rem' } } },
        );
      });

      it('should set block-start offset custom property', () => {
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-block-start')).toBe('2rem');
      });

      it('should set inline-end offset custom property', () => {
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-inline-end')).toBe('4rem');
      });

      it('should not set unspecified offset properties', () => {
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-block-end')).toBe('');
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-inline-start')).toBe('');
      });
    });

    describe('when directive value has numeric offset', () => {
      beforeEach(() => {
        mountWith(
          makeWrapper(`<div v-dt-scrollbar="opts"><div id="viewport"></div></div>`, { props: { opts: { type: Object, default: () => ({}) } } }),
          { opts: { offset: { blockStart: 64, inlineEnd: 16 } } },
        );
      });

      it('should append px to numeric block-start offset', () => {
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-block-start')).toBe('64px');
      });

      it('should append px to numeric inline-end offset', () => {
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-inline-end')).toBe('16px');
      });
    });

    describe('when directive value has block/inline shorthand offset', () => {
      beforeEach(() => {
        mountWith(
          makeWrapper(`<div v-dt-scrollbar="opts"><div id="viewport"></div></div>`, { props: { opts: { type: Object, default: () => ({}) } } }),
          { opts: { offset: { block: '1rem', inline: '2rem' } } },
        );
      });

      it('should set block-start from block shorthand', () => {
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-block-start')).toBe('1rem');
      });

      it('should set block-end from block shorthand', () => {
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-block-end')).toBe('1rem');
      });

      it('should set inline-start from inline shorthand', () => {
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-inline-start')).toBe('2rem');
      });

      it('should set inline-end from inline shorthand', () => {
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-inline-end')).toBe('2rem');
      });
    });

    describe('when directive value has blockClasses', () => {
      beforeEach(() => {
        mountWith(
          makeWrapper(`<div v-dt-scrollbar="opts"><div id="viewport"></div></div>`, { props: { opts: { type: Object, default: () => ({}) } } }),
          { opts: { blockClasses: 'd-w12 d-bgc-purple-300' } },
        );
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
        mountWith(
          makeWrapper(`<div v-dt-scrollbar="opts"><div id="viewport"></div></div>`, { props: { opts: { type: Object, default: () => ({}) } } }),
          { opts: { inlineClasses: 'd-h8 d-bgc-blue-300' } },
        );
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
    const optsComponent = makeWrapper(
      `<div v-dt-scrollbar="opts"><div id="viewport"></div></div>`,
      { props: { opts: { type: Object, default: () => ({}) } } },
    );

    describe('when showScrollbar prop changes', () => {
      beforeEach(async () => {
        mountWith(optsComponent, { opts: { showScrollbar: 'enter' } });
        await wrapper.setProps({ opts: { showScrollbar: 'always' } });
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
      beforeEach(async () => {
        mountWith(optsComponent, { opts: { showScrollbar: 'always' } });
        await wrapper.setProps({ opts: { showScrollbar: 'scroll' } });
      });

      it('should call options with autoHide scroll and delay', () => {
        expect(mocks.options).toHaveBeenCalledWith(
          { scrollbars: { autoHide: 'scroll', autoHideDelay: 1300 } },
        );
      });
    });

    describe('when offset prop changes', () => {
      beforeEach(async () => {
        mountWith(optsComponent, { opts: { offset: { blockStart: '1rem' } } });
        await wrapper.setProps({ opts: { offset: { blockStart: '3rem', inlineEnd: '2rem' } } });
      });

      it('should update block-start custom property', () => {
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-block-start')).toBe('3rem');
      });

      it('should set newly added inline-end custom property', () => {
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-inline-end')).toBe('2rem');
      });
    });

    describe('when blockClasses prop changes', () => {
      beforeEach(async () => {
        mountWith(optsComponent, { opts: { blockClasses: 'd-w8' } });
        await wrapper.setProps({ opts: { blockClasses: 'd-w12' } });
      });

      it('should remove old blockClasses from the vertical scrollbar', () => {
        expect(mocks.blockScrollbar.classList.contains('d-w8')).toBe(false);
      });

      it('should add new blockClasses to the vertical scrollbar', () => {
        expect(mocks.blockScrollbar.classList.contains('d-w12')).toBe(true);
      });
    });

    describe('when inlineClasses prop changes', () => {
      beforeEach(async () => {
        mountWith(optsComponent, { opts: { inlineClasses: 'd-h8' } });
        await wrapper.setProps({ opts: { inlineClasses: 'd-h12' } });
      });

      it('should remove old inlineClasses from the horizontal scrollbar', () => {
        expect(mocks.inlineScrollbar.classList.contains('d-h8')).toBe(false);
      });

      it('should add new inlineClasses to the horizontal scrollbar', () => {
        expect(mocks.inlineScrollbar.classList.contains('d-h12')).toBe(true);
      });
    });
  });
});
