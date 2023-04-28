import { mount } from '@vue/test-utils';
import DtRecipeTopBannerInfo from './top_banner_info.vue';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '../../../tests/shared_examples/validation';

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
    middleContent = wrapper.find('.d-top-banner-info__middle');
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
        expect(rootElement.classes()).toContain('d-bgc-success');
      });
    });

    describe('When colorCode is passed', () => {
      beforeEach(async () => {
        await wrapper.setProps({ colorCode: 'black100' });
      });

      it('Should display with passed background color', () => {
        expect(rootElement.classes()).toContain('d-bgc-info');
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
