import { assert } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import DtRecipeContactInfo from './contact_info.vue';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '../../../tests/shared_examples/validation';

// Constants
const basePropsData = {
  avatarSrc: 'avatar.png',
  avatarInitials: 'JL',
  userStatusColor: 'green',
};

const baseSlotsData = {
  header: 'Joseph Lumaban',
  subtitle: '+1 (415) 123-4567',
  bottom: 'Aerolabs Support',
};

describe('DtRecipeContactInfo Tests', function () {
  // Wrappers
  let wrapper;
  let rootElement;
  let headerElement;
  let avatarElement;
  let userStatusElement;
  let subtitleElement;
  let bottomElement;

  // Environment
  let propsData = basePropsData;
  let attrs = {};
  let slots = baseSlotsData;
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    rootElement = wrapper.find('[data-qa="contact-info"]');
    headerElement = wrapper.find('[data-qa="contact-info-header"]');
    avatarElement = wrapper.find('[data-qa="dt-avatar"]');
    userStatusElement = wrapper.find('[data-qa="contact-info-user-status"]');
    subtitleElement = wrapper.find('[data-qa="contact-info-subtitle"]');
    bottomElement = wrapper.find('[data-qa="contact-info-bottom"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeContactInfo, {
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

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
    attrs = {};
    slots = baseSlotsData;
    provide = {};
  });

  describe('Presentation Tests', function () {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */

    describe('When pass default content', function () {
      it('Should render contact info component', function () {
        assert.isTrue(wrapper.exists());
        assert.isTrue(rootElement.exists());
      });
      it('Should display header content correctly', function () {
        assert.isTrue(headerElement.exists());
        assert.strictEqual(headerElement.text(), 'Joseph Lumaban');
      });
      it('Should render avatar component', function () {
        assert.isTrue(avatarElement.exists());
      });
      it('Should display user status with green background color', function () {
        assert.isTrue(userStatusElement.exists());
        assert.include(userStatusElement.classes(), 'd-bgc-green-300');
      });
      it('Should render subtitle content correctly', function () {
        assert.isTrue(subtitleElement.exists());
        assert.strictEqual(subtitleElement.text(), '+1 (415) 123-4567');
      });
      it('Should render bottom content correctly', function () {
        assert.isTrue(bottomElement.exists());
        assert.strictEqual(bottomElement.text(), 'Aerolabs Support');
      });
    });

    describe('When `avatarSrc` is empty and `avatarInitials` is passed', function () {
      beforeEach(async function () {
        await wrapper.setProps({
          avatarSrc: '',
          avatarInitials: 'JL',
        });
        await wrapper.vm.$nextTick();
        _setChildWrappers();
      });
      it('Avatar should display', function () {
        assert.isTrue(avatarElement.exists());
      });
      it('Should display correct initials', function () {
        assert.strictEqual(avatarElement.text(), 'JL');
      });
    });

    describe('When both `avatarSrc` and `avatarInitials` are empty', function () {
      beforeEach(async function () {
        await wrapper.setProps({
          avatarSrc: '',
          avatarInitials: '',
        });
      });
      it('Should not display avatar', function () {
        assert.isFalse(avatarElement.exists());
      });
    });

    describe('Hide user status indicator', function () {
      beforeEach(async function () {
        await wrapper.setProps({
          userStatusColor: 'none',
        });
      });
      it('Should not display user status indicator', function () {
        assert.isFalse(wrapper.find('[data-qa="contact-info-user-status"]').exists());
      });
    });
  });

  describe('Validation Tests', function () {
    /*
     * Test(s) to ensure that custom validators are working as expected
     */

    describe('userStatusColor Validator', function () {
      // Test Environment
      const prop = DtRecipeContactInfo.props.userStatusColor;

      describe('When provided color code is in USER_STATUS_COLOR_MODIFIERS', function () {
        itBehavesLikePassesCustomPropValidation(prop, prop.default);
      });

      describe('When provided color code is not in USER_STATUS_COLOR_MODIFIERS', function () {
        itBehavesLikeFailsCustomPropValidation(prop, `INVALID_CODE`);
      });
    });
  });
});
