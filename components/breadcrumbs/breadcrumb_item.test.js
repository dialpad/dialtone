import { createLocalVue, mount } from '@vue/test-utils';
import DtBreadcrumbItem from './breadcrumb_item.vue';

const baseProps = {
  url: '#',
  label: 'Section',
};
const baseSlots = {};

let mockProps = {};
let mockSlots = {};
const testContext = {};

describe('DtBreadcrumbItem Tests', () => {
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtBreadcrumbItem, {
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
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
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    it('should render the breadcrumbItem', () => {
      expect(wrapper.exists()).toBeTruthy();
    });

    describe('When a default slot is provided to breadcrumb item', () => {
      it('should render default slot label', () => {
        mockSlots = { default: 'Slotted section' };

        updateWrapper();

        expect(wrapper.text()).toBe('Slotted section');
      });
    });

    describe('When a label is provided to breadcrumb item', () => {
      it('should render label', () => {
        expect(wrapper.text()).toBe('Section');
      });
    });
  });
});
