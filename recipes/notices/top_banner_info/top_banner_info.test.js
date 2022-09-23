import { assert } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import DtRecipeTopBannerInfo from './top_banner_info.vue';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '../../../tests/shared_examples/validation';

// Constants
const basePropsData = {
  colorCode: 'green300',
};

describe('DtRecipeTopBannerInfo Tests', function () {
  // Wrappers
  let wrapper;
  let middleContent;
  let rootElement;

  // Environment
  const propsData = basePropsData;
  const attrs = {};
  const slots = {
    default: 'this is the content',
  };
  const provide = {};

  // Helpers
  const _setChildWrappers = () => {
    middleContent = wrapper.find('.d-top-banner-info__middle');
    rootElement = wrapper.find('[data-qa="banner-info"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtRecipeTopBannerInfo, {
      propsData,
      attrs,
      slots,
      provide,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  before(function () {
    this.localVue = createLocalVue();
  });
  beforeEach(function () {
    _setWrappers();
  });

  describe('Presentation Tests', function () {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */

    describe('When pass default content', function () {
      it('Should render info banner component', function () {
        assert.isTrue(wrapper.exists());
      });
      it('Should display content correctly', function () {
        assert.strictEqual(middleContent.text(), slots.default);
      });
      it('Should display with default background color', function () {
        assert.include(rootElement.classes(), 'd-bgc-green-300');
      });
    });

    describe('When colorCode is passed', function () {
      beforeEach(async function () {
        await wrapper.setProps({ colorCode: 'black100' });
      });

      it('Should display with passed background color', function () {
        assert.include(rootElement.classes(), 'd-bgc-black-400');
      });
    });
  });

  describe('Validation Tests', function () {
    /*
     * Test(s) to ensure that custom validators are working as expected
     */
    describe('ColorCode Validator', function () {
      // Test Environment
      const prop = DtRecipeTopBannerInfo.props.colorCode;

      describe('When provided color code is in COLOR_CODES', function () {
        itBehavesLikePassesCustomPropValidation(prop, prop.default);
      });

      describe('When provided color code is not in COLOR_CODES', function () {
        itBehavesLikeFailsCustomPropValidation(prop, `INVALID_CODE`);
      });
    });
  });
});
