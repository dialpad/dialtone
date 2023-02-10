import sinon from 'sinon';
import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtListItem from './list_item.vue';
import { LIST_ITEM_NAVIGATION_TYPES } from './list_item_constants.js';

const baseProps = {
  id: 'dt-item',
  navigationType: LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS,
};

describe('DtListItem tests', function () {
  // Wrappers
  let wrapper;

  // Test Environment
  let props = baseProps;
  let slots;
  let attrs;
  let provide;
  let clickStub;

  const _mountWrapper = () => {
    wrapper = mount(DtListItem, {
      props,
      slots,
      attrs,
      global: {
        provide,
      },
    });
  };

  // Test Setup
  beforeEach(function () {
    clickStub = sinon.stub();
    attrs = { onClick: clickStub };
    provide = { highlightId: () => 'dt-item2' };
    _mountWrapper();
  });

  // Test Teardown
  afterEach(function () {
    props = baseProps;
    slots = {};
    attrs = {};
    provide = {};
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
      it('should not apply the class to the wrapper.', function () {
        assert.isFalse(wrapper.classes('dt-list-item--highlighted'));
      });
      it('aria-selected should be set to "false"', function () {
        assert.isTrue(wrapper.attributes('aria-selected') === 'false');
      });
    });

    describe('When item is highlighted', function () {
      // Test Setup
      beforeEach(async function () {
        await wrapper.setProps({ id: 'dt-item2' });
      });

      it('should apply the class to the wrapper.', function () {
        assert.isTrue(wrapper.classes('dt-list-item--highlighted'));
      });
      it('aria-selected should be set to "true"', function () {
        assert.isTrue(wrapper.attributes('aria-selected') === 'true');
      });
    });

    describe('When item is selected', function () {
      beforeEach(async function () {
        await wrapper.setProps({ selected: true });
      });

      it('should render checkmark icon', function () {
        const icon = wrapper.find('[data-qa="dt-icon"]');

        assert.isTrue(icon.exists());
        assert.isTrue(icon.classes('d-icon--check'));
      });
    });

    describe('When element type is provided', function () {
      // Test Setup
      beforeEach(async function () {
        await wrapper.setProps({ elementType: 'div' });
      });

      it('should use the provided element type on the wrapper.', function () {
        assert.equal(wrapper.element.tagName, 'DIV');
      });
    });

    describe('When element type is not provided', function () {
      it('should use the default element type on the wrapper.', function () {
        assert.equal(wrapper.element.tagName, 'LI');
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

    describe('When "Enter" key is pressed', function () {
      beforeEach(async function () {
        await wrapper.trigger('keydown', { code: 'Enter' });
      });

      itBehavesLikeHandlesClick();
    });

    describe('When "Space" key is pressed', function () {
      beforeEach(async function () {
        await wrapper.trigger('keydown', { code: 'Space' });
      });

      itBehavesLikeHandlesClick();
    });

    describe('When mousemove is triggered', function () {
      beforeEach(async function () {
        await wrapper.trigger('mousemove');
      });

      it('should emit mousemove event', function () {
        assert.equal(wrapper.emitted().mousemove.length, 1);
      });
    });

    describe('When mouseleave is triggered', function () {
      beforeEach(async function () {
        await wrapper.trigger('mouseleave');
      });

      it('should emit mouseleave event', function () {
        assert.equal(wrapper.emitted().mouseleave.length, 1);
      });
    });
  });
});
