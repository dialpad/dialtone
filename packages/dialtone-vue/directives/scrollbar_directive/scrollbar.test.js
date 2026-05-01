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
  return {
    destroy: vi.fn(),
    options: vi.fn(),
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
  });

  beforeAll(() => {
    vi.mock('overlayscrollbars', () => {
      const mockPlugin = vi.fn();
      const OverlayScrollbarsMock = vi.fn().mockImplementation(() => ({
        destroy: mocks.destroy,
        options: mocks.options,
      }));
      OverlayScrollbarsMock.plugin = mockPlugin;
      return {
        OverlayScrollbars: OverlayScrollbarsMock,
        ClickScrollPlugin: vi.fn(),
      };
    });
  });

  describe('Presentation Tests', () => {
    describe('when directive has no argument (default leave)', () => {
      beforeEach(() => {
        mountWith(WrapperDefault);
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should initialize OverlayScrollbars with autoHide leave', () => {
        expect(OverlayScrollbars).toHaveBeenCalledWith(
          { target: wrapper.element, elements: { viewport: viewportElement } },
          { scrollbars: { autoHide: 'leave', clickScroll: true, autoHideDelay: '0' } },
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
    });

    describe('when directive arg is :always', () => {
      beforeEach(() => {
        mountWith(makeWrapper(`<div v-dt-scrollbar:always><div id="viewport"></div></div>`));
      });

      it('should initialize with autoHide never', () => {
        expect(OverlayScrollbars).toHaveBeenCalledWith(
          expect.any(Object),
          { scrollbars: { autoHide: 'never', clickScroll: true, autoHideDelay: '0' } },
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
          { scrollbars: { autoHide: 'scroll', clickScroll: true, autoHideDelay: '1300' } },
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
          { scrollbars: { autoHide: 'never', clickScroll: true, autoHideDelay: '0' } },
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

    describe('when directive value has block/inline shorthand offset', () => {
      beforeEach(() => {
        mountWith(
          makeWrapper(`<div v-dt-scrollbar="opts"><div id="viewport"></div></div>`, { props: { opts: { type: Object, default: () => ({}) } } }),
          { opts: { offset: { block: '1rem', inline: '2rem' } } },
        );
      });

      it('should set block-start and block-end from block shorthand', () => {
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-block-start')).toBe('1rem');
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-block-end')).toBe('1rem');
      });

      it('should set inline-start and inline-end from inline shorthand', () => {
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-inline-start')).toBe('2rem');
        expect(wrapper.element.style.getPropertyValue('--dt-scrollbar-offset-inline-end')).toBe('2rem');
      });
    });
  });
});
