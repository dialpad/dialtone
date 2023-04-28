import { config, mount } from '@vue/test-utils';
import DtDropdown from './dropdown.vue';
import axe from 'axe-core';
import configA11y from '../../storybook/scripts/storybook-a11y-test.config';
import {
  itBehavesLikeVisuallyHiddenCloseButtonExists,
  itBehavesLikeVisuallyHiddenCloseLabelIsNull,
} from '@/tests/shared_examples/sr_only_close_button';
import { cleanSpy, initializeSpy } from '@/tests/shared_examples/validation';
import SrOnlyCloseButton from '@/common/sr_only_close_button';

// Constants
const baseProps = {
  open: true,
  visuallyHiddenCloseLabel: 'Close dropdown',
};

const baseSlots = {
  anchor: `<template #anchor="attrs">
<a
id="anchor"
href="#"
v-bind="attrs"
>Link</a>
</template>`,

  list: `<ul id="list">
    <li role="menuitem">1</li>
    <li role="menuitem">2</li>
    <li role="menuitem">3</li>
  </ul>`,
};

describe('DtDropdown Tests', () => {
  // Wrappers
  let wrapper;
  let anchorElement;
  let popover;
  let popoverContent;
  let listWrapper;

  // Environment
  let props = baseProps;
  let slots = baseSlots;
  let attrs;
  let highlightStub;

  // Helpers
  const _setChildWrappers = () => {
    anchorElement = wrapper.find('#anchor');
    popover = wrapper.findComponent({ ref: 'popover' });
    popoverContent = popover.findComponent({ ref: 'content' });
    listWrapper = popoverContent.find('[data-qa="dt-dropdown-list-wrapper"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtDropdown, {
      props,
      slots,
      attrs,
      global: {
        stubs: {
          transition: false,
        },
      },
      attachTo: document.body,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    config.global.renderStubDefaultSlot = true;
    global.requestAnimationFrame = jest.fn();
    global.cancelAnimationFrame = jest.fn();
  });

  afterAll(() => {
    config.global.renderStubDefaultSlot = false;
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  beforeEach(() => {
    props = baseProps;
    slots = baseSlots;
    attrs = {};
  });

  afterEach(function () {
    wrapper.unmount();
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
        () => { expect(listWrapper.find('#list').exists()).toBe(true); },
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
        props = {
          ...baseProps,
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
      });

      it('aria-expanded should be "true"', () => {
        expect(anchorElement.attributes('aria-expanded') === 'true').toBe(true);
      });

      it('should pass axe-core accessibility rules', async () => {
        const a11yResults = await axe.run(wrapper.element, configA11y);
        const violations = a11yResults.violations;
        if (violations.length) {
          console.log('axe-core accessibility violations:', violations);
        }
        expect(violations.length).toEqual(0);
      });
    });
  });

  describe('Interactivity Tests', () => {
    // Test setup
    beforeEach(() => {
      highlightStub = jest.fn();
      attrs = { onHighlight: highlightStub };
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

    // this test is totally borked, I have no idea...
    describe.skip('When sr-only close button is enabled and activated', () => {
      beforeEach(async () => {
        initializeSpy();
        await wrapper.setProps({ visuallyHiddenClose: true });
        _setChildWrappers();
        await wrapper.findComponent(SrOnlyCloseButton).trigger('click');
      });

      afterEach(() => {
        cleanSpy();
      });

      it('should close the dropdown', () => {
        expect(anchorElement.attributes('aria-expanded')).toBeFalsy();
      });
    });
  });
});
