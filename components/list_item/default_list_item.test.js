import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtDefaultListItem from './default_list_item.vue';

describe('DtDefaultListItem tests', function () {
  // Wrappers
  let wrapper;
  let leftWrapper;
  let rightWrapper;
  let subtitleWrapper;
  let bottomWrapper;

  // Helpers
  const _setChildWrappers = () => {
    leftWrapper = wrapper.find('[data-qa="dt-default-list-item-left-wrapper"]');
    rightWrapper = wrapper.find('[data-qa="dt-default-list-item-right-wrapper"]');
    subtitleWrapper = wrapper.find('[data-qa="dt-default-list-item-subtitle-wrapper"]');
    bottomWrapper = wrapper.find('[data-qa="dt-default-list-item-bottom-wrapper"]');
  };

  // Test Environment
  let slots;

  const _mountWrapper = () => {
    wrapper = mount(DtDefaultListItem, {
      slots,
    });
  };

  // Test Setup
  beforeEach(function () {
    _mountWrapper();
  });

  // Test Teardown
  afterEach(function () {
    slots = {};
  });

  describe('Presentation Tests', function () {
    describe('When none of the slot contents are provided', function () {
      // Test Setup
      beforeEach(async function () {
        _mountWrapper();
        _setChildWrappers();
      });

      it('should not render the left slot wrapper', function () { assert.isFalse(leftWrapper.exists()); });
      it('should not render the right slot wrapper', function () { assert.isFalse(rightWrapper.exists()); });
      it('should not render the subtitle slot wrapper', function () { assert.isFalse(subtitleWrapper.exists()); });
      it('should not render the bottom slot wrapper', function () { assert.isFalse(bottomWrapper.exists()); });
    });

    describe('When left content is provided', function () {
      // Test Setup
      beforeEach(async function () {
        slots = { left: 'left' };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should render the slot wrapper', function () { assert.isTrue(leftWrapper.exists()); });
      it('should render the provided content', function () { assert.isTrue(wrapper.text().includes('left')); });
    });

    describe('When right content is provided', function () {
      // Test Setup
      beforeEach(async function () {
        slots = { right: 'right' };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should render the slot wrapper', function () { assert.isTrue(rightWrapper.exists()); });
      it('should render the provided content', function () { assert.isTrue(wrapper.text().includes('right')); });
    });

    describe('When subtitle content is provided', function () {
      // Test Setup
      beforeEach(async function () {
        slots = { subtitle: 'subtitle' };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should render the slot wrapper', function () { assert.isTrue(subtitleWrapper.exists()); });
      it('should render the provided content', function () { assert.isTrue(wrapper.text().includes('subtitle')); });
    });

    describe('When bottom content is provided', function () {
      // Test Setup
      beforeEach(async function () {
        slots = { bottom: 'bottom' };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should render the slot wrapper', function () { assert.isTrue(bottomWrapper.exists()); });
      it('should render the provided content', function () { assert.isTrue(wrapper.text().includes('bottom')); });
    });

    describe('When selected content is provided', function () {
      // Test Setup
      beforeEach(async function () {
        slots = { selected: 'selected' };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should render the provided content', function () { assert.isTrue(wrapper.text().includes('selected')); });
    });
  });
});
