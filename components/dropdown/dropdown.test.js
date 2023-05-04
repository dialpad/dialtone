import { createLocalVue, mount } from '@vue/test-utils';
import DtDropdown from './dropdown.vue';
import {
  itBehavesLikeVisuallyHiddenCloseButtonExists,
  itBehavesLikeVisuallyHiddenCloseLabelIsNull,
} from '@/tests/shared_examples/sr_only_close_button';
import { cleanSpy, initializeSpy } from '@/tests/shared_examples/validation';
import SrOnlyCloseButton from '@/common/sr_only_close_button';

// Constants
const basePropsData = {
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

const baseScopedSlots = {
  anchor: `<template #anchor="{ attrs }"><a href="#" id="anchor" v-bind="attrs">Link</a></template>`,
};

describe('DtDropdown Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let anchorElement;
  let listWrapper;

  // Environment
  let propsData = basePropsData;
  let slots = baseSlots;
  let scopedSlots = baseScopedSlots;
  let listeners;
  let highlightStub;

  // Helpers
  const _setChildWrappers = () => {
    anchorElement = wrapper.find('#anchor');
    listWrapper = wrapper.find('[data-qa="dt-dropdown-list-wrapper"]');
  };

  const transitionStub = () => ({
    render: function (h) {
      return this.$options._renderChildren;
    },
  });

  const _setWrappers = () => {
    wrapper = mount(DtDropdown, {
      propsData,
      slots,
      scopedSlots,
      listeners,
      localVue: testContext.localVue,
      stubs: {
        transition: transitionStub(),
      },
      attachTo: document.body,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = jest.fn();
    global.cancelAnimationFrame = jest.fn();
    testContext.localVue = createLocalVue();
  });

  // Teardown
  afterEach(() => {
    propsData = basePropsData;
    slots = baseSlots;
    scopedSlots = baseScopedSlots;
    listeners = {};
    wrapper.destroy();
  });

  afterAll(() => {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', () => {
    // Test setup
    beforeEach(() => {
      _setWrappers();
    });

    it(
      'should render the component',
      () => { expect(wrapper.exists()).toBe(true); },
    );

    it('should not render the visually hidden close button', async () => {
      itBehavesLikeVisuallyHiddenCloseButtonExists(wrapper, false);
    });

    describe('When a list is provided', () => {
      it(
        'should render the list wrapper',
        () => { expect(listWrapper.exists()).toBe(true); },
      );
      it(
        'should render the anchor',
        () => { expect(anchorElement.exists()).toBe(true); },
      );
      it(
        'should render the list',
        () => { expect(wrapper.find('#list').exists()).toBe(true); },
      );
    });

    describe('When visuallyHiddenClose is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ visuallyHiddenClose: true });
      });

      it('should contain a visually hidden close button', () => {
        itBehavesLikeVisuallyHiddenCloseButtonExists(wrapper);
      });

      describe('When visuallyHiddenCloseLabel is null', () => {
        beforeEach(async () => {
          initializeSpy();
          await wrapper.setProps({ visuallyHiddenCloseLabel: null });
        });

        afterEach(() => {
          cleanSpy();
        });

        itBehavesLikeVisuallyHiddenCloseLabelIsNull();
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When the dropdown is not open', () => {
      // Test setup
      beforeEach(() => {
        propsData = {
          ...basePropsData,
          open: false,
        };
        _setWrappers();
      });

      it('aria-expanded should be "false"', () => {
        expect(anchorElement.attributes('aria-expanded') === 'false').toBe(true);
      });
    });

    describe('When the dropdown is open', () => {
      // Test setup
      beforeEach(() => {
        _setWrappers();
        wrapper.vm.$nextTick();
      });

      it('aria-expanded should be "true"', () => {
        expect(anchorElement.attributes('aria-expanded') === 'true').toBe(true);
      });
    });
  });

  describe('Interactivity Tests', () => {
    // Test setup
    beforeEach(() => {
      highlightStub = jest.fn();
      listeners = { highlight: highlightStub };
      _setWrappers();
    });

    describe('When the highlightIndex changes', () => {
      beforeEach(async () => {
        wrapper.vm.setHighlightIndex(1);
        await wrapper.vm.$nextTick();
      });

      it(
        'should call listener',
        () => { expect(highlightStub).toHaveBeenCalled(); },
      );
      it(
        'should emit highlight event',
        () => { expect(wrapper.emitted().highlight.length).toEqual(1); },
      );
    });

    describe('When mouseleave is detected on the list wrapper', () => {
      // Test Setup
      beforeEach(async () => {
        await listWrapper.trigger('mouseleave');
      });

      it(
        'should reset the highlightIndex',
        () => { expect(wrapper.vm.highlightIndex).toEqual(-1); },
      );
    });

    describe('When sr-only close button is enabled and activated', () => {
      beforeEach(async () => {
        await wrapper.setProps({ visuallyHiddenClose: true });
        _setChildWrappers();
        await wrapper.findComponent(SrOnlyCloseButton).trigger('click');
      });

      it('should close the dropdown', () => {
        expect(anchorElement.attributes('aria-expanded') === 'false').toBe(true);
      });
    });
  });
});
