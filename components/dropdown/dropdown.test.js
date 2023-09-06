import { createLocalVue, mount } from '@vue/test-utils';
import DtDropdown from './dropdown.vue';
import SrOnlyCloseButton from '@/common/sr_only_close_button.vue';

const MOCK_TRANSITION_STUB = () => ({
  render: function (h) {
    return this.$options._renderChildren;
  },
});
const MOCK_HIGHLIGHT_STUB = vi.fn();

const baseProps = {
  open: true,
  visuallyHiddenCloseLabel: 'Close dropdown',
};
const baseSlots = {
  anchor: '<a href="#" id="anchor">Link</a>',
  list: `<ul id="list">
    <li role="menuitem">1</li>
    <li role="menuitem">2</li>
    <li role="menuitem">3</li>
  </ul>`,
};
const baseListeners = {};
const baseScopedSlots = {
  anchor: `<template #anchor="{ attrs }"><a href="#" id="anchor" v-bind="attrs">Link</a></template>`,
};

let mockProps = {};
let mockSlots = {};
let mockScopedSlots = {};
let mockListeners = {};
const testContext = {};

describe('DtDropdown Tests', () => {
  let wrapper;
  let anchorElement;
  let listWrapper;
  let closeButton;

  const updateWrapper = () => {
    wrapper = mount(DtDropdown, {
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      scopedSlots: { ...baseScopedSlots, ...mockScopedSlots },
      listeners: { ...baseListeners, ...mockListeners },
      localVue: testContext.localVue,
      stubs: {
        transition: MOCK_TRANSITION_STUB(),
      },
      attachTo: document.body,
    });

    anchorElement = wrapper.find('#anchor');
    listWrapper = wrapper.find('[data-qa="dt-dropdown-list-wrapper"]');
    closeButton = wrapper.findComponent(SrOnlyCloseButton);
  };

  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = vi.fn();
    global.cancelAnimationFrame = vi.fn();
    testContext.localVue = createLocalVue();
  });

  afterAll(() => {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    mockScopedSlots = {};
    mockListeners = {};
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should not render the visually hidden close button', () => {
      expect(closeButton.exists()).toBe(false);
    });

    describe('When a list is provided', () => {
      it('should render the list wrapper', () => {
        expect(listWrapper.exists()).toBe(true);
      });

      it('should render the anchor', () => {
        expect(anchorElement.exists()).toBe(true);
      });

      it('should render the list', () => {
        expect(wrapper.find('#list').exists()).toBe(true);
      });
    });

    describe('When visuallyHiddenClose is true', () => {
      beforeEach(() => {
        mockProps = { visuallyHiddenClose: true };

        updateWrapper();
      });

      it('should contain a visually hidden close button', () => {
        expect(closeButton.exists()).toBe(true);
      });

      describe('When visuallyHiddenCloseLabel is null', () => {
        it('should raise a validation error', async () => {
          const message = `If visuallyHiddenClose prop is true, the component includes
           a visually hidden close button and you must set the visuallyHiddenCloseLabel prop.`;

          let consoleErrorSpy = vi.spyOn(console, 'error').mockClear();

          await wrapper.setProps({ visuallyHiddenCloseLabel: null });

          expect(consoleErrorSpy).toHaveBeenCalledWith(message);

          consoleErrorSpy = null;
          console.error.mockRestore();
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When the dropdown is not open', () => {
      it('aria-expanded should be "false"', () => {
        mockProps = { open: false };

        updateWrapper();

        expect(anchorElement.attributes('aria-expanded') === 'false').toBe(true);
      });
    });

    describe('When the dropdown is open', () => {
      it('aria-expanded should be "true"', () => {
        expect(anchorElement.attributes('aria-expanded') === 'true').toBe(true);
      });
    });
  });

  describe('Interactivity Tests', () => {
    beforeEach(() => {
      mockListeners = { highlight: MOCK_HIGHLIGHT_STUB };

      updateWrapper();
    });

    describe('When the highlightIndex changes', () => {
      beforeEach(() => {
        wrapper.vm.setHighlightIndex(1);
      });

      it('should call listener', () => {
        expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalled();
      });

      it('should emit highlight event', () => {
        expect(wrapper.emitted().highlight.length).toBe(1);
      });
    });

    describe('When mouseleave is detected on the list wrapper', () => {
      it('should reset the highlightIndex', async () => {
        await listWrapper.trigger('mouseleave');

        expect(wrapper.vm.highlightIndex).toBe(-1);
      });
    });

    describe('When sr-only close button is enabled and activated', () => {
      it('should close the dropdown', async () => {
        await wrapper.setProps({ visuallyHiddenClose: true });

        await wrapper.findComponent(SrOnlyCloseButton).trigger('click');

        expect(anchorElement.attributes('aria-expanded') === 'false').toBe(true);
      });
    });
  });
});
