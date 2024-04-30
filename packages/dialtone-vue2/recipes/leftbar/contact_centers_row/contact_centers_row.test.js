import { createLocalVue, mount } from '@vue/test-utils';
import DtRecipeContactCentersRow from './contact_centers_row.vue';

// Constants
const basePropsData = {
  description: 'Ai Contact Centers',
};

describe('DtRecipeContactCentersRow Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let iconType;
  let description;
  let unreadBadge;

  // Environment
  let propsData = basePropsData;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = async () => {
    await vi.dynamicImportSettled();
    iconType = wrapper.find('[data-qa="dt-leftbar-row-icon"]');
    description = wrapper.find('[data-qa="dt-leftbar-row-description"]');
    unreadBadge = wrapper.find('[data-qa="dt-leftbar-row-unread-badge"]');
  };

  const _setWrappers = async () => {
    wrapper = mount(DtRecipeContactCentersRow, {
      propsData,
      attrs,
      slots,
      provide,
      localVue: testContext.localVue,
    });
    await _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(async () => {
    propsData = basePropsData;
    slots = {};
    await _setWrappers();
  });

  // Teardown
  afterEach(() => {
    propsData = basePropsData;
    attrs = {};
    slots = {};
    provide = {};
  });
  afterAll(() => {});

  describe('Presentation Tests', () => {
    describe('When the leftbar renders', () => {
      // Test Setup
      beforeEach(() => {
        _setWrappers();
      });

      it('should exist', () => {
        expect(wrapper.exists()).toBeTruthy();
      });

      it('should render the icon', () => {
        expect(iconType.exists()).toBe(true);
        expect(iconType.find('svg').exists()).toBeTruthy();
      });

      it('should render the description', () => {
        expect(description.text()).toBe(basePropsData.description);
      });
    });

    describe('When a unreadCount is provided', () => {
      // Test Environment
      const unreadCount = 25;

      // Test Setup
      beforeEach(async () => {
        propsData = { ...propsData, unreadCount };
        await _setWrappers();
      });

      it('should render the unreadCount', () => {
        expect(unreadBadge.text()).toBe(`${unreadCount}`);
      });
    });
  });
});
