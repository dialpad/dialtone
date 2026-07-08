import { mount } from '@vue/test-utils';
import { DtScrollbarDirective } from './scrollbar.js';
import { OverlayScrollbars } from 'overlayscrollbars';

const WrapperComponent = {
  name: 'wrapper-component',
  template: `
    <div v-dt-scrollbar><div id="viewport"></div></div>
  `,
};

const mocks = vi.hoisted(() => {
  return {
    destroy: vi.fn(),
  };
});

describe('DtScrollbarDirective Tests', () => {
  let wrapper;
  let viewportElement;

  const updateWrapper = () => {
    wrapper = mount(WrapperComponent, {
      global: {
        plugins: [DtScrollbarDirective],
      },
    });

    viewportElement = wrapper.find('#viewport').element;
  };

  afterEach(() => {
    wrapper.unmount();
  });

  beforeEach(() => {
    OverlayScrollbars.mockClear();
    mocks.destroy.mockClear();
    globalThis.CSS = { registerProperty: vi.fn() };
  });

  beforeAll(() => {
    // Mock the overlayscrollbars plugin
    vi.mock('overlayscrollbars', () => {
      const mockPlugin = vi.fn(); // Mock the plugin method
      const OverlayScrollbarsMock = vi.fn().mockImplementation(() => ({ destroy: mocks.destroy }));
      OverlayScrollbarsMock.plugin = mockPlugin;
      return {
        OverlayScrollbars: OverlayScrollbarsMock,
        ClickScrollPlugin: vi.fn(),
      };
    });
  });

  describe('Presentation Tests', () => {
    describe('when scrollbars directive is present', () => {
      beforeEach(() => {
        updateWrapper();
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should setup directive', () => {
        expect(OverlayScrollbars).toHaveBeenCalledWith(
          {
            target: wrapper.element,
            elements: {
              viewport: viewportElement,
            },
          },
          { scrollbars: { autoHide: 'leave', clickScroll: true, autoHideDelay: '0' } });
        expect(OverlayScrollbars).toHaveBeenCalledTimes(1);
        expect(wrapper.element.getAttribute('data-overlayscrollbars-initialize')).toBe('true');
        expect(wrapper.element.classList.contains('d-scrollbar')).toBe(true);
      });

      it('should clean up directive', () => {
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
        expect(() => updateWrapper()).not.toThrow();
      });
    });

    describe('when CSS.registerProperty fails for an unrelated reason', () => {
      beforeEach(() => {
        globalThis.CSS.registerProperty.mockImplementationOnce(() => {
          throw new TypeError('invalid property descriptor');
        });
      });

      it('should propagate the error', () => {
        expect(() => updateWrapper()).toThrow(TypeError);
      });
    });
  });
});
