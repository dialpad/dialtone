import { assert } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import DtDropdown from './dropdown.vue';
import sinon from 'sinon';
import axe from 'axe-core';
import configA11y from '../../storybook/scripts/storybook-a11y-test.config';

// Constants
const basePropsData = {
  open: true,
};

const baseSlots = {
  anchor: '<a href="#" id="anchor">Link</a>',
  list: `<ul id="list">
    <li role="menuitem">1</li>
    <li role="menuitem">2</li>
    <li role="menuitem">3</li>
  </ul>`,
};

describe('Dialtone Vue Dropdown Tests', function () {
  // Wrappers
  let wrapper;
  let anchorElement;
  let listWrapper;

  // Environment
  let propsData = basePropsData;
  let slots = baseSlots;
  let scopedSlots = {};
  let listeners;
  let highlightStub;

  // Helpers
  const _setChildWrappers = () => {
    anchorElement = wrapper.find('#anchor');
    listWrapper = wrapper.find('[data-qa="dt-dropdown-list-wrapper"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtDropdown, {
      propsData,
      slots,
      scopedSlots,
      listeners,
      localVue: this.localVue,
      stubs: {
        transition: false,
      },
      attachTo: document.body,
    });
    _setChildWrappers();
  };

  // Setup
  before(function () {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = sinon.spy();
    global.cancelAnimationFrame = sinon.spy();
    this.localVue = createLocalVue();
  });

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
    slots = baseSlots;
    scopedSlots = {};
    listeners = {};
    wrapper.destroy();
  });

  after(function () {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', function () {
    // Test setup
    beforeEach(function () {
      _setWrappers();
    });

    it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });

    describe('When a list is provided', function () {
      it('should render the list wrapper', function () { assert.isTrue(listWrapper.exists()); });
      it('should render the anchor', function () { assert.isTrue(anchorElement.exists()); });
      it('should render the list', function () { assert.isTrue(wrapper.find('#list').exists()); });
    });
  });

  describe('Accessibility Tests', function () {
    describe('When the dropdown is not open', function () {
      // Test setup
      beforeEach(function () {
        propsData = {
          ...basePropsData,
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
        scopedSlots = {
          anchor: `<template #anchor="{ attrs }"><a href="#" id="anchor" v-bind="attrs">Link</a></template>`,
        };
        _setWrappers();
        wrapper.vm.$nextTick();
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
      listeners = { highlight: highlightStub };
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
  });
});
