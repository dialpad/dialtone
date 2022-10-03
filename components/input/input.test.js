import sinon from 'sinon';
import { assert } from 'chai';
import { mount, createLocalVue } from '@vue/test-utils';
import { INPUT_SIZES } from './input_constants';
import IconAdd from '@dialpad/dialtone/lib/dist/vue/icons/IconAdd.vue';
import DtInput from './input.vue';

// Constants
const basePropsData = {
  type: 'text',
  value: 'value',
};

const baseAttrs = {
  placeholder: 'input-placeholder',
  name: 'input-name',
};

describe('DtInput tests', function () {
  // Wrappers
  let wrapper;
  let labelWrapper;
  let label;
  let description;
  let nativeInput;
  let nativeTextarea;
  let leftIconWrapper;
  let rightIconWrapper;

  // Test Environment
  let propsData;
  let attrs;
  let slots;
  let listeners;
  let inputStub;

  // Helpers
  const _setChildWrappers = () => {
    labelWrapper = wrapper.find('[data-qa="dt-input-label-wrapper"]');
    label = wrapper.find('[data-qa="dt-input-label"]');
    description = wrapper.find('[data-qa="dt-input-description"]');
    nativeInput = wrapper.find('input');
    nativeTextarea = wrapper.find('textarea');
    leftIconWrapper = wrapper.find('[data-qa="dt-input-left-icon-wrapper"]');
    rightIconWrapper = wrapper.find('[data-qa="dt-input-right-icon-wrapper"]');
  };

  const _mountWrapper = () => {
    wrapper = mount(DtInput, {
      propsData,
      attrs,
      slots,
      listeners,
      localVue: this.localVue,
    });
  };

  // Test Setup
  before(function () {
    this.localVue = createLocalVue();
  });

  beforeEach(function () {
    propsData = basePropsData;
    attrs = baseAttrs;
    inputStub = sinon.stub();
    listeners = { input: inputStub };
    _mountWrapper();
  });

  // Test Teardown
  afterEach(function () {
    propsData = basePropsData;
    attrs = baseAttrs;
    slots = {};
  });

  describe('Presentation Tests', function () {
    // Shared Examples
    function itBehavesLikeHasIconSizeClass (iconWrapper, size) {
      if (size !== INPUT_SIZES.DEFAULT) {
        assert.isTrue(iconWrapper.classes().includes(`d-input-icon--${size}`));
      } else {
        assert.isFalse(iconWrapper.classes().includes(`d-input-icon--${size}`));
      }
    }

    const itBehavesLikeRendersDescription = (descriptionText) => {
      it('should render the description', function () { assert.isTrue(description.exists()); });
      it('should have description class', function () {
        assert.isTrue(description.classes().includes('d-description'));
      });
      it('should have a generated id', function () { assert.exists(description.attributes('id')); });
      it('should display the correct description', function () {
        assert.strictEqual(description.text(), descriptionText);
      });
      it('should have aria details defined on label wrapper', function () {
        assert.strictEqual(description.attributes('id'), labelWrapper.attributes('aria-details'));
      });
    };

    it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });

    describe('When type is not textarea', function () {
      // Test Setup
      beforeEach(function () {
        _setChildWrappers();
      });

      it('should render the native input', function () { assert.isTrue(nativeInput.exists()); });
      it('should have a type prop', function () {
        assert.strictEqual(nativeInput.attributes('type'), propsData.type);
      });
      it('should have a bound value prop', function () {
        assert.strictEqual(nativeInput.element.value, propsData.value);
      });
      it('should have input class', function () { assert.isTrue(nativeInput.classes().includes('d-input')); });
      it('should display the initial value prop', function () {
        assert.strictEqual(nativeInput.element.value, wrapper.vm.value);
      });
    });

    describe('When type is textarea', function () {
      // Test Setup
      beforeEach(async function () {
        await wrapper.setProps({ type: 'textarea' });
        _setChildWrappers();
      });

      it('should render the native textarea', function () { assert.isTrue(nativeTextarea.exists()); });
      it('should not have a type prop', function () { assert.isUndefined(nativeTextarea.attributes().type); });
      it('should not have a bound value prop', function () { assert.isUndefined(nativeTextarea.attributes().value); });
      it('should have textarea class', function () { assert.isTrue(nativeTextarea.classes().includes('d-textarea')); });
      it('should display the initial value prop', function () {
        assert.strictEqual(nativeTextarea.element.value, wrapper.vm.value);
      });
    });

    describe('When a label is not provided', function () {
      // Test Setup
      beforeEach(async function () { _setChildWrappers(); });

      it('should not render a label', function () { assert.isFalse(label.exists()); });
    });

    describe('When a description is not provided', function () {
      // Test Setup
      beforeEach(async function () { _setChildWrappers(); });

      it('should not render a description', function () { assert.isFalse(description.exists()); });
      it('should not have aria details defined on label wrapper', function () {
        assert.notExists(labelWrapper.attributes('aria-details'));
      });
    });

    describe('When a description is provided via prop', function () {
      // Test Setup
      beforeEach(async function () {
        await wrapper.setProps({ description: 'Description' });
        _setChildWrappers();
      });

      itBehavesLikeRendersDescription('Description');
    });

    describe('When a description is provided via slot', function () {
      // Test Setup
      beforeEach(async function () {
        slots = { description: 'Description' };
        _mountWrapper();
        _setChildWrappers();
      });

      itBehavesLikeRendersDescription('Description');
    });

    describe('When an inputClass prop is provided', function () {
      // Test Setup
      beforeEach(async function () {
        await wrapper.setProps({ inputClass: 'd-fc-success' });
        _setChildWrappers();
      });

      it('Should apply the class to the input element.', function () {
        assert.isTrue(nativeInput.classes('d-fc-success'));
      });
    });

    describe('When a left icon is provided', function () {
      // Shared Examples
      const itBehavesLikeRendersLeftInputIcon = (size = INPUT_SIZES.DEFAULT) => {
        it('should render the icon wrapper', function () { assert.isTrue(leftIconWrapper.exists()); });
        it('should have input icon class', function () {
          assert.isTrue(leftIconWrapper.classes().includes('d-input-icon'));
        });
        it('should have input icon side class', function () {
          assert.isTrue(leftIconWrapper.classes().includes('d-input-icon--left'));
        });
        it('should have input icon size class', function () { itBehavesLikeHasIconSizeClass(leftIconWrapper, size); });
        it('should render the provided icon', function () { assert.isTrue(wrapper.findComponent(IconAdd).exists()); });
      };

      // Test Setup
      beforeEach(async function () {
        slots = { leftIcon: IconAdd };
      });

      describe('When a size is not provided', function () {
        // Test Setup
        beforeEach(async function () {
          _mountWrapper();
          _setChildWrappers();
        });

        itBehavesLikeRendersLeftInputIcon();
      });

      describe('When a size is provided', function () {
        // Test Setup
        beforeEach(async function () {
          propsData = { size: INPUT_SIZES.EXTRA_LARGE };
          _mountWrapper();
          _setChildWrappers();
        });

        itBehavesLikeRendersLeftInputIcon(INPUT_SIZES.EXTRA_LARGE);
      });
    });

    describe('When a right icon is provided', function () {
      // Shared Examples
      const itBehavesLikeRendersRightInputIcon = (size = INPUT_SIZES.DEFAULT) => {
        it('should render the icon wrapper', function () { assert.isTrue(rightIconWrapper.exists()); });
        it('should have input icon class', function () {
          assert.isTrue(rightIconWrapper.classes().includes('d-input-icon'));
        });
        it('should have input icon side class', function () {
          assert.isTrue(rightIconWrapper.classes().includes('d-input-icon--right'));
        });
        it('should have input icon size class', function () { itBehavesLikeHasIconSizeClass(rightIconWrapper, size); });
        it('should render the provided icon', function () { assert.isTrue(wrapper.findComponent(IconAdd).exists()); });
      };

      // Test Setup
      beforeEach(async function () {
        slots = { rightIcon: IconAdd };
      });

      describe('When a size is not provided', function () {
        // Test Setup
        beforeEach(async function () {
          _mountWrapper();
          _setChildWrappers();
        });

        itBehavesLikeRendersRightInputIcon();
      });

      describe('When a size is provided', function () {
        // Test Setup
        beforeEach(async function () {
          propsData = { size: INPUT_SIZES.EXTRA_LARGE };
          _mountWrapper();
          _setChildWrappers();
        });

        itBehavesLikeRendersRightInputIcon(INPUT_SIZES.EXTRA_LARGE);
      });
    });

    describe('When no validation message(s) are provided', function () {
      it('should not render any validation messages', function () {
        assert.equal(wrapper.findAll('.d-validation-message').length, 0);
      });
      it('should not have an input state', function () { assert.isNull(wrapper.vm.inputState); });
    });

    describe('When validation message(s) are provided', function () {
      it('should display error messages', async function () {
        const errorMessage1 = 'error message 1';
        const errorMessage2 = 'error message 2';

        await wrapper.setProps({
          showMessages: false,
          messages: [
            errorMessage1,
            { message: errorMessage2, type: 'error' },
          ],
        });
        assert.equal(wrapper.findAll('.d-validation-message').length, 0);
        assert.equal(wrapper.vm.inputState, 'error', 'message type error present');

        await wrapper.setProps({ showMessages: true });

        const inputErrorMessages = wrapper.findAll('.d-validation-message--error');
        assert.equal(inputErrorMessages.length, 2);
        assert.equal(inputErrorMessages.at(0).text(), errorMessage1);
        assert.equal(inputErrorMessages.at(1).text(), errorMessage2);
      });

      it('should ignore all other message types if at least 1 error message is present', async function () {
        const strErrorMessage = 'string error message';

        await wrapper.setProps({
          messages: [
            strErrorMessage,
            { message: 'formatted warning message', type: 'warning' },
            { message: 'formatted success message', type: 'success' },
          ],
        });
        assert.equal(wrapper.vm.inputState, 'error', 'message type error present');

        const inputMessages = wrapper.findAll('.d-validation-message');
        const inputErrorMessages = wrapper.findAll('.d-validation-message--error');
        assert.equal(inputMessages.length, 1);
        assert.equal(inputErrorMessages.length, 1);
        assert.equal(inputErrorMessages.at(0).text(), strErrorMessage);
      });

      it('should display warning messages only if no error messages are present', async function () {
        const warningMessage = 'formatted warning message';

        await wrapper.setProps({
          messages: [
            { message: warningMessage, type: 'warning' },
            { message: 'formatted success message', type: 'success' },
          ],
        });
        assert.equal(wrapper.vm.inputState, 'warning', 'message type warning present');

        const inputMessages = wrapper.findAll('.d-validation-message');
        const inputWarningMessages = wrapper.findAll('.d-validation-message--warning');
        assert.equal(inputMessages.length, 1);
        assert.equal(inputWarningMessages.length, 1);
        assert.equal(inputWarningMessages.at(0).text(), warningMessage);
      });

      it('should display success messages only if no other types are present', async function () {
        const successMessage1 = 'formatted success message 1';
        const successMessage2 = 'formatted success message 2';

        await wrapper.setProps({
          messages: [
            { message: successMessage1, type: 'success' },
            { message: successMessage2, type: 'success' },
          ],
        });
        assert.equal(wrapper.vm.inputState, 'success', 'message type success present');

        const inputMessages = wrapper.findAll('.d-validation-message');
        const inputSuccessMessages = wrapper.findAll('.d-validation-message--success');
        assert.equal(inputMessages.length, 2);
        assert.equal(inputSuccessMessages.length, 2);
        assert.equal(inputSuccessMessages.at(0).text(), successMessage1);
        assert.equal(inputSuccessMessages.at(1).text(), successMessage2);
      });
    });

    describe('When a size is provided', function () {
      // Test Environment
      let size;

      // Shared Examples
      const itBehavesLikeAddsInputAndLabelSizeClasses = () => {
        it('should add input size class', function () {
          assert.isTrue(nativeInput.classes().includes(`d-input--${size}`));
        });
        it('should add label size class', function () { assert.isTrue(label.classes().includes(`d-label--${size}`)); });
      };

      // Test Setup
      beforeEach(async function () {
        propsData = { size, label: 'Label', description: 'Description' };
        _mountWrapper();
        _setChildWrappers();
      });

      describe('When size is EXTRA_SMALL', function () {
        // Test Setup
        before(function () {
          size = INPUT_SIZES.EXTRA_SMALL;
        });

        itBehavesLikeAddsInputAndLabelSizeClasses();
        it('should not add description size class', function () {
          assert.isFalse(description.classes().includes(`d-description--${size}`));
        });
      });

      describe('When size is EXTRA_LARGE', function () {
        // Test Setup
        before(function () {
          size = INPUT_SIZES.EXTRA_LARGE;
        });

        itBehavesLikeAddsInputAndLabelSizeClasses();
        it('should add description size class', function () {
          assert.isTrue(description.classes().includes(`d-description--${size}`));
        });
      });
    });

    describe('When the length validation props are provided', function () {
      // Test Environment
      let currentLength;
      const validate = {
        length: {
          description: 'Max. 20 characters.',
          max: 20,
          warn: 12,
          message: 'Validation message',
        },
      };

      // Test Setup
      beforeEach(async function () {
        propsData = {
          currentLength,
          validate,
        };
        _mountWrapper();
        _setChildWrappers();
      });

      describe('When the input length is below warning threshold and the input is focused', function () {
        // Test Setup
        before(function () {
          currentLength = 8;
          nativeInput.trigger('focus');
        });

        it('should not show the length validation message', function () {
          assert.equal(wrapper.findAll('.d-validation-message').length, 0);
        });

        it('should show the length description', function () {
          assert.strictEqual(
            wrapper.find('[data-qa="dt-input-length-description"]').text(), validate.length.description,
          );
        });
      });

      describe('When the input length is above warning threshold and the input is focused', function () {
        // Test Setup
        before(function () {
          currentLength = 12;
        });

        it('should show a warning validation message', async function () {
          await nativeInput.trigger('focus');

          const inputMessages = wrapper.findAll('.d-validation-message');
          const inputWarningMessages = wrapper.findAll('.d-validation-message--warning');
          assert.equal(inputMessages.length, 1);
          assert.equal(inputWarningMessages.length, 1);
        });
      });

      describe('When the input length reaches the maximum length and the input is focused', function () {
        // Test Setup
        before(function () {
          currentLength = 20;
        });

        it('should show an error validation message', async function () {
          await nativeInput.trigger('focus');

          const inputMessages = wrapper.findAll('.d-validation-message');
          const inputErrorMessages = wrapper.findAll('.d-validation-message--error');
          assert.equal(inputMessages.length, 1);
          assert.equal(inputErrorMessages.length, 1);
        });
      });

      describe('When the input length reaches the maximum length and the input is not focused', function () {
        // Test Setup
        before(function () {
          currentLength = 20;
        });

        it('should not show an error validation message', function () {
          assert.isFalse(wrapper.find('[data-qa="dt-input-length-validation-message"]').exists());
          const inputWarningMessages = wrapper.findAll('.d-validation-message--error');
          assert.equal(inputWarningMessages.length, 0);
        });
      });

      describe('When the input has a invalid state', function () {
        // Test Setup
        before(function () {
          currentLength = 28;
        });

        it('should show an error validation message', async function () {
          await wrapper.setProps({ value: 'new value with 28 characters' });

          const inputMessages = wrapper.findAll('.d-validation-message');
          const inputErrorMessages = wrapper.findAll('.d-validation-message--error');
          assert.equal(inputMessages.length, 1);
          assert.equal(inputErrorMessages.length, 1);
        });
      });
    });
  });

  describe('Reactivity Tests', function () {
    describe('User Input Tests', function () {
      // Test Environment
      const userTextInputVal = 'new user input';
      const newValue = 'new value with more than 20 characters';
      const validate = {
        length: {
          description: 'Max. 20 characters.',
          max: 20,
          warn: 12,
          message: 'Validation message',
        },
      };

      // Shared Examples
      const itBehavesLikeHandlesUserInput = () => {
        it('should handle input value', function () {
          assert.equal(wrapper.emitted().input[0][0], userTextInputVal);
          assert.isTrue(inputStub.called);
        });
      };

      describe('When type is not a textarea', function () {
        // Test Setup
        beforeEach(async function () {
          await wrapper.setProps({ currentLength: null, validate });
          _setChildWrappers();
          nativeInput.setValue(userTextInputVal);
        });

        itBehavesLikeHandlesUserInput();

        describe('When a new value is provided', function () {
          // Test Setup
          beforeEach(async function () { await wrapper.setProps({ value: newValue }); });

          it('should update input value', function () { assert.equal(nativeInput.element.value, newValue); });
        });

        describe('When a new value exceeds the maximum length', function () {
          it('should emit an "update:invalid" event with true', async function () {
            await wrapper.setProps({ value: newValue });
            assert.equal(wrapper.emitted()['update:invalid'][0][0], true);
          });
        });

        describe('When a new value is within the maximum length after exceeding it', function () {
          it('should emit an "update:invalid" event with false', async function () {
            await wrapper.setProps({ value: newValue });
            await wrapper.setProps({ value: userTextInputVal });
            assert.equal(wrapper.emitted()['update:invalid'][1][0], false);
          });
        });
      });

      describe('When type is a textarea', function () {
        // Test Setup
        beforeEach(async function () {
          await wrapper.setProps({ type: 'textarea', currentLength: null, validate });
          _setChildWrappers();
          nativeTextarea.setValue(userTextInputVal);
        });

        itBehavesLikeHandlesUserInput();

        describe('When a new value is provided', function () {
          // Test Setup
          beforeEach(async function () { await wrapper.setProps({ value: newValue }); });

          it('should update input value', function () { assert.equal(nativeTextarea.element.value, newValue); });
        });

        describe('When a new value exceeds the maximum length', function () {
          it('should emit an "update:invalid" event with true', async function () {
            await wrapper.setProps({ value: newValue });
            assert.equal(wrapper.emitted()['update:invalid'][0][0], true);
          });
        });

        describe('When a new value is within the maximum length after exceeding it', function () {
          it('should emit an "update:invalid" event with false', async function () {
            await wrapper.setProps({ value: newValue });
            await wrapper.setProps({ value: userTextInputVal });
            assert.equal(wrapper.emitted()['update:invalid'][1][0], false);
          });
        });
      });
    });
  });

  describe('Extendability Tests', function () {
    // Test Setup
    beforeEach(function () {
      _setChildWrappers();
    });

    it('should handle pass through props/attrs', async function () {
      // Validating all attrs from base-input get passed down to the native input.
      assert.include(nativeInput.attributes(), attrs);
      assert.isUndefined(nativeInput.attributes().disabled);

      await wrapper.setProps({ disabled: true });
      assert.equal(nativeInput.attributes().disabled, 'disabled');
    });
  });
});
