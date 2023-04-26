import { mount, createLocalVue } from '@vue/test-utils';
import { INPUT_SIZES } from './input_constants';
import { DtIcon } from '@/components/icon';
import DtInput from './input.vue';

// Constants
const basePropsData = {
  type: 'text',
  value: 'value',
  label: 'label text',
};

const baseAttrs = {
  placeholder: 'input-placeholder',
  name: 'input-name',
};

describe('DtInput tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let labelWrapper;
  let label;
  let description;
  let nativeInput;
  let nativeTextarea;
  let leftIconWrapper;
  let rightIconWrapper;
  let iconPlus;

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
      components: { DtIcon },
      attrs,
      slots,
      listeners,
      localVue: testContext.localVue,
    });
    iconPlus = '<dt-icon name="plus" />';
  };

  // Test Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    propsData = basePropsData;
    attrs = baseAttrs;
    inputStub = jest.fn();
    listeners = { input: inputStub };
    _mountWrapper();
  });

  // Test Teardown
  afterEach(() => {
    propsData = basePropsData;
    attrs = baseAttrs;
    slots = {};
  });

  describe('Presentation Tests', () => {
    // Shared Examples
    function itBehavesLikeHasIconSizeClass (iconWrapper, size) {
      if (size !== INPUT_SIZES.DEFAULT) {
        expect(iconWrapper.classes().includes(`d-input-icon--${size}`)).toBe(true);
      } else {
        expect(iconWrapper.classes().includes(`d-input-icon--${size}`)).toBe(false);
      }
    }

    const itBehavesLikeRendersDescription = (descriptionText) => {
      it(
        'should render the description',
        () => { expect(description.exists()).toBe(true); },
      );
      it('should have description class', () => {
        expect(description.classes().includes('d-description')).toBe(true);
      });
      it(
        'should have a generated id',
        () => { expect(description.attributes('id')).toBeTruthy(); },
      );
      it('should display the correct description', () => {
        expect(description.text()).toBe(descriptionText);
      });
      it('should have aria details defined on label wrapper', () => {
        expect(description.attributes('id')).toBe(labelWrapper.attributes('aria-details'));
      });
    };

    it(
      'should render the component',
      () => { expect(wrapper.exists()).toBe(true); },
    );

    describe('When type is not textarea', () => {
      // Test Setup
      beforeEach(() => {
        _setChildWrappers();
      });

      it(
        'should render the native input',
        () => { expect(nativeInput.exists()).toBe(true); },
      );
      it('should have a type prop', () => {
        expect(nativeInput.attributes('type')).toBe(propsData.type);
      });
      it('should have a bound value prop', () => {
        expect(nativeInput.element.value).toBe(propsData.value);
      });
      it(
        'should have input class',
        () => { expect(nativeInput.classes().includes('d-input')).toBe(true); },
      );
      it('should display the initial value prop', () => {
        expect(nativeInput.element.value).toBe(wrapper.vm.value);
      });
    });

    describe('When type is textarea', () => {
      // Test Setup
      beforeEach(async () => {
        await wrapper.setProps({ type: 'textarea' });
        _setChildWrappers();
      });

      it(
        'should render the native textarea',
        () => { expect(nativeTextarea.exists()).toBe(true); },
      );
      it(
        'should not have a type prop',
        () => { expect(nativeTextarea.attributes().type).not.toBeDefined(); },
      );
      it(
        'should not have a bound value prop',
        () => { expect(nativeTextarea.attributes().value).not.toBeDefined(); },
      );
      it(
        'should have textarea class',
        () => { expect(nativeTextarea.classes().includes('d-textarea')).toBe(true); },
      );
      it('should display the initial value prop', () => {
        expect(nativeTextarea.element.value).toBe(wrapper.vm.value);
      });
    });

    describe('When a label visible prop is false', () => {
      // Test Setup
      beforeEach(async () => {
        await wrapper.setProps({ labelVisible: false });
        _setChildWrappers();
      });

      it(
        'should not render a label',
        () => { expect(label.exists()).toBe(false); },
      );
    });

    describe('When a label is not provided', () => {
      // Test Setup
      beforeEach(async () => {
        await wrapper.setProps({ label: undefined });
        _setChildWrappers();
      });

      it(
        'should not render a label',
        () => { expect(label.exists()).toBe(false); },
      );
    });

    describe('When a description is not provided', () => {
      // Test Setup
      beforeEach(async () => { _setChildWrappers(); });

      it(
        'should not render a description',
        () => { expect(description.exists()).toBe(false); },
      );
      it('should not have aria details defined on label wrapper', () => {
        expect(labelWrapper.attributes('aria-details')).toBeFalsy();
      });
    });

    describe('When a description is provided via prop', () => {
      // Test Setup
      beforeEach(async () => {
        await wrapper.setProps({ description: 'Description' });
        _setChildWrappers();
      });

      itBehavesLikeRendersDescription('Description');
    });

    describe('When a description is provided via slot', () => {
      // Test Setup
      beforeEach(async () => {
        slots = { description: 'Description' };
        _mountWrapper();
        _setChildWrappers();
      });

      itBehavesLikeRendersDescription('Description');
    });

    describe('When an inputClass prop is provided', () => {
      // Test Setup
      beforeEach(async () => {
        await wrapper.setProps({ inputClass: 'd-fc-success' });
        _setChildWrappers();
      });

      it('Should apply the class to the input element.', () => {
        expect(nativeInput.classes('d-fc-success')).toBe(true);
      });
    });

    describe('When a left icon is provided', () => {
      // Shared Examples
      const itBehavesLikeRendersLeftInputIcon = (size = INPUT_SIZES.DEFAULT) => {
        it(
          'should render the icon wrapper',
          () => { expect(leftIconWrapper.exists()).toBe(true); },
        );
        it('should have input icon class', () => {
          expect(leftIconWrapper.classes().includes('d-input-icon')).toBe(true);
        });
        it('should have input icon side class', () => {
          expect(leftIconWrapper.classes().includes('d-input-icon--left')).toBe(true);
        });
        it(
          'should have input icon size class',
          () => { itBehavesLikeHasIconSizeClass(leftIconWrapper, size); },
        );
        it(
          'should render the provided icon',
          () => { expect(wrapper.findComponent(DtIcon).exists()).toBe(true); },
        );
      };

      // Test Setup
      beforeEach(async () => {
        slots = { leftIcon: iconPlus };
      });

      describe('When a size is not provided', () => {
        // Test Setup
        beforeEach(async () => {
          _mountWrapper();
          _setChildWrappers();
        });

        itBehavesLikeRendersLeftInputIcon();
      });

      describe('When a size is provided', () => {
        // Test Setup
        beforeEach(async () => {
          propsData = { size: INPUT_SIZES.EXTRA_LARGE };
          _mountWrapper();
          _setChildWrappers();
        });

        itBehavesLikeRendersLeftInputIcon(INPUT_SIZES.EXTRA_LARGE);
      });
    });

    describe('When a right icon is provided', () => {
      // Shared Examples
      const itBehavesLikeRendersRightInputIcon = (size = INPUT_SIZES.DEFAULT) => {
        it(
          'should render the icon wrapper',
          () => { expect(rightIconWrapper.exists()).toBe(true); },
        );
        it('should have input icon class', () => {
          expect(rightIconWrapper.classes().includes('d-input-icon')).toBe(true);
        });
        it('should have input icon side class', () => {
          expect(rightIconWrapper.classes().includes('d-input-icon--right')).toBe(true);
        });
        it(
          'should have input icon size class',
          () => { itBehavesLikeHasIconSizeClass(rightIconWrapper, size); },
        );
        it(
          'should render the provided icon',
          () => { expect(wrapper.findComponent(DtIcon).exists()).toBe(true); },
        );
      };

      // Test Setup
      beforeEach(async () => {
        slots = { rightIcon: iconPlus };
      });

      describe('When a size is not provided', () => {
        // Test Setup
        beforeEach(async () => {
          _mountWrapper();
          _setChildWrappers();
        });

        itBehavesLikeRendersRightInputIcon();
      });

      describe('When a size is provided', () => {
        // Test Setup
        beforeEach(async () => {
          propsData = { size: INPUT_SIZES.EXTRA_LARGE };
          _mountWrapper();
          _setChildWrappers();
        });

        itBehavesLikeRendersRightInputIcon(INPUT_SIZES.EXTRA_LARGE);
      });
    });

    describe('When no validation message(s) are provided', () => {
      it('should not render any validation messages', () => {
        expect(wrapper.findAll('.d-validation-message').length).toEqual(0);
      });
      it(
        'should not have an input state',
        () => { expect(wrapper.vm.inputState).toBeNull(); },
      );
    });

    describe('When validation message(s) are provided', () => {
      it('should display error messages', async () => {
        const errorMessage1 = 'error message 1';
        const errorMessage2 = 'error message 2';

        await wrapper.setProps({
          showMessages: false,
          messages: [
            errorMessage1,
            { message: errorMessage2, type: 'error' },
          ],
        });
        expect(wrapper.findAll('.d-validation-message').length).toEqual(0);
        expect(wrapper.vm.inputState).toEqual('error');

        await wrapper.setProps({ showMessages: true });

        const inputErrorMessages = wrapper.findAll('.d-validation-message--error');
        expect(inputErrorMessages.length).toEqual(2);
        expect(inputErrorMessages.at(0).text()).toEqual(errorMessage1);
        expect(inputErrorMessages.at(1).text()).toEqual(errorMessage2);
      });

      it(
        'should ignore all other message types if at least 1 error message is present',
        async () => {
          const strErrorMessage = 'string error message';

          await wrapper.setProps({
            messages: [
              strErrorMessage,
              { message: 'formatted warning message', type: 'warning' },
              { message: 'formatted success message', type: 'success' },
            ],
          });
          expect(wrapper.vm.inputState).toEqual('error');

          const inputMessages = wrapper.findAll('.d-validation-message');
          const inputErrorMessages = wrapper.findAll('.d-validation-message--error');
          expect(inputMessages.length).toEqual(1);
          expect(inputErrorMessages.length).toEqual(1);
          expect(inputErrorMessages.at(0).text()).toEqual(strErrorMessage);
        },
      );

      it(
        'should display warning messages only if no error messages are present',
        async () => {
          const warningMessage = 'formatted warning message';

          await wrapper.setProps({
            messages: [
              { message: warningMessage, type: 'warning' },
              { message: 'formatted success message', type: 'success' },
            ],
          });
          expect(wrapper.vm.inputState).toEqual('warning');

          const inputMessages = wrapper.findAll('.d-validation-message');
          const inputWarningMessages = wrapper.findAll('.d-validation-message--warning');
          expect(inputMessages.length).toEqual(1);
          expect(inputWarningMessages.length).toEqual(1);
          expect(inputWarningMessages.at(0).text()).toEqual(warningMessage);
        },
      );

      it(
        'should display success messages only if no other types are present',
        async () => {
          const successMessage1 = 'formatted success message 1';
          const successMessage2 = 'formatted success message 2';

          await wrapper.setProps({
            messages: [
              { message: successMessage1, type: 'success' },
              { message: successMessage2, type: 'success' },
            ],
          });
          expect(wrapper.vm.inputState).toEqual('success');

          const inputMessages = wrapper.findAll('.d-validation-message');
          const inputSuccessMessages = wrapper.findAll('.d-validation-message--success');
          expect(inputMessages.length).toEqual(2);
          expect(inputSuccessMessages.length).toEqual(2);
          expect(inputSuccessMessages.at(0).text()).toEqual(successMessage1);
          expect(inputSuccessMessages.at(1).text()).toEqual(successMessage2);
        },
      );
    });

    describe('When a size is provided', () => {
      // Test Environment
      let size;

      // Shared Examples
      const itBehavesLikeAddsInputAndLabelSizeClasses = () => {
        it('should add input size class', () => {
          expect(nativeInput.classes().includes(`d-input--${size}`)).toBe(true);
        });
        it(
          'should add label size class',
          () => { expect(label.classes().includes(`d-label--${size}`)).toBe(true); },
        );
      };

      // Test Setup
      beforeEach(async () => {
        propsData = { size, label: 'Label', description: 'Description' };
        _mountWrapper();
        _setChildWrappers();
      });

      describe('When size is EXTRA_SMALL', () => {
        // Test Setup
        beforeAll(() => {
          size = INPUT_SIZES.EXTRA_SMALL;
        });

        itBehavesLikeAddsInputAndLabelSizeClasses();
        it('should not add description size class', () => {
          expect(description.classes().includes(`d-description--${size}`)).toBe(false);
        });
      });

      describe('When size is EXTRA_LARGE', () => {
        // Test Setup
        beforeAll(() => {
          size = INPUT_SIZES.EXTRA_LARGE;
        });

        itBehavesLikeAddsInputAndLabelSizeClasses();
        it('should add description size class', () => {
          expect(description.classes().includes(`d-description--${size}`)).toBe(true);
        });
      });
    });

    describe('When the length validation props are provided', () => {
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
      beforeEach(async () => {
        propsData = {
          currentLength,
          validate,
        };
        _mountWrapper();
        _setChildWrappers();
      });

      describe('When the input length is below warning threshold and the input is focused', () => {
        // Test Setup
        beforeAll(() => {
          currentLength = 8;
          nativeInput.trigger('focus');
        });

        it('should not show the length validation message', () => {
          expect(wrapper.findAll('.d-validation-message').length).toEqual(0);
        });

        it('should show the length description', () => {
          expect(wrapper.find('[data-qa="dt-input-length-description"]').text()).toBe(validate.length.description);
        });
      });

      // todo: this test seems actually broken
      // describe('When the input length is above warning threshold and the input is focused', () => {
      //   // Test Setup
      //   beforeAll(() => {
      //     currentLength = 12;
      //   });

      //   it('should show a warning validation message', async () => {
      //     await nativeInput.trigger('focus');

      //     const inputMessages = wrapper.findAll('.d-validation-message');
      //     const inputWarningMessages = wrapper.findAll('.d-validation-message--warning');
      //     expect(inputMessages.length).toEqual(1);
      //     expect(inputWarningMessages.length).toEqual(1);
      //   });
      // });

      // todo: this test seems actually broken
      // describe('When the input length reaches exactly maximum length and the input is focused', () => {
      //   // Test Setup
      //   beforeAll(() => {
      //     currentLength = 20;
      //   });

      //   it('should show a warning validation message', async () => {
      //     await nativeInput.trigger('focus');

      //     const inputMessages = wrapper.findAll('.d-validation-message');
      //     const inputErrorMessages = wrapper.findAll('.d-validation-message--warning');
      //     expect(inputMessages.length).toEqual(1);
      //     expect(inputErrorMessages.length).toEqual(1);
      //   });
      // });

      describe('When the input length reaches the maximum length and the input is not focused', () => {
        // Test Setup
        beforeAll(() => {
          currentLength = 20;
        });

        it('should not show an error validation message', () => {
          expect(wrapper.find('[data-qa="dt-input-length-validation-message"]').exists()).toBe(false);
          const inputWarningMessages = wrapper.findAll('.d-validation-message--error');
          expect(inputWarningMessages.length).toEqual(0);
        });
      });

      describe('When the input has a invalid state', () => {
        // Test Setup
        beforeAll(() => {
          currentLength = 28;
        });

        it('should show an error validation message', async () => {
          await wrapper.setProps({ value: 'new value with 28 characters' });

          const inputMessages = wrapper.findAll('.d-validation-message');
          const inputErrorMessages = wrapper.findAll('.d-validation-message--error');
          expect(inputMessages.length).toEqual(1);
          expect(inputErrorMessages.length).toEqual(1);
        });
      });
    });
  });

  describe('Reactivity Tests', () => {
    describe('User Input Tests', () => {
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
        it('should handle input value', () => {
          expect(wrapper.emitted().input[0][0]).toEqual(userTextInputVal);
          expect(inputStub).toHaveBeenCalled();
        });
      };

      describe('When type is not a textarea', () => {
        // Test Setup
        beforeEach(async () => {
          await wrapper.setProps({ currentLength: null, validate });
          _setChildWrappers();
          nativeInput.setValue(userTextInputVal);
        });

        itBehavesLikeHandlesUserInput();

        describe('When a new value is provided', () => {
          // Test Setup
          beforeEach(async () => { await wrapper.setProps({ value: newValue }); });

          it(
            'should update input value',
            () => { expect(nativeInput.element.value).toEqual(newValue); },
          );
        });

        describe('When a new value exceeds the maximum length', () => {
          it('should emit an "update:invalid" event with true', async () => {
            await wrapper.setProps({ value: newValue });
            expect(wrapper.emitted()['update:invalid'][0][0]).toEqual(true);
          });
        });

        describe('When a new value is within the maximum length after exceeding it', () => {
          it('should emit an "update:invalid" event with false', async () => {
            await wrapper.setProps({ value: newValue });
            await wrapper.setProps({ value: userTextInputVal });
            expect(wrapper.emitted()['update:invalid'][1][0]).toEqual(false);
          });
        });
      });

      describe('When type is a textarea', () => {
        // Test Setup
        beforeEach(async () => {
          await wrapper.setProps({ type: 'textarea', currentLength: null, validate });
          _setChildWrappers();
          nativeTextarea.setValue(userTextInputVal);
        });

        itBehavesLikeHandlesUserInput();

        describe('When a new value is provided', () => {
          // Test Setup
          beforeEach(async () => { await wrapper.setProps({ value: newValue }); });

          it(
            'should update input value',
            () => { expect(nativeTextarea.element.value).toEqual(newValue); },
          );
        });

        describe('When a new value exceeds the maximum length', () => {
          it('should emit an "update:invalid" event with true', async () => {
            await wrapper.setProps({ value: newValue });
            expect(wrapper.emitted()['update:invalid'][0][0]).toEqual(true);
          });
        });

        describe('When a new value is within the maximum length after exceeding it', () => {
          it('should emit an "update:invalid" event with false', async () => {
            await wrapper.setProps({ value: newValue });
            await wrapper.setProps({ value: userTextInputVal });
            expect(wrapper.emitted()['update:invalid'][1][0]).toEqual(false);
          });
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    // Test Setup
    beforeEach(() => {
      _setChildWrappers();
    });

    it('should handle pass through props/attrs', async () => {
      // Validating all attrs from base-input get passed down to the native input.
      expect(nativeInput.attributes()).toMatchObject(attrs);
      expect(nativeInput.attributes().disabled).not.toBeDefined();

      await wrapper.setProps({ disabled: true });
      expect(nativeInput.attributes().disabled).toEqual('disabled');
    });
  });
});
