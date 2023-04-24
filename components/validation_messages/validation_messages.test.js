import { createLocalVue, shallowMount } from '@vue/test-utils';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import DtValidationMessages from './validation_messages.vue';
import {
  setFormattedValidationMessages,
  addFormattedValidationMessage,
} from '../../tests/helpers/validation_messages';
import {
  itBehavesLikePassesCustomPropValidation,
  itBehavesLikeFailsCustomPropValidation,
} from '../../tests/shared_examples/validation';

// Test Constants
const basePropsData = {};
const baseValidationMessages = [{
  message: 'Error',
  type: VALIDATION_MESSAGE_TYPES.ERROR,
}];

describe('Validation Messages Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let messages;

  // Test Environment
  let propsData = basePropsData;
  let attrs = {};
  let validationMessages;

  // Helpers
  const _setWrappers = () => {
    wrapper = shallowMount(DtValidationMessages, {
      propsData,
      attrs,
      localVue: testContext.localVue,
    });
    messages = wrapper.findAll('[data-qa="validation-message"]');
  };

  // Test Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  // Test Teardown
  afterEach(() => {
    propsData = basePropsData;
    attrs = {};
  });

  describe('Presentation Tests', () => {
    // Shared Examples
    const itBehavesLikeHasNoVisibleValidationMessages = () => {
      it(
        'should not have any visible validation messages',
        () => { expect(messages.length).toBe(0); },
      );
    };

    const itBehavesLikeHasValidationMessages = (validationMessagesVisible, firstVisibleValidationMessage) => {
      it(
        'should have expected number of visible validation messages',
        () => {
          expect(messages.length).toBe(validationMessagesVisible);
        },
      );

      it('should have matching first validation message', () => {
        expect(messages.at(0).text()).toBe(firstVisibleValidationMessage);
      });
    };

    describe('When there is a success validation message', () => {
      // Test Environment
      const successValidationMessage = 'Success';

      // Test Setup
      beforeEach(() => {
        validationMessages = setFormattedValidationMessages(VALIDATION_MESSAGE_TYPES.SUCCESS, successValidationMessage);
      });

      describe('When the radio group renders', () => {
        // Test Setup
        beforeEach(() => {
          propsData = { ...basePropsData, validationMessages };
          _setWrappers();
        });

        itBehavesLikeHasValidationMessages(1, successValidationMessage);
      });

      describe('When validation messages are hidden', () => {
        // Test Setup
        beforeEach(() => {
          propsData = { ...basePropsData, validationMessages, showMessages: false };
        });

        describe('When the radio group renders', () => {
          // Test Setup
          beforeEach(() => { _setWrappers(); });

          itBehavesLikeHasNoVisibleValidationMessages();
        });
      });

      describe('When there is also a warning validation message', () => {
        // Test Environment
        const warningValidationMessage = 'Warning';

        // Test Setup
        beforeEach(() => {
          validationMessages = addFormattedValidationMessage(
            validationMessages,
            VALIDATION_MESSAGE_TYPES.WARNING,
            warningValidationMessage,
          );
        });

        describe('When the radio group renders', () => {
          // Test Setup
          beforeEach(() => {
            propsData = { ...basePropsData, validationMessages };
            _setWrappers();
          });

          itBehavesLikeHasValidationMessages(1, warningValidationMessage);
        });

        describe('When there is also an error validation message', () => {
          // Test Environment
          const errorValidationMessage = 'Error';

          // Test Setup
          beforeEach(() => {
            validationMessages = addFormattedValidationMessage(
              validationMessages,
              VALIDATION_MESSAGE_TYPES.ERROR,
              errorValidationMessage,
            );
          });

          describe('When the radio group renders', () => {
            // Test Setup
            beforeEach(() => {
              propsData = { ...basePropsData, validationMessages };
              _setWrappers();
            });

            itBehavesLikeHasValidationMessages(1, errorValidationMessage);
          });
        });
      });
    });

    describe('When there are malformed validation messages', () => {
      // Test Environment
      const emptyValidationMessage = '';

      // Test Setup
      beforeEach(() => {
        validationMessages = setFormattedValidationMessages(VALIDATION_MESSAGE_TYPES.WARNING, emptyValidationMessage);
      });

      describe('When there is a warning validation message with an empty message', () => {
        // Test Setup
        beforeEach(() => {
          propsData = { ...basePropsData, validationMessages };
          _setWrappers();
        });

        itBehavesLikeHasNoVisibleValidationMessages();
      });

      describe('When there is also a correct success validation message', () => {
        // Test Environment
        const successValidationMessage = 'Success';

        // Test Setup
        beforeEach(() => {
          validationMessages = addFormattedValidationMessage(
            validationMessages,
            VALIDATION_MESSAGE_TYPES.SUCCESS,
            successValidationMessage,
          );
        });

        describe('When the validation message renders', () => {
          // Test Setup
          beforeEach(() => {
            propsData = { ...basePropsData, validationMessages };
            _setWrappers();
          });

          itBehavesLikeHasNoVisibleValidationMessages();
        });
      });

      describe('When there is also a correct warning validation message', () => {
        // Test Environment
        const warningValidationMessage = 'Warning';

        // Test Setup
        beforeEach(() => {
          validationMessages = addFormattedValidationMessage(
            validationMessages,
            VALIDATION_MESSAGE_TYPES.WARNING,
            warningValidationMessage,
          );
        });

        describe('When the validation message renders', () => {
          // Test Setup
          beforeEach(() => {
            propsData = { ...basePropsData, validationMessages };
            _setWrappers();
          });

          itBehavesLikeHasValidationMessages(1, warningValidationMessage);
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When there is a validation message', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, validationMessages: baseValidationMessages };
      });

      describe('When validation messages are shown', () => {
        // Test Setup
        beforeEach(() => { _setWrappers(); });

        it(
          'has a status role',
          () => { expect(messages.at(0).attributes('role')).toBe('status'); },
        );
        it('has aria-live set to polite', () => {
          expect(messages.at(0).attributes('aria-live')).toBe('polite');
        });
      });
    });
  });

  describe('Validation Tests', () => {
    describe('When there are validation messages', () => {
      // Test Environment
      const prop = DtValidationMessages.props.validationMessages;

      itBehavesLikePassesCustomPropValidation(prop, ['Error']);

      describe('When the provided messages are numeric', () => {
        itBehavesLikeFailsCustomPropValidation(prop, [123]);
      });
    });
  });
});
