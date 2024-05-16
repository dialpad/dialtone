import { mount } from '@vue/test-utils';
import DtRecipeContactCentersRow from './contact_centers_row.vue';

// Constants
const basePropsData = {
  description: 'Ai Contact Centers',
  menuButtonAriaLabel: 'Menu button',
};

describe('DtRecipeContactCentersRow Tests', () => {
  // Wrappers
  let wrapper;
  let iconType;
  let description;
  let unreadBadge;

  // Environment
  let props = basePropsData;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Helpers
  const updateWrapper = () => {
    wrapper = mount(DtRecipeContactCentersRow, {
      props,
      attrs,
      slots,
      global: {
        provide,
      },
    });

    iconType = wrapper.find('[data-qa="dt-leftbar-row-icon"]');
    description = wrapper.find('[data-qa="dt-leftbar-row-description"]');
    unreadBadge = wrapper.find('[data-qa="dt-leftbar-row-unread-badge"]');
  };

  beforeEach(async () => {
    props = basePropsData;
    slots = {};
    updateWrapper();
  });

  // Teardown
  afterEach(() => {
    props = basePropsData;
    attrs = {};
    slots = {};
    provide = {};
  });

  describe('Presentation Tests', () => {
    describe('When the leftbar renders', () => {
      // Test Setup
      beforeEach(() => {
        updateWrapper();
      });

      it('should exist', () => {
        expect(wrapper.exists()).toBeTruthy();
      });

      it('should render the icon', () => {
        expect(iconType.exists()).toBe(true);
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
        props = { ...props, unreadCount };
        updateWrapper();
      });

      it('should render the unreadCount', () => {
        expect(unreadBadge.text()).toBe(`${unreadCount}`);
      });
    });
  });
});
