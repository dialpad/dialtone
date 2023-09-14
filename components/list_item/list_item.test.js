import { mount, createLocalVue } from '@vue/test-utils';
import DtListItem from './list_item.vue';
import { LIST_ITEM_NAVIGATION_TYPES } from './list_item_constants';

const MOCK_CLICK_STUB = vi.fn();

const baseProps = {
  id: 'dt-item',
  navigationType: LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS,
};
const baseListeners = {
  click: MOCK_CLICK_STUB,
};
const baseProvide = {
  highlightId: () => 'dt-item2',
};

let mockProps = {};
let mockListeners = {};
let mockProvide = {};
const testContext = {};

describe('DtListItem tests', () => {
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtListItem, {
      propsData: { ...baseProps, ...mockProps },
      listeners: { ...baseListeners, ...mockListeners },
      provide: { ...baseProvide, ...mockProvide },
      localVue: testContext.localVue,
    });
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockListeners = {};
    mockProvide = {};
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe('When navigation type is set to tab', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          navigationType: LIST_ITEM_NAVIGATION_TYPES.TAB,
        });
      });

      it('should apply the focusable class to the wrapper.', () => {
        expect(wrapper.classes('dt-list-item--focusable')).toBe(true);
      });

      it('should add tabindex 0 to the wrapper.', () => {
        expect(wrapper.attributes('tabindex') === '0').toBe(true);
      });
    });

    describe('When navigation type is set to none', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          navigationType: LIST_ITEM_NAVIGATION_TYPES.NONE,
        });
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
        expect(wrapper.attributes('aria-selected')).toBeUndefined();
      });
    });

    describe('When item is highlighted', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          id: 'dt-item2',
        });
      });

      it('should apply the class to the wrapper.', () => {
        expect(wrapper.classes('dt-list-item--highlighted')).toBe(true);
      });

      it('aria-selected should be set to "true"', () => {
        expect(wrapper.attributes('aria-selected') === 'true').toBe(true);
      });
    });

    describe('When item is selected', () => {
      it('should render checkmark icon', async () => {
        await wrapper.setProps({ selected: true });

        const icon = wrapper.find('[data-qa="dt-icon"]');

        expect(icon.exists()).toBe(true);
        expect(icon.classes('d-icon--check')).toBe(true);
      });
    });

    describe('When element type is provided', () => {
      it('should use the provided element type on the wrapper.', async () => {
        await wrapper.setProps({ elementType: 'div' });

        expect(wrapper.element.tagName).toBe('DIV');
      });
    });

    describe('When element type is not provided', () => {
      it('should use the default element type on the wrapper.', () => {
        expect(wrapper.element.tagName).toBe('LI');
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When "Enter" key is pressed', () => {
      beforeEach(async () => {
        await wrapper.trigger('keydown', { code: 'Enter' });
      });

      it('should call listener', async () => {
        expect(MOCK_CLICK_STUB).toHaveBeenCalled();
      });

      it('should emit click event', () => {
        expect(wrapper.emitted().click.length).toBe(1);
      });
    });

    describe('When "Space" key is pressed', () => {
      beforeEach(async () => {
        await wrapper.trigger('keydown', { code: 'Space' });
      });

      it('should call listener', async () => {
        expect(MOCK_CLICK_STUB).toHaveBeenCalled();
      });

      it('should emit click event', () => {
        expect(wrapper.emitted().click.length).toBe(1);
      });
    });

    describe('When mousemove is triggered', () => {
      it('should emit mousemove event', async () => {
        await wrapper.trigger('mousemove');

        expect(wrapper.emitted().mousemove.length).toBe(1);
      });
    });

    describe('When mouseleave is triggered', () => {
      it('should emit mouseleave event', async () => {
        await wrapper.trigger('mouseleave');

        expect(wrapper.emitted().mouseleave.length).toBe(1);
      });
    });
  });
});
