import { createLocalVue, mount } from '@vue/test-utils';
import DtRecipeGeneralRow from './general_row.vue';
import {
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS,
  LEFTBAR_GENERAL_ROW_TYPES,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_VALIDATION_ERROR,
} from '@/recipes/leftbar/general_row/general_row_constants';

// Constants
const basePropsData = {
  type: 'inbox',
  description: 'Description',
};

describe('DtRecipeGeneralRow Tests', () => {
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
  const _setChildWrappers = () => {
    iconType = wrapper.find('[data-qa="dt-leftbar-row-icon"]');
    description = wrapper.find('.dt-leftbar-row__description');
    unreadBadge = wrapper.find('[data-qa="dt-leftbar-row-unread-badge"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeGeneralRow, {
      propsData,
      attrs,
      slots,
      provide,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    propsData = basePropsData;
    slots = {};
    _setWrappers();
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
      beforeEach(() => { _setWrappers(); });

      it('should exist', () => { expect(wrapper.exists()).toBeTruthy(); });

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
      const unreadCount = '25';
      const hasUnreads = true;

      // Test Setup
      beforeEach(() => {
        propsData = { ...propsData, hasUnreads, unreadCount };
        _setWrappers();
      });

      it('should render the unreadCount', () => {
        expect(unreadBadge.text()).toBe(unreadCount);
      });
    });

    describe('When type is contact center', () => {
      // Test Environment
      const type = LEFTBAR_GENERAL_ROW_TYPES.CONTACT_CENTER;
      const color = 'magenta-200';

      // Test Setup
      beforeEach(() => {
        propsData = { ...propsData, type, color };
        _setWrappers();
      });

      it('should render the contact center icon', () => {
        expect(iconType.find('.dt-leftbar-row__icon-cc').exists()).toBeTruthy();
      });

      it(
        'should render the contact center icon with the correct color',
        () => {
          expect(iconType.find(`.${LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS[color]}`).exists()).toBeTruthy();
        },
      );
    });

    describe('When type is contact center and no color is provided', () => {
      // Test Environment
      let consoleErrorSpy;
      const type = LEFTBAR_GENERAL_ROW_TYPES.CONTACT_CENTER;

      beforeEach(async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockClear();
        propsData = { ...propsData, type };
        _setWrappers();
      });

      afterEach(() => {
        consoleErrorSpy = null;
        console.error.mockRestore();
      });

      it('should output error message', () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(LEFTBAR_GENERAL_ROW_CONTACT_CENTER_VALIDATION_ERROR);
      });
    });
  });
});
