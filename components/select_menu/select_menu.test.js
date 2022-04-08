import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import sinon from 'sinon';
import { itBehavesLikeEmitsExpectedEvent } from '../../tests/shared_examples/events';
import {
  itBehavesLikePassesCustomPropValidation,
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikeDoesNotRaiseAnyVueWarnings,
  itBehavesLikeRaisesSingleVueWarning,
} from '../../tests/shared_examples/validation';
import {
  itBehavesLikeAppliesClassToChild,
  itBehavesLikeAppliesChildProp,
} from '../../tests/shared_examples/extendability';
import {
  LABEL_SIZE_MODIFIERS,
  DESCRIPTION_SIZE_MODIFIERS,
} from '@/common/constants';
import {
  SELECT_SIZE_MODIFIERS,
  SELECT_STATE_MODIFIERS,
} from './select_menu_constants';
import DtSelectMenu from './select_menu.vue';

// Constants
const LABEL = 'Label';
const DESCRIPTION = 'Description';
const OPTIONS = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
];

const baseProps = {
  label: LABEL,
  options: OPTIONS,
};
const baseAttrs = {
  name: 'select-menu',
};

describe('DtSelectMenu Tests', function () {
  // Wrappers
  let wrapper;
  let selectWrapper;
  let select;
  let label;
  let description;
  let messages;

  // Environment
  let props = baseProps;
  let attrs = baseAttrs;
  let slots = {};

  // Helpers
  const _setChildWrappers = () => {
    select = wrapper.find('[data-qa="dt-select"]');
    selectWrapper = wrapper.find('[data-qa="dt-select-wrapper"]');
    label = wrapper.find('[data-qa="dt-select-label"]');
    description = wrapper.find('[data-qa="dt-select-description"]');
    messages = wrapper.find('[data-qa="dt-select-messages"]');
  };

  const _mountWrappers = () => {
    wrapper = mount(DtSelectMenu, {
      props,
      attrs,
      slots,
    });
    _setChildWrappers();
  };

  // Setup
  beforeEach(function () {});

  // Teardown
  afterEach(function () {
    props = baseProps;
    attrs = baseAttrs;
    slots = {};
  });

  describe('Presentation Tests', function () {
    describe('When rendered with required content', function () {
      // Test Setup
      beforeEach(function () { _mountWrappers(); });

      it('should render the provided label', function () { assert.strictEqual(label.text(), LABEL); });
      it('should have no size variant classes on the label', function () {
        assert.strictEqual(label.classes().length, 1);
      });
      it('should not render a description', function () { assert.isFalse(description.exists()); });
      it('should render the select menu', function () { assert.isTrue(select.exists()); });
      it('should have no size variant classes on select menu', function () {
        assert.strictEqual(selectWrapper.classes().length, 1);
      });
      it('should have no kind variant classes on select menu input', function () {
        assert.strictEqual(select.classes().length, 1);
      });
      it('should render the select menu options', function () {
        OPTIONS.forEach(option => {
          assert.exists(select.find(`[value="${option.value}"]`));
        });
      });
      it('should not render any validation messages', function () {
        assert.isFalse(messages.exists());
      });
    });

    describe('When a label is not provided', function () {
      // Test Setup
      beforeEach(function () {
        props = { options: OPTIONS };
        _mountWrappers();
      });

      it('should not render a label', function () { assert.isFalse(label.exists()); });
    });

    describe('When a label is provided via slot', function () {
      // Test Environment
      const slottedLabel = 'Slotted Label';

      // Test Setup
      beforeEach(function () {
        slots = {
          label: slottedLabel,
        };
        _mountWrappers();
      });

      it('should render the slotted label', function () { assert.strictEqual(label.text(), slottedLabel); });
    });

    describe('When a description is provided via prop', function () {
      // Test Setup
      beforeEach(function () {
        props = {
          ...baseProps,
          description: DESCRIPTION,
        };
        _mountWrappers();
      });

      it('should render the provided description', function () {
        assert.strictEqual(description.text(), DESCRIPTION);
      });
      it('should have no size variant classes on the description', function () {
        assert.strictEqual(description.classes().length, 1);
      });
    });

    describe('When a description is provided via slot', function () {
      // Test Environment
      const slottedDescription = 'Slotted Description';

      // Test Setup
      beforeEach(function () {
        slots = {
          description: slottedDescription,
        };
        _mountWrappers();
      });

      it('should render the slotted description', function () {
        assert.strictEqual(description.text(), slottedDescription);
      });
    });

    describe('When options are provided via slot', function () {
      // Test Environment
      const slottedOptions = '<option value="1">Option 1</option><option value="2">Option 2</option>';

      // Test Setup
      beforeEach(function () {
        slots = {
          default: slottedOptions,
        };
        _mountWrappers();
      });

      it('should render the select menu options', function () {
        assert.exists(select.findAll('option').length, 2);
      });
    });

    describe('When a size is provided', function () {
      // Test Environment
      const size = 'lg';

      // Test Setup
      beforeEach(function () {
        props = {
          ...baseProps,
          description: DESCRIPTION,
          size,
        };
        _mountWrappers();
      });

      it('should have size variant class on the label', function () {
        assert.isTrue(label.classes(LABEL_SIZE_MODIFIERS[size]));
      });
      it('should have size variant class on the description', function () {
        assert.isTrue(description.classes(DESCRIPTION_SIZE_MODIFIERS[size]));
      });
      it('should have size variant class on select menu', function () {
        assert.isTrue(selectWrapper.classes(SELECT_SIZE_MODIFIERS[size]));
      });
    });

    describe('When validation messages are provided', function () {
      // Test Environment
      const message = 'Validation Message';

      // Test Setup
      beforeEach(function () {
        props = {
          ...baseProps,
          messages: [message],
        };
      });

      // Shared Examples
      const itBehavesLikeHasSelectInputStateClass = () => {
        it('should have error state class on select menu', function () {
          assert.isTrue(select.classes(SELECT_STATE_MODIFIERS.error));
        });
      };

      describe('When validation messages are shown', function () {
        // Test Setup
        beforeEach(function () {
          _mountWrappers();
        });

        itBehavesLikeHasSelectInputStateClass();
        it('should render validation message', function () {
          assert.strictEqual(messages?.findAll('[data-qa="validation-message"]').length, 1);
        });
      });

      describe('When validation messages are hidden', function () {
        // Test Setup
        beforeEach(function () {
          props.showMessages = false;
          _mountWrappers();
        });

        itBehavesLikeHasSelectInputStateClass();
        it('should not render any validation messages', function () {
          assert.isFalse(messages.exists());
        });
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('When a description is provided', function () {
      // Test Setup
      beforeEach(function () {
        props = { ...baseProps, description: DESCRIPTION };
        _mountWrappers();
      });

      it('label aria-details should match the id of the description', function () {
        assert.strictEqual(label.attributes('aria-details'), description.attributes('id'));
      });
    });

    describe('When a description is not provided', function () {
      describe('When aria-details are not provided', function () {
        // Test Setup
        beforeEach(function () {
          _mountWrappers();
        });

        it('label aria-details should not exist', function () {
          assert.notExists(label.attributes('aria-details'));
        });
      });

      describe('When aria-details are provided', function () {
        // Test Environment
        const ariaDetails = 'some-id';

        // Test Setup
        beforeEach(function () {
          attrs = { ...baseAttrs, 'aria-details': ariaDetails };
          _mountWrappers();
        });

        it('label aria-details should match those provided by attrs', function () {
          assert.strictEqual(label.attributes('aria-details'), ariaDetails);
        });
      });
    });
  });

  describe('Interactivity Tests', function () {
    describe('When select menu value has changed', function () {
      // Test Environment
      const selectedValue = OPTIONS[1].value;

      // Test Setup
      beforeEach(function () {
        _mountWrappers();
        select.element.value = selectedValue;
        select.trigger('change');
      });

      it('should emit input event', function () {
        itBehavesLikeEmitsExpectedEvent(wrapper, 'input', selectedValue.toString());
      });
      it('should emit change event', function () {
        itBehavesLikeEmitsExpectedEvent(wrapper, 'change', selectedValue.toString());
      });
    });
  });

  describe('Validation Tests', function () {
    describe('Size Validator', function () {
      // Test Environment
      const prop = DtSelectMenu.props.size;

      describe('When provided size is in SELECT_SIZE_MODIFIERS', function () {
        itBehavesLikePassesCustomPropValidation(prop, prop.default);
      });

      describe('when provided size is not in SELECT_SIZE_MODIFIERS', function () {
        itBehavesLikeFailsCustomPropValidation(prop, `NOT${SELECT_SIZE_MODIFIERS.md}`);
      });
    });

    describe('Options Validation', function () {
      // Test Environment
      const warningMessage = '[Vue warn]: Options are expected to be provided via prop or slot';

      // Test Setup
      before(function () {
        sinon.spy(console, 'warn');
      });

      // Test Teardown
      afterEach(function () {
        console.warn.resetHistory();
      });

      after(function () {
        console.warn.restore();
      });

      describe('When options are provided via prop', function () {
        // Test Setup
        beforeEach(function () {
          _mountWrappers();
        });

        itBehavesLikeDoesNotRaiseAnyVueWarnings();

        describe('When updated options are empty', function () {
          // Test Setup
          beforeEach(async function () {
            await wrapper.setProps({ options: [] });
          });

          itBehavesLikeRaisesSingleVueWarning(warningMessage);
        });
      });

      describe('When options are provided via slot', function () {
        // Test Setup
        beforeEach(function () {
          props = { ...props, options: undefined };
          slots = { default: '<option value="1">Option 1</option><option value="2">Option 2</option>' };
          _mountWrappers();
        });

        it('should not have expected warning message', function () {
          assert.notEqual(console.warn.firstCall.args[0], warningMessage);
        });
      });

      describe('When options are not provided', function () {
        // Test Setup
        beforeEach(function () {
          props = { ...props, options: undefined };
          _mountWrappers();
        });

        itBehavesLikeRaisesSingleVueWarning(warningMessage);
      });
    });
  });

  describe('Extendability Tests', function () {
    // Test Environment
    let element;
    const customClass = 'my-custom-class';
    const propName = 'some';
    const propValue = 'prop';
    const childProps = {};

    // Helpers
    const _setupChildClassTest = (childClassName, selector) => {
      props[childClassName] = customClass;
      _mountWrappers();
      element = wrapper.find(selector);
    };

    const _setupChildPropsTest = (childPropsName, selector) => {
      props[childPropsName] = childProps;
      _mountWrappers();
      element = wrapper.find(selector);
    };

    // Shared Examples
    const itBehavesLikeAppliesClassToChildLocal = () => {
      it('should apply custom class to child', function () {
        itBehavesLikeAppliesClassToChild(wrapper, '.my-custom-class', element);
      });
    };

    const itBehavesLikeAppliesChildPropLocal = () => {
      it('should have provided child prop', function () {
        itBehavesLikeAppliesChildProp(element, propName, propValue);
      });
    };

    // Test Setup
    before(function () {
      childProps[propName] = propValue;
    });
    beforeEach(function () {
      props = { ...props, description: DESCRIPTION };
    });

    describe('When a label class is provided', function () {
      beforeEach(function () { _setupChildClassTest('labelClass', '[data-qa="dt-select-label"]'); });
      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When a description class is provided', function () {
      beforeEach(function () { _setupChildClassTest('descriptionClass', '[data-qa="dt-select-description"]'); });
      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When a select class is provided', function () {
      beforeEach(function () { _setupChildClassTest('selectClass', '[data-qa="dt-select-wrapper"]'); });
      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When an option class is provided', function () {
      // Test Environment
      let options;

      // Test Setup
      beforeEach(function () {
        props.optionClass = customClass;
        _mountWrappers();
        options = select.findAll('option');
      });

      it('should apply child class to each option', function () {
        options.forEach(option => {
          assert.isTrue(option.classes(customClass));
        });
      });
    });

    describe('When label child props are provided', function () {
      beforeEach(function () { _setupChildPropsTest('labelChildProps', '[data-qa="dt-select-label"]'); });
      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When description child props are provided', function () {
      beforeEach(function () { _setupChildPropsTest('descriptionChildProps', '[data-qa="dt-select-description"]'); });
      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When option child props are provided', function () {
      // Test Environment
      let options;

      // Test Setup
      beforeEach(function () {
        props.optionChildProps = childProps;
        _mountWrappers();
        options = select.findAll('option');
      });

      it('should apply child props to each option', function () {
        options.forEach(option => {
          itBehavesLikeAppliesChildProp(option, propName, propValue);
        });
      });
    });

    describe('When attrs are provided', function () {
      // Test Setup
      beforeEach(function () {
        attrs = { some: 'prop' };
        _mountWrappers();
        element = select;
      });

      itBehavesLikeAppliesChildPropLocal();
    });
  });
});
