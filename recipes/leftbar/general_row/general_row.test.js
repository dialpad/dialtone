import { mount } from '@vue/test-utils';
import DtRecipeGeneralRow from './general_row.vue';
import {
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS,
  LEFTBAR_GENERAL_ROW_TYPES,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_VALIDATION_ERROR,
} from '@/recipes/leftbar/general_row/general_row_constants';

// Constants
const baseProps = {
  type: 'inbox',
  description: 'Description',
};

describe('DtRecipeGeneralRow Tests', () => {
  // Wrappers
  let wrapper;
  let iconType;
  let description;
  let unreadBadge;

  // Environment
  let props = baseProps;
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
      props,
      attrs,
      slots,
      provide,
    });
    _setChildWrappers();
  };

  beforeEach(() => {
    props = baseProps;
    slots = {};
    _setWrappers();
  });

  // Teardown
  afterEach(() => {
    props = baseProps;
    attrs = {};
    slots = {};
    provide = {};
  });

  describe('Presentation Tests', () => {
    describe('When the leftbar renders', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      it('should exist', () => { expect(wrapper.exists()).toBeTruthy(); });

      it('should render the icon', () => {
        expect(iconType.exists()).toBe(true);
        expect(iconType.find('svg')).toBeTruthy();
      });

      it('should render the description', () => {
        expect(description.text()).toBe(props.description);
      });
    });

    describe('When a unreadCount is provided', () => {
      // Test Environment
      const unreadCount = '25';
      const hasUnreads = true;

      // Test Setup
      beforeEach(() => {
        props = { ...baseProps, hasUnreads, unreadCount };
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
        props = { ...baseProps, type, color };
        _setWrappers();
      });

      it('should render the contact center icon', () => {
        expect(iconType.classes('dt-leftbar-row__icon-cc')).toBe(true);
      });

      it(
        'should render the contact center icon with the correct color',
        () => {
          expect(iconType.classes(`${LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS[color]}`)).toBe(true);
        },
      );
    });

    describe('When type is contact center and no color is provided', () => {
      // Test Environment
      let consoleErrorSpy;
      const type = LEFTBAR_GENERAL_ROW_TYPES.CONTACT_CENTER;

      beforeEach(async () => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockClear();
        props = { ...baseProps, type };
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
