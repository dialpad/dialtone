import { mount, createLocalVue } from '@vue/test-utils';
import DtItemLayout from './item_layout.vue';

describe('DtItemLayout tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let leftWrapper;
  let rightWrapper;
  let subtitleWrapper;
  let bottomWrapper;

  // Helpers
  const _setChildWrappers = () => {
    leftWrapper = wrapper.find('[data-qa="dt-item-layout-left-wrapper"]');
    rightWrapper = wrapper.find('[data-qa="dt-item-layout-right-wrapper"]');
    subtitleWrapper = wrapper.find('[data-qa="dt-item-layout-subtitle-wrapper"]');
    bottomWrapper = wrapper.find('[data-qa="dt-item-layout-bottom-wrapper"]');
  };

  // Test Environment
  let slots;

  const _mountWrapper = () => {
    wrapper = mount(DtItemLayout, {
      slots,
    });
  };

  // Test Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    _mountWrapper();
  });

  // Test Teardown
  afterEach(() => {
    slots = {};
  });

  describe('Presentation Tests', () => {
    describe('When none of the slot contents are provided', () => {
      // Test Setup
      beforeEach(async () => {
        _mountWrapper();
        _setChildWrappers();
      });

      it(
        'should not render the left slot wrapper',
        () => { expect(leftWrapper.exists()).toBe(false); },
      );
      it(
        'should not render the right slot wrapper',
        () => { expect(rightWrapper.exists()).toBe(false); },
      );
      it(
        'should not render the subtitle slot wrapper',
        () => { expect(subtitleWrapper.exists()).toBe(false); },
      );
      it(
        'should not render the bottom slot wrapper',
        () => { expect(bottomWrapper.exists()).toBe(false); },
      );
    });

    describe('When left content is provided', () => {
      // Test Setup
      beforeEach(async () => {
        slots = { left: 'left' };
        _mountWrapper();
        _setChildWrappers();
      });

      it(
        'should render the slot wrapper',
        () => { expect(leftWrapper.exists()).toBe(true); },
      );
      it(
        'should render the provided content',
        () => { expect(wrapper.text().includes('left')).toBe(true); },
      );
    });

    describe('When right content is provided', () => {
      // Test Setup
      beforeEach(async () => {
        slots = { right: 'right' };
        _mountWrapper();
        _setChildWrappers();
      });

      it(
        'should render the slot wrapper',
        () => { expect(rightWrapper.exists()).toBe(true); },
      );
      it(
        'should render the provided content',
        () => { expect(wrapper.text().includes('right')).toBe(true); },
      );
    });

    describe('When subtitle content is provided', () => {
      // Test Setup
      beforeEach(async () => {
        slots = { subtitle: 'subtitle' };
        _mountWrapper();
        _setChildWrappers();
      });

      it(
        'should render the slot wrapper',
        () => { expect(subtitleWrapper.exists()).toBe(true); },
      );
      it(
        'should render the provided content',
        () => { expect(wrapper.text().includes('subtitle')).toBe(true); },
      );
    });

    describe('When bottom content is provided', () => {
      // Test Setup
      beforeEach(async () => {
        slots = { bottom: 'bottom' };
        _mountWrapper();
        _setChildWrappers();
      });

      it(
        'should render the slot wrapper',
        () => { expect(bottomWrapper.exists()).toBe(true); },
      );
      it(
        'should render the provided content',
        () => { expect(wrapper.text().includes('bottom')).toBe(true); },
      );
    });

    describe('When selected content is provided', () => {
      // Test Setup
      beforeEach(async () => {
        slots = { selected: 'selected' };
        _mountWrapper();
        _setChildWrappers();
      });

      it(
        'should render the provided content',
        () => { expect(wrapper.text().includes('selected')).toBe(true); },
      );
    });
  });
});
