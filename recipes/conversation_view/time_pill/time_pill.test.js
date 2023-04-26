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

describe('DtRecipeTimePill Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

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
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });
  beforeEach(() => {
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
    describe('When some description of the current environment', () => {
      it('Should display date time display', () => {
        expect(timePill.text()).toBe(basePropsData.dateTimeDisplay);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When some description of the current environment', () => {
      it('Should have a datetime attribute', () => {
        expect(timePill.attributes('datetime')).toBe(basePropsData.dateTime);
      });
    });
  });

  describe('Validation Tests', () => {
    describe('dateTime Validator', () => {
      // Test Environment
      const prop = DtRecipeTimePill.props.dateTime;

      describe('When provided datetime is YYYY-MM-DD', () => {
        itBehavesLikePassesCustomPropValidation(prop, '1914-12-20');
      });

      describe('When provided datetime is YYYY-MM-DD HH:MM:SS', () => {
        itBehavesLikePassesCustomPropValidation(prop, '1914-12-20 08:30:45');
      });

      describe('When provided datetime is duration in days', () => {
        itBehavesLikeFailsCustomPropValidation(prop, 'P2D');
      });

      describe('When provided datetime is duration in time', () => {
        itBehavesLikeFailsCustomPropValidation(prop, 'PT15H10M');
      });

      describe('When provided datetime is abcdef', () => {
        itBehavesLikeFailsCustomPropValidation(prop, `abcdef`);
      });
    });
  });
});
