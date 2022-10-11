import { assert } from 'chai';
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
