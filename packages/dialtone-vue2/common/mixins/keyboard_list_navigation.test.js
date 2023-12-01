import { createLocalVue, mount } from '@vue/test-utils';
import KeyboardListNavigation, {
  KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS,
  KEYBOARD_LIST_NAVIGATION_TESTER_KEY,
} from './keyboard_list_navigation_tester.vue';

// Since we are testing a mixin here we use a mock vue tester component to
// render what we need to test.

describe('Keyboard Navigation Mixin Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

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
      localVue: testContext.localVue,
    });
  };

  // Test Setup
  beforeAll(() => {
    afterHighlightSpy = vi.spyOn(KeyboardListNavigation.methods, 'afterHighlightMethod').mockClear();
    beginningOfListSpy = vi.spyOn(KeyboardListNavigation.methods, 'beginningOfListMethod').mockClear();
    endOfListSpy = vi.spyOn(KeyboardListNavigation.methods, 'endOfListMethod').mockClear();
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    _mountWrapper();
  });

  // Test Teardown
  afterEach(() => {
    beginningOfListSpy.mockReset();
    slots = {};
  });

  describe('When first item is highlighted', () => {
    // Test Setup
    beforeEach(async () => {
      wrapper.setData({ highlightIndex: 0 });
    });

    describe('When arrow up is pressed', () => {
      beforeEach(() => {
        wrapper.vm.onUpKey();
      });

      it('calls the expected beginning of list function', () => {
        expect(beginningOfListSpy).toHaveBeenCalled();
      });
    });

    describe('When arrow down is pressed', () => {
      beforeEach(() => {
        wrapper.vm.onDownKey();
      });

      it('highlight is incremented by 1', () => {
        expect(wrapper.vm.highlightIndex).toBe(1);
      });

      it('calls the expected afterHighlight function', () => {
        expect(afterHighlightSpy).toHaveBeenCalled();
      });
    });

    describe(`When navigation key "${KEYBOARD_LIST_NAVIGATION_TESTER_KEY}" is pressed`, () => {
      beforeEach(() => {
        wrapper.vm.onNavigationKey(KEYBOARD_LIST_NAVIGATION_TESTER_KEY);
      });

      it('highlight is incremented by 1', () => {
        expect(wrapper.vm.highlightIndex).toBe(1);
      });
    });

    describe('When "end" key is pressed', () => {
      beforeEach(() => {
        wrapper.vm.onEndKey();
      });

      it('last index is highlighted', () => {
        expect(wrapper.vm.highlightIndex).toBe(KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS.length - 1);
      });
    });
  });

  describe('When last item is highlighted', () => {
    // Test Setup
    beforeEach(async () => {
      wrapper.setData({ highlightIndex: KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS.length - 1 });
    });

    describe('When arrow up is pressed', () => {
      beforeEach(() => {
        wrapper.vm.onUpKey();
      });

      it('highlight is decremented by 1', () => {
        expect(wrapper.vm.highlightIndex).toBe(KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS.length - 2);
      });

      it('calls the expected afterHighlight function', () => {
        expect(afterHighlightSpy).toHaveBeenCalled();
      });
    });

    describe('When arrow down is pressed', () => {
      beforeEach(() => {
        wrapper.vm.onDownKey();
      });

      it('calls the expected end of list function', () => {
        expect(endOfListSpy).toHaveBeenCalled();
      });
    });

    describe(`When navigation key "${KEYBOARD_LIST_NAVIGATION_TESTER_KEY}" is pressed`, () => {
      beforeEach(() => {
        wrapper.vm.onNavigationKey(KEYBOARD_LIST_NAVIGATION_TESTER_KEY);
      });

      it('first index is highlighted', () => {
        expect(wrapper.vm.highlightIndex).toBe(0);
      });
    });

    describe('When "home" key is pressed', () => {
      beforeEach(() => {
        wrapper.vm.onHomeKey();
      });

      it('first index is highlighted', () => {
        expect(wrapper.vm.highlightIndex).toBe(0);
      });
    });
  });
});
