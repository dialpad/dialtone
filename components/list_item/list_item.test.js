import sinon from 'sinon';
import { assert } from 'chai';
import { mount, createLocalVue } from '@vue/test-utils';
import DtListItem from './list_item.vue';
import { LIST_ITEM_NAVIGATION_TYPES } from './list_item_constants.js';

describe('Dialtone Vue ListItem tests', function () {
  // Wrappers
  let wrapper;

  // Test Environment
  let propsData;
  let slots;
  let listeners;
  let provide;
  let clickStub;
  let setHighlightStub;

  const _mountWrapper = () => {
    wrapper = mount(DtListItem, {
      propsData,
      slots,
      listeners,
      provide,
      localVue: this.localVue,
    });
  };

  // Test Setup
  before(function () {
    this.localVue = createLocalVue();
  });

  beforeEach(function () {
    clickStub = sinon.stub();
    setHighlightStub = sinon.stub();
    listeners = { click: clickStub };
    _mountWrapper();
  });

  // Test Teardown
  afterEach(function () {
    propsData = {};
    slots = {};
  });

  describe('Presentation Tests', function () {
    it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });

    describe('When navigation type is set to tab', function () {
      // Test Setup
      beforeEach(async function () {
        await wrapper.setProps({ navigationType: LIST_ITEM_NAVIGATION_TYPES.TAB });
      });

      it('should apply the focusable class to the wrapper.', function () {
        assert.isTrue(wrapper.classes('dt-list-item--focusable'));
      });
      it('should add tabindex 0 to the wrapper.', function () {
        assert.isTrue(wrapper.attributes('tabindex') === '0');
      });
    });

    describe('When navigation type is set to none', function () {
      // Test Setup
      beforeEach(async function () {
        await wrapper.setProps({ navigationType: LIST_ITEM_NAVIGATION_TYPES.NONE });
      });

      it('should not apply the classes to the wrapper.', function () {
        assert.isFalse(wrapper.classes('dt-list-item--focusable'));
        assert.isFalse(wrapper.classes('dt-list-item--highlighted'));
      });
      it('should add tabindex -1 to the wrapper.', function () {
        assert.isTrue(wrapper.attributes('tabindex') === '-1');
      });
    });

    describe('When item is not highlighted', function () {
      // Test Setup
      beforeEach(async function () {
        await wrapper.setProps({ isHighlighted: false });
      });

      it('should not apply the class to the wrapper.', function () {
        assert.isFalse(wrapper.classes('dt-list-item--highlighted'));
      });
      it('aria-selected should not be set', function () {
        assert.isUndefined(wrapper.attributes('aria-selected'));
      });
    });

    describe('When item is highlighted', function () {
      // Test Setup
      beforeEach(async function () {
        await wrapper.setProps({ isHighlighted: true });
      });

      it('should apply the class to the wrapper.', function () {
        assert.isTrue(wrapper.classes('dt-list-item--highlighted'));
      });
      it('aria-selected should be set to "true"', function () {
        assert.isTrue(wrapper.attributes('aria-selected') === 'true');
      });
    });

    describe('When element type is provided', function () {
      // Test Setup
      beforeEach(async function () {
        await wrapper.setProps({ elementType: 'div' });
      });

      it('should use the provided element type on the wrapper.', function () {
        assert.isTrue(wrapper.is('div'));
      });
    });

    describe('When element type is not provided', function () {
      it('should use the default element type on the wrapper.', function () {
        assert.isTrue(wrapper.is('li'));
      });
    });
  });

  describe('Interactivity Tests', function () {
    // Shared Examples
    const itBehavesLikeHandlesClick = () => {
      it('should call listener', async function () {
        assert.isTrue(clickStub.called);
      });

      it('should emit click event', function () {
        assert.equal(wrapper.emitted().click.length, 1);
      });
    };

    describe('When list item is clicked', function () {
      beforeEach(async function () {
        await wrapper.trigger('click');
      });

      itBehavesLikeHandlesClick();
    });

    describe('When "Enter" key is pressed', function () {
      beforeEach(async function () {
        await wrapper.trigger('keydown.enter');
      });

      itBehavesLikeHandlesClick();
    });

    describe('When "Space" key is pressed', function () {
      beforeEach(async function () {
        await wrapper.trigger('keydown.space');
      });

      itBehavesLikeHandlesClick();
    });

    describe('When mousemove is detected but item is not highlightable', function () {
      // Test Setup
      beforeEach(async function () {
        await wrapper.setProps({ setHighlight: null });
        await wrapper.trigger('mousemove');
      });

      it('should not call setHighlight', function () {
        assert.equal(setHighlightStub.callCount, 0);
      });
    });

    describe('When mousemove is detected and item is highlightable', function () {
      // Test Setup
      beforeEach(async function () {
        await wrapper.setProps({
          setHighlight: setHighlightStub,
          navigationType: LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS,
        });
        await wrapper.trigger('mousemove');
      });

      it('should call setHighlight once', function () {
        assert.equal(setHighlightStub.callCount, 1);
      });
    });
  });
});
