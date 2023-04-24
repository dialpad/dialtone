import { createLocalVue, shallowMount } from '@vue/test-utils';
import DtButtonGroup from './button_group.vue';
import { DtButton } from '../button';
import ButtonsFixture from './buttons_decorator.vue';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '../../tests/shared_examples/validation';

// Constants
const basePropsData = {};

describe('DtButtonGroup Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let buttonGroup;

  // Environment
  let propsData = basePropsData;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    buttonGroup = wrapper.find('.d-btn-group');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtButtonGroup, {
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
  beforeEach(() => {});

  // Teardown
  afterEach(() => {
    propsData = basePropsData;
    attrs = {};
    slots = {};
    provide = {};
  });
  afterAll(() => {});

  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      it(
        'should have a button group',
        () => { expect(buttonGroup.exists()).toBe(true); },
      );
      it('should not have buttons', () => {
        expect(wrapper.findAllComponents(DtButton).length).toBe(0);
      });
    });

    describe('When buttons are provided', () => {
      // Test Setup
      beforeEach(() => {
        slots = { default: ButtonsFixture };
      });

      describe('When the button group renders', () => {
        // Test Setup
        beforeEach(() => { _setWrappers(); });

        it('should have buttons', () => {
          expect(wrapper.findAllComponents(DtButton).length).toBe(2);
        });
      });
    });

    describe('When alignment is set to end', () => {
      beforeEach(async () => {
        await wrapper.setProps({ alignment: 'end' });
      });

      it('should have correct class', async () => {
        expect(buttonGroup.classes().includes('d-btn-group--end')).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When rendered with default content', () => {
      it('shows correct role', () => {
        expect(buttonGroup.attributes('role')).toBe('group');
      });
    });
  });

  describe('Validation Tests', () => {
    describe('Alignment Validator', () => {
      // Test Environment
      const prop = DtButtonGroup.props.alignment;

      describe('When provided alignment is in BUTTON_GROUP_ALIGNMENT', () => {
        itBehavesLikePassesCustomPropValidation(prop, prop.default);
      });

      describe('When provided alignment is not in BUTTON_GROUP_ALIGNMENT', () => {
        itBehavesLikeFailsCustomPropValidation(prop, `INVALID_ALIGNMENT`);
      });
    });
  });
});
