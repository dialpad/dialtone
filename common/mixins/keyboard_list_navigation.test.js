import { createLocalVue, mount } from '@vue/test-utils';
import KeyboardListNavigation, {
  KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS,
  KEYBOARD_LIST_NAVIGATION_TESTER_KEY,
} from './keyboard_list_navigation_tester';
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
    afterHighlightSpy = jest.spyOn(KeyboardListNavigation.methods, 'afterHighlightMethod').mockClear();
    beginningOfListSpy = jest.spyOn(KeyboardListNavigation.methods, 'beginningOfListMethod').mockClear();
    endOfListSpy = jest.spyOn(KeyboardListNavigation.methods, 'endOfListMethod').mockClear();
    this.localVue = createLocalVue();
  });

  beforeEach(function () {
    _mountWrapper();
  });

  // Test Teardown
  afterEach(function () {
    beginningOfListSpy.mockReset();
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

    describe(`When navigation key "${KEYBOARD_LIST_NAVIGATION_TESTER_KEY}" is pressed`, function () {
      beforeEach(function () {
        wrapper.vm.onNavigationKey(KEYBOARD_LIST_NAVIGATION_TESTER_KEY);
      });

      it('highlight is incremented by 1', function () {
        assert.strictEqual(wrapper.vm.highlightIndex, 1);
      });
    });

    describe('When "end" key is pressed', function () {
      beforeEach(function () {
        wrapper.vm.onEndKey();
      });

      it('last index is highlighted', function () {
        assert.strictEqual(wrapper.vm.highlightIndex, KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS.length - 1);
      });
    });
  });

  describe('When last item is highlighted', function () {
    // Test Setup
    beforeEach(async function () {
      wrapper.setData({ highlightIndex: KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS.length - 1 });
    });

    describe('When arrow up is pressed', function () {
      beforeEach(function () {
        wrapper.vm.onUpKey();
      });

      it('highlight is decremented by 1', function () {
        assert.strictEqual(wrapper.vm.highlightIndex, KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS.length - 2);
      });

      it('calls the expected afterHighlight function', function () {
        assert.isTrue(afterHighlightSpy.called);
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

    describe(`When navigation key "${KEYBOARD_LIST_NAVIGATION_TESTER_KEY}" is pressed`, function () {
      beforeEach(function () {
        wrapper.vm.onNavigationKey(KEYBOARD_LIST_NAVIGATION_TESTER_KEY);
      });

      it('first index is highlighted', function () {
        assert.strictEqual(wrapper.vm.highlightIndex, 0);
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
