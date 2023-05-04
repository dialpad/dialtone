import { mount } from '@vue/test-utils';
import DtListItem from './list_item.vue';
import { LIST_ITEM_NAVIGATION_TYPES } from './list_item_constants';

const baseProps = {
  id: 'dt-item',
  navigationType: LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS,
};

describe('DtListItem tests', () => {
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
    clickStub = jest.fn();
    attrs = { onClick: clickStub };
    provide = { highlightId: () => 'dt-item2' };
    _mountWrapper();
  });

  // Test Teardown
  afterEach(() => {
    props = baseProps;
    slots = {};
    attrs = {};
    provide = {};
  });

  describe('Presentation Tests', () => {
    it(
      'should render the component',
      () => { expect(wrapper.exists()).toBe(true); },
    );

    describe('When navigation type is set to tab', () => {
      // Test Setup
      beforeEach(async () => {
        await wrapper.setProps({ navigationType: LIST_ITEM_NAVIGATION_TYPES.TAB });
      });

      it('should apply the focusable class to the wrapper.', () => {
        expect(wrapper.classes('dt-list-item--focusable')).toBe(true);
      });
      it('should add tabindex 0 to the wrapper.', () => {
        expect(wrapper.attributes('tabindex') === '0').toBe(true);
      });
    });

    describe('When navigation type is set to none', () => {
      // Test Setup
      beforeEach(async () => {
        await wrapper.setProps({ navigationType: LIST_ITEM_NAVIGATION_TYPES.NONE });
      });

      it('should not apply the classes to the wrapper.', () => {
        expect(wrapper.classes('dt-list-item--focusable')).toBe(false);
        expect(wrapper.classes('dt-list-item--highlighted')).toBe(false);
      });
      it('should add tabindex -1 to the wrapper.', () => {
        expect(wrapper.attributes('tabindex') === '-1').toBe(true);
      });
    });

    describe('When item is not highlighted', () => {
      it('should not apply the class to the wrapper.', () => {
        expect(wrapper.classes('dt-list-item--highlighted')).toBe(false);
      });
      it('aria-selected should not be set', () => {
        expect(wrapper.attributes('aria-selected')).toBe('false');
      });
    });

    describe('When item is highlighted', () => {
      // Test Setup
      beforeEach(async () => {
        await wrapper.setProps({ id: 'dt-item2' });
      });

      it('should apply the class to the wrapper.', () => {
        expect(wrapper.classes('dt-list-item--highlighted')).toBe(true);
      });
      it('aria-selected should be set to "true"', () => {
        expect(wrapper.attributes('aria-selected') === 'true').toBe(true);
      });
    });

    describe('When item is selected', () => {
      beforeEach(async () => {
        await wrapper.setProps({ selected: true });
      });

      it('should render checkmark icon', () => {
        const icon = wrapper.find('[data-qa="dt-icon"]');

        expect(icon.exists()).toBe(true);
        expect(icon.classes('d-icon--check')).toBe(true);
      });
    });

    describe('When element type is provided', () => {
      // Test Setup
      beforeEach(async () => {
        await wrapper.setProps({ elementType: 'div' });
      });

      it('should use the provided element type on the wrapper.', () => {
        expect(wrapper.element.tagName).toEqual('DIV');
      });
    });

    describe('When element type is not provided', () => {
      it('should use the default element type on the wrapper.', () => {
        expect(wrapper.element.tagName).toEqual('LI');
      });
    });
  });

  describe('Interactivity Tests', () => {
    // Shared Examples
    const itBehavesLikeHandlesClick = () => {
      it('should call listener', async () => {
        expect(clickStub).toHaveBeenCalled();
      });

      it('should emit click event', () => {
        expect(wrapper.emitted().click.length).toEqual(1);
      });
    };

    describe('When "Enter" key is pressed', () => {
      beforeEach(async () => {
        await wrapper.trigger('keydown', { code: 'Enter' });
      });

      itBehavesLikeHandlesClick();
    });

    describe('When "Space" key is pressed', () => {
      beforeEach(async () => {
        await wrapper.trigger('keydown', { code: 'Space' });
      });

      itBehavesLikeHandlesClick();
    });

    describe('When mousemove is triggered', () => {
      beforeEach(async () => {
        await wrapper.trigger('mousemove');
      });

      it('should emit mousemove event', () => {
        expect(wrapper.emitted().mousemove.length).toEqual(1);
      });
    });

    describe('When mouseleave is triggered', () => {
      beforeEach(async () => {
        await wrapper.trigger('mouseleave');
      });

      it('should emit mouseleave event', () => {
        expect(wrapper.emitted().mouseleave.length).toEqual(1);
      });
    });
  });
});
