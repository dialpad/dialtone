import { mount } from '@vue/test-utils';
import DtRecipeTopBannerInfo from './TopBannerInfo.vue';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '@/tests/SharedExamples/validation.js';

// Constants
const baseProps = {
  colorCode: 'green300',
};

const baseSlots = {
  default: 'this is the content',
};

describe('DtRecipeTopBannerInfo Tests', function () {
  // Wrappers
  let wrapper;
  let middleContent;
  let rootElement;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = baseSlots;
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    middleContent = wrapper.find('[data-qa="banner-info--middle"]');
    rootElement = wrapper.find('[data-qa="banner-info"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeTopBannerInfo, {
      props,
      attrs,
      slots,
      global: {
        provide,
      },
    });
    _setChildWrappers();
  };

  // Setup
  beforeEach(function () {
    _setWrappers();
  });

  // Teardown
  afterEach(function () {
    props = baseProps;
    attrs = {};
    slots = baseSlots;
    provide = {};
  });

  describe('Presentation Tests', function () {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */

    describe('When pass default content', () => {
      it('Should render info banner component', () => {
        expect(wrapper.exists()).toBe(true);
      });
      it('Should display content correctly', () => {
        expect(middleContent.text()).toBe(slots.default);
      });
      it('Should display with default background color', () => {
        expect(rootElement.classes()).toContain('d-recipe-top-banner-info--positive');
      });
    });

    describe('When colorCode is passed', () => {
      beforeEach(async () => {
        await wrapper.setProps({ colorCode: 'black100' });
      });

      it('Should display with passed background color', () => {
        expect(rootElement.classes()).toContain('d-recipe-top-banner-info--info');
      });
    });
  });

  describe('Slot Naming Tests', () => {
    describe('When start slot is provided', () => {
      beforeEach(() => {
        slots = { ...baseSlots, start: '<div data-qa="custom-start">Start Content</div>' };
        _setWrappers();
      });

      it('should render start slot content', () => {
        expect(wrapper.find('[data-qa="custom-start"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="custom-start"]').text()).toBe('Start Content');
      });
    });

    describe('When left slot is provided (backward compat)', () => {
      beforeEach(() => {
        slots = { ...baseSlots, left: '<div data-qa="custom-left">Left Content</div>' };
        _setWrappers();
      });

      it('should render left slot content', () => {
        expect(wrapper.find('[data-qa="custom-left"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="custom-left"]').text()).toBe('Left Content');
      });
    });

    describe('When end slot is provided', () => {
      beforeEach(() => {
        slots = { ...baseSlots, end: '<div data-qa="custom-end">End Content</div>' };
        _setWrappers();
      });

      it('should render end slot content', () => {
        expect(wrapper.find('[data-qa="custom-end"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="custom-end"]').text()).toBe('End Content');
      });
    });

    describe('When right slot is provided (backward compat)', () => {
      beforeEach(() => {
        slots = { ...baseSlots, right: '<div data-qa="custom-right">Right Content</div>' };
        _setWrappers();
      });

      it('should render right slot content', () => {
        expect(wrapper.find('[data-qa="custom-right"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="custom-right"]').text()).toBe('Right Content');
      });
    });
  });

  describe('Validation Tests', () => {
    /*
     * Test(s) to ensure that custom validators are working as expected
     */
    describe('ColorCode Validator', () => {
      // Test Environment
      const prop = DtRecipeTopBannerInfo.props.colorCode;

      describe('When provided color code is in COLOR_CODES', () => {
        itBehavesLikePassesCustomPropValidation(prop, prop.default);
      });

      describe('When provided color code is not in COLOR_CODES', () => {
        itBehavesLikeFailsCustomPropValidation(prop, `INVALID_CODE`);
      });
    });
  });
});
