import { assert } from 'chai';
import { config, mount } from '@vue/test-utils';
import DtDropdown from './dropdown.vue';
import sinon from 'sinon';
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
  anchor: '<a href="#" id="anchor">Link</a>',
  list: `<ul id="list">
    <li role="menuitem">1</li>
    <li role="menuitem">2</li>
    <li role="menuitem">3</li>
  </ul>`,
};

describe('DtDropdown Tests', function () {
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
  before(function () {
    config.global.renderStubDefaultSlot = true;
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = sinon.spy();
    global.cancelAnimationFrame = sinon.spy();
  });

  // Test Teardown
  after(function () {
    config.global.renderStubDefaultSlot = false;
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  afterEach(function () {
    props = baseProps;
    slots = baseSlots;
    attrs = {};
    wrapper.unmount();
  });

  describe('Presentation Tests', function () {
    // Test setup
    beforeEach(function () {
      _setWrappers();
    });

    it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });

    it('should not render the visually hidden close button', async function () {
      itBehavesLikeVisuallyHiddenCloseButtonExists(wrapper, false);
    });

    describe('When a list is provided', function () {
      it('should render the list wrapper', function () { assert.isTrue(listWrapper.exists()); });
      it('should render the anchor', function () { assert.isTrue(anchorElement.exists()); });
      it('should render the list', function () { assert.isTrue(listWrapper.find('#list').exists()); });
    });

    describe('When visuallyHiddenClose is true', function () {
      beforeEach(async function () {
        await wrapper.setProps({ visuallyHiddenClose: true });
      });

      it('should contain a visually hidden close button', function () {
        itBehavesLikeVisuallyHiddenCloseButtonExists(wrapper);
      });

      describe('When visuallyHiddenCloseLabel is null', function () {
        beforeEach(async function () {
          initializeSpy();
          await wrapper.setProps({ visuallyHiddenCloseLabel: null });
        });

        afterEach(function () {
          cleanSpy();
        });

        itBehavesLikeVisuallyHiddenCloseLabelIsNull();
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('When the dropdown is not open', function () {
      // Test setup
      beforeEach(function () {
        props = {
          ...baseProps,
          open: false,
        };
        _setWrappers();
      });

      it('aria-expanded should be "false"', function () {
        assert.isTrue(anchorElement.attributes('aria-expanded') === 'false');
      });
    });

    describe('When the dropdown is open', function () {
      // Test setup
      beforeEach(function () {
        slots = {
          anchor: `<template #anchor="attrs"><a href="#" id="anchor" v-bind="attrs">Link</a></template>`,
        };
        _setWrappers();
      });

      it('aria-expanded should be "true"', function () {
        assert.isTrue(anchorElement.attributes('aria-expanded') === 'true');
      });

      it('should pass axe-core accessibility rules', async function () {
        const a11yResults = await axe.run(wrapper.element, configA11y);
        const violations = a11yResults.violations;
        if (violations.length) {
          console.log('axe-core accessibility violations:', violations);
        }
        assert.equal(violations.length, 0);
      });
    });
  });

  describe('Interactivity Tests', function () {
    // Test setup
    beforeEach(function () {
      highlightStub = sinon.stub();
      attrs = { onHighlight: highlightStub };
      _setWrappers();
    });

    describe('When the highlightIndex changes', function () {
      beforeEach(async function () {
        wrapper.vm.setHighlightIndex(1);
        await wrapper.vm.$nextTick();
      });

      it('should call listener', function () { assert.isTrue(highlightStub.called); });
      it('should emit highlight event', function () { assert.equal(wrapper.emitted().highlight.length, 1); });
    });

    describe('When mouseleave is detected on the list wrapper', function () {
      // Test Setup
      beforeEach(async function () {
        await listWrapper.trigger('mouseleave');
      });

      it('should reset the highlightIndex', function () { assert.equal(wrapper.vm.highlightIndex, -1); });
    });

    describe('When sr-only close button is enabled and activated', function () {
      beforeEach(async function () {
        await wrapper.setProps({ visuallyHiddenClose: true });
        _setChildWrappers();
        await wrapper.findComponent(SrOnlyCloseButton).trigger('click');
      });

      it('should close the dropdown', function () {
        assert.isTrue(anchorElement.attributes('aria-expanded') === 'false');
      });
    });
  });
});
