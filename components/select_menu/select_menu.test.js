import { mount } from '@vue/test-utils';
import {
  itBehavesLikePassesCustomPropValidation,
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikeDoesNotRaiseAnyVueWarnings,
  itBehavesLikeRaisesSingleVueWarning,
  initializeSpy,
  cleanSpy,
} from '../../tests/shared_examples/validation';
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

describe('DtSelectMenu Tests', () => {
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

  describe('Presentation Tests', () => {
    describe('When rendered with required content', () => {
      // Test Setup
      beforeEach(() => { _mountWrappers(); });

      it(
        'should render the provided label',
        () => { expect(label.text()).toBe(LABEL); },
      );
      it('should have no size variant classes on the label', () => {
        expect(label.classes().length).toBe(1);
      });
      it(
        'should not render a description',
        () => { expect(description.exists()).toBe(false); },
      );
      it(
        'should render the select menu',
        () => { expect(select.exists()).toBe(true); },
      );
      it('should have no size variant classes on select menu', () => {
        expect(selectWrapper.classes().length).toBe(1);
      });
      it('should have no kind variant classes on select menu input', () => {
        expect(select.classes().length).toBe(1);
      });
      it('should render the select menu options', () => {
        OPTIONS.forEach(option => {
          expect(select.find(`[value="${option.value}"]`).exists()).toBeTruthy();
        });
      });
      it('should not render any validation messages', () => {
        expect(messages.exists()).toBe(false);
      });
    });

    describe('When a label is not provided', () => {
      // Test Setup
      beforeEach(() => {
        props = { options: OPTIONS };
        _mountWrappers();
      });

      it(
        'should not render a label',
        () => { expect(label.exists()).toBe(false); },
      );
    });

    describe('When a label is provided via slot', () => {
      // Test Environment
      const slottedLabel = 'Slotted Label';

      // Test Setup
      beforeEach(() => {
        slots = {
          label: slottedLabel,
        };
        _mountWrappers();
      });

      it(
        'should render the slotted label',
        () => { expect(label.text()).toBe(slottedLabel); },
      );
    });

    describe('When a description is provided via prop', () => {
      // Test Setup
      beforeEach(() => {
        props = {
          ...baseProps,
          description: DESCRIPTION,
        };
        _mountWrappers();
      });

      it('should render the provided description', () => {
        expect(description.text()).toBe(DESCRIPTION);
      });
      it('should have no size variant classes on the description', () => {
        expect(description.classes().length).toBe(1);
      });
    });

    describe('When a description is provided via slot', () => {
      // Test Environment
      const slottedDescription = 'Slotted Description';

      // Test Setup
      beforeEach(() => {
        slots = {
          description: slottedDescription,
        };
        _mountWrappers();
      });

      it('should render the slotted description', () => {
        expect(description.text()).toBe(slottedDescription);
      });
    });

    describe('When options are provided via slot', () => {
      // Test Environment
      const slottedOptions = '<option value="1">Option 1</option><option value="2">Option 2</option>';

      // Test Setup
      beforeEach(() => {
        slots = {
          default: slottedOptions,
        };
        _mountWrappers();
      });

      it('should render the select menu options', () => {
        expect(select.findAll('option').length).toBe(2);
      });
    });

    describe('When a size is provided', () => {
      // Test Environment
      const size = 'lg';

      // Test Setup
      beforeEach(() => {
        props = {
          ...baseProps,
          description: DESCRIPTION,
          size,
        };
        _mountWrappers();
      });

      it('should have size variant class on the label', () => {
        expect(label.classes(LABEL_SIZE_MODIFIERS[size])).toBe(true);
      });
      it('should have size variant class on the description', () => {
        expect(description.classes(DESCRIPTION_SIZE_MODIFIERS[size])).toBe(true);
      });
      it('should have size variant class on select menu', () => {
        expect(selectWrapper.classes(SELECT_SIZE_MODIFIERS[size])).toBe(true);
      });
    });

    describe('When validation messages are provided', () => {
      // Test Environment
      const message = 'Validation Message';

      // Test Setup
      beforeEach(() => {
        props = {
          ...baseProps,
          messages: [message],
        };
      });

      // Shared Examples
      const itBehavesLikeHasSelectInputStateClass = () => {
        it('should have error state class on select menu', () => {
          expect(select.classes(SELECT_STATE_MODIFIERS.error)).toBe(true);
        });
      };

      describe('When validation messages are shown', () => {
        // Test Setup
        beforeEach(() => {
          _mountWrappers();
        });

        itBehavesLikeHasSelectInputStateClass();
        it('should render validation message', () => {
          expect(messages?.findAll('[data-qa="validation-message"]').length).toBe(1);
        });
      });

      describe('When validation messages are hidden', () => {
        // Test Setup
        beforeEach(() => {
          props.showMessages = false;
          _mountWrappers();
        });

        itBehavesLikeHasSelectInputStateClass();
        it('should not render any validation messages', () => {
          expect(messages.exists()).toBe(false);
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When a description is provided', () => {
      // Test Setup
      beforeEach(() => {
        props = { ...baseProps, description: DESCRIPTION };
        _mountWrappers();
      });

      it('label aria-details should match the id of the description', () => {
        expect(label.attributes('aria-details')).toBe(description.attributes('id'));
      });
    });

    describe('When a description is not provided', () => {
      describe('When aria-details are not provided', () => {
        // Test Setup
        beforeEach(() => {
          _mountWrappers();
        });

        it('label aria-details should not exist', () => {
          expect(label.attributes('aria-details')).toBeFalsy();
        });
      });

      describe('When aria-details are provided', () => {
        // Test Environment
        const ariaDetails = 'some-id';

        // Test Setup
        beforeEach(() => {
          attrs = { ...baseAttrs, 'aria-details': ariaDetails };
          _mountWrappers();
        });

        it('label aria-details should match those provided by attrs', () => {
          expect(label.attributes('aria-details')).toBe(ariaDetails);
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When select menu value has changed', () => {
      // Test Environment
      const selectedValue = OPTIONS[1].value;

      // Test Setup
      beforeEach(() => {
        _mountWrappers();
        select.element.value = selectedValue;
        select.trigger('change');
      });

      it('should emit input event', () => {
        expect(wrapper.emitted('input')[0][0]).toBe(selectedValue.toString());
      });
      it('should emit change event', () => {
        expect(wrapper.emitted('change')[0][0]).toBe(selectedValue.toString());
      });
    });
  });

  describe('Validation Tests', () => {
    // Test Setup
    beforeEach(function () {
      initializeSpy();
    });

    // Test Teardown
    afterEach(function () {
      cleanSpy();
    });
    describe('Size Validator', () => {
      // Test Environment
      const prop = DtSelectMenu.props.size;

      describe('When provided size is in SELECT_SIZE_MODIFIERS', () => {
        itBehavesLikePassesCustomPropValidation(prop, prop.default);
      });

      describe('when provided size is not in SELECT_SIZE_MODIFIERS', () => {
        itBehavesLikeFailsCustomPropValidation(prop, `NOT${SELECT_SIZE_MODIFIERS.md}`);
      });
    });

    describe('Options Validation', () => {
      // Test Environment
      const warningMessage = '[Vue warn]: Options are expected to be provided via prop or slot';

      describe('When options are provided via prop', () => {
        // Test Setup
        beforeEach(() => {
          _mountWrappers();
        });

        itBehavesLikeDoesNotRaiseAnyVueWarnings();

        describe('When updated options are empty', () => {
          // Test Setup
          beforeEach(async () => {
            await wrapper.setProps({ options: [] });
          });

          itBehavesLikeRaisesSingleVueWarning(warningMessage);
        });
      });

      describe('When options are provided via slot', () => {
        // Test Setup
        beforeEach(() => {
          props = { ...baseProps, options: undefined };
          slots = { default: '<option value="1">Option 1</option><option value="2">Option 2</option>' };
          _mountWrappers();
        });

        it('should not have expected warning message', function () {
          expect(console.warn).not.toBeCalledWith(warningMessage);
        });
      });

      describe('When options are not provided', () => {
        // Test Setup
        beforeEach(() => {
          props = { ...baseProps, options: undefined };
          _mountWrappers();
        });

        itBehavesLikeRaisesSingleVueWarning(warningMessage);
      });
    });
  });

  describe('Extendability Tests', () => {
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

    // Test Setup
    beforeAll(() => {
      childProps[propName] = propValue;
    });
    beforeEach(() => {
      props = { ...baseProps, description: DESCRIPTION };
    });

    describe('When a label class is provided', () => {
      beforeEach(
        () => { _setupChildClassTest('labelClass', '[data-qa="dt-select-label"]'); },
      );
      it('should apply custom class to child', () => {
        expect(wrapper.find('.my-custom-class').html()).toBe(element.html());
      });
    });

    describe('When a description class is provided', () => {
      beforeEach(
        () => { _setupChildClassTest('descriptionClass', '[data-qa="dt-select-description"]'); },
      );
      it('should apply custom class to child', () => {
        expect(wrapper.find('.my-custom-class').html()).toBe(element.html());
      });
    });

    describe('When a select class is provided', () => {
      beforeEach(
        () => { _setupChildClassTest('selectClass', '[data-qa="dt-select-wrapper"]'); },
      );
      it('should apply custom class to child', () => {
        expect(wrapper.find('.my-custom-class').html()).toBe(element.html());
      });
    });

    describe('When an option class is provided', () => {
      // Test Environment
      let options;

      // Test Setup
      beforeEach(() => {
        props.optionClass = customClass;
        _mountWrappers();
        options = select.findAll('option');
      });

      it('should apply child class to each option', () => {
        options.forEach(option => {
          expect(option.classes(customClass)).toBe(true);
        });
      });
    });

    describe('When label child props are provided', () => {
      beforeEach(
        () => { _setupChildPropsTest('labelChildProps', '[data-qa="dt-select-label"]'); },
      );

      it('should have provided child prop', () => {
        expect(element.attributes(propName)).toBe(propValue);
      });
    });

    describe('When description child props are provided', () => {
      beforeEach(
        () => { _setupChildPropsTest('descriptionChildProps', '[data-qa="dt-select-description"]'); },
      );
      it('should have provided child prop', () => {
        expect(element.attributes(propName)).toBe(propValue);
      });
    });

    describe('When option child props are provided', () => {
      // Test Environment
      let options;

      // Test Setup
      beforeEach(() => {
        props.optionChildProps = childProps;
        _mountWrappers();
        options = select.findAll('option');
      });

      it('should apply child props to each option', () => {
        options.forEach(option => {
          expect(option.attributes(propName)).toBe(propValue);
        });
      });
    });

    describe('When attrs are provided', () => {
      // Test Setup
      beforeEach(() => {
        attrs = { some: 'prop' };
        _mountWrappers();
        element = select;
      });

      it('attr should be set on element', () => {
        expect(element.attributes(propName)).toBe(propValue);
      });
    });
  });
});
