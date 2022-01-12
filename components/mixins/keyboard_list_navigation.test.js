import { createLocalVue, mount } from '@vue/test-utils';
import KeyboardListNavigation from './keyboard_list_navigation_tester';
import sinon from 'sinon';
import { assert } from 'chai';

// Since we are testing a mixin here we use a mock vue tester component to
// render what we need to test.

describe('Keyboard Navigation Mixin Tests', function () {
  // Wrappers
  let wrapper;

  // Test Environment
  let propsData;
  let attrs;
  let slots;
  let listeners;
  let afterHighlightSpy;
  let beginningOfListSpy;
  let endOfListSpy;

  const _mountWrapper = () => {
    wrapper = mount(KeyboardListNavigation, {
      propsData,
      attrs,
      slots,
      listeners,
      localVue: this.localVue,
    });
  };

  // Test Setup
  before(function () {
    afterHighlightSpy = sinon.spy(KeyboardListNavigation.methods, 'afterHighlightMethod');
    beginningOfListSpy = sinon.spy(KeyboardListNavigation.methods, 'beginningOfListMethod');
    endOfListSpy = sinon.spy(KeyboardListNavigation.methods, 'endOfListMethod');
    this.localVue = createLocalVue();
  });

  beforeEach(function () {
    _mountWrapper();
  });

  // Test Teardown
  afterEach(function () {
    beginningOfListSpy.resetHistory();
    slots = {};
  });

  describe('When first item is highlighted', function () {
    // Test Setup
    beforeEach(async function () {
      wrapper.setData({ highlightIndex: 0 });
    });

    describe('When arrow up is pressed', function () {
      beforeEach(function () {
        wrapper.vm.onUpKey();
      });

      it('calls the expected beginning of list function', function () {
        assert.isTrue(beginningOfListSpy.called);
      });
    });

    describe('When arrow down is pressed', function () {
      beforeEach(function () {
        wrapper.vm.onDownKey();
      });

      it('highlight is incremented by 1', function () {
        assert.strictEqual(wrapper.vm.highlightIndex, 1);
      });

      it('calls the expected afterHighlight function', function () {
        assert.isTrue(afterHighlightSpy.called);
      });
    });

    describe('When "end" key is pressed', function () {
      beforeEach(function () {
        wrapper.vm.onEndKey();
      });

      it('last index is highlighted', function () {
        assert.strictEqual(wrapper.vm.highlightIndex, 2);
      });
    });
  });

  describe('When last item is highlighted', function () {
    // Test Setup
    beforeEach(async function () {
      wrapper.setData({ highlightIndex: 2 });
    });

    describe('When arrow up is pressed', function () {
      beforeEach(function () {
        wrapper.vm.onUpKey();
      });

      it('highlight is decremented by 1', function () {
        assert.strictEqual(wrapper.vm.highlightIndex, 1);
      });
    });

    describe('When arrow down is pressed', function () {
      beforeEach(function () {
        wrapper.vm.onDownKey();
      });

      it('calls the expected end of list function', function () {
        assert.isTrue(endOfListSpy.called);
      });
    });

    describe('When "home" key is pressed', function () {
      beforeEach(function () {
        wrapper.vm.onHomeKey();
      });

      it('first index is highlighted', function () {
        assert.strictEqual(wrapper.vm.highlightIndex, 0);
      });
    });
  });
});
