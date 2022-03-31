import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtButtonGroup from './button_group.vue';
import { DtButton } from '../button';
import ButtonsFixture from './buttons_decorator.vue';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '../../tests/shared_examples/validation';

// Constants
const baseProps = {};

describe('DtButtonGroup Tests', function () {
  // Wrappers
  let wrapper;
  let buttonGroup;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    buttonGroup = wrapper.find('.d-btn-group');
  };

  const _setWrappers = () => {
    wrapper = mount(DtButtonGroup, {
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
  beforeEach(function () {});

  // Teardown
  afterEach(function () {
    props = baseProps;
    attrs = {};
    slots = {};
    provide = {};
  });
  after(function () {});

  describe('Presentation Tests', function () {
    describe('When rendered with default content', function () {
      // Test Setup
      beforeEach(function () { _setWrappers(); });

      it('should have a button group', function () { assert.strictEqual(buttonGroup.exists(), true); });
      it('should not have buttons', function () {
        assert.lengthOf(wrapper.findAllComponents(DtButton), 0);
      });
    });

    describe('When buttons are provided', function () {
      // Test Setup
      beforeEach(function () {
        slots = { default: ButtonsFixture };
      });

      describe('When the button group renders', function () {
        // Test Setup
        beforeEach(function () { _setWrappers(); });

        it('should have buttons', function () {
          assert.lengthOf(wrapper.findAllComponents(DtButton), 2);
        });
      });
    });

    describe('When alignment is set to end', function () {
      beforeEach(async function () {
        await wrapper.setProps({ alignment: 'end' });
      });

      it('should have correct class', async function () {
        assert.isTrue(buttonGroup.classes().includes('d-btn-group--end'));
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('When rendered with default content', function () {
      it('shows correct role', function () {
        assert.strictEqual(buttonGroup.attributes('role'), 'group');
      });
    });
  });

  describe('Validation Tests', function () {
    describe('Alignment Validator', function () {
      // Test Environment
      const prop = DtButtonGroup.props.alignment;

      describe('When provided alignment is in BUTTON_GROUP_ALIGNMENT', function () {
        itBehavesLikePassesCustomPropValidation(prop, prop.default);
      });

      describe('When provided alignment is not in BUTTON_GROUP_ALIGNMENT', function () {
        itBehavesLikeFailsCustomPropValidation(prop, `INVALID_ALIGNMENT`);
      });
    });
  });
});
