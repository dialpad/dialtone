import { assert } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import DtRecipeTimePill from './time_pill.vue';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '../../../tests/shared_examples/validation';

// Constants
const today = new Date();
const basePropsData = {
  dateTime: today.toISOString().split('T')[0],
  dateTimeDisplay: 'Today',
};

describe('DtRecipeTimePill Tests', function () {
  // Wrappers
  let wrapper;
  let timePill;

  // Environment
  let propsData = basePropsData;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    timePill = wrapper.find('[data-qa="dt-time-pill"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtRecipeTimePill, {
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
    slots = {};
    provide = {};
  });
  after(function () {});

  describe('Presentation Tests', function () {
    describe('When some description of the current environment', function () {
      it('Should display date time display', function () {
        assert.strictEqual(timePill.text(), basePropsData.dateTimeDisplay);
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('When some description of the current environment', function () {
      it('Should have a datetime attribute', function () {
        assert.strictEqual(timePill.attributes('datetime'), basePropsData.dateTime);
      });
    });
  });

  describe('Validation Tests', function () {
    describe('dateTime Validator', function () {
      // Test Environment
      const prop = DtRecipeTimePill.props.dateTime;

      describe('When provided datetime is YYYY-MM-DD', function () {
        itBehavesLikePassesCustomPropValidation(prop, '1914-12-20');
      });

      describe('When provided datetime is YYYY-MM-DD HH:MM:SS', function () {
        itBehavesLikePassesCustomPropValidation(prop, '1914-12-20 08:30:45');
      });

      describe('When provided datetime is duration in days', function () {
        itBehavesLikeFailsCustomPropValidation(prop, 'P2D');
      });

      describe('When provided datetime is duration in time', function () {
        itBehavesLikeFailsCustomPropValidation(prop, 'PT15H10M');
      });

      describe('When provided datetime is abcdef', function () {
        itBehavesLikeFailsCustomPropValidation(prop, `abcdef`);
      });
    });
  });
});
