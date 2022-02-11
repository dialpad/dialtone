import { assert } from 'chai';
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

describe('Validation Messages Tests', function () {
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
      localVue: this.localVue,
    });
    messages = wrapper.findAll('[data-qa="validation-message"]');
  };

  // Test Setup
  before(function () {
    this.localVue = createLocalVue();
  });

  // Test Teardown
  afterEach(function () {
    propsData = basePropsData;
    attrs = {};
  });

  describe('Presentation Tests', function () {
    // Shared Examples
    const itBehavesLikeHasNoVisibleValidationMessages = () => {
      it('should not have any visible validation messages', function () { assert.lengthOf(messages, 0); });
    };

    const itBehavesLikeHasValidationMessages = (validationMessagesVisible, firstVisibleValidationMessage) => {
      it('should have expected number of visible validation messages', function () {
        assert.lengthOf(messages, validationMessagesVisible);
      });

      it('should have matching first validation message', function () {
        assert.strictEqual(messages.at(0).text(), firstVisibleValidationMessage);
      });
    };

    describe('When there is a success validation message', function () {
      // Test Environment
      const successValidationMessage = 'Success';

      // Test Setup
      beforeEach(function () {
        validationMessages = setFormattedValidationMessages(VALIDATION_MESSAGE_TYPES.SUCCESS, successValidationMessage);
      });

      describe('When the radio group renders', function () {
        // Test Setup
        beforeEach(function () {
          propsData = { ...basePropsData, validationMessages };
          _setWrappers();
        });

        itBehavesLikeHasValidationMessages(1, successValidationMessage);
      });

      describe('When validation messages are hidden', function () {
        // Test Setup
        beforeEach(function () {
          propsData = { ...basePropsData, validationMessages, showMessages: false };
        });

        describe('When the radio group renders', function () {
          // Test Setup
          beforeEach(function () { _setWrappers(); });

          itBehavesLikeHasNoVisibleValidationMessages();
        });
      });

      describe('When there is also a warning validation message', function () {
        // Test Environment
        const warningValidationMessage = 'Warning';

        // Test Setup
        beforeEach(function () {
          validationMessages = addFormattedValidationMessage(
            validationMessages,
            VALIDATION_MESSAGE_TYPES.WARNING,
            warningValidationMessage,
          );
        });

        describe('When the radio group renders', function () {
          // Test Setup
          beforeEach(function () {
            propsData = { ...basePropsData, validationMessages };
            _setWrappers();
          });

          itBehavesLikeHasValidationMessages(1, warningValidationMessage);
        });

        describe('When there is also an error validation message', function () {
          // Test Environment
          const errorValidationMessage = 'Error';

          // Test Setup
          beforeEach(function () {
            validationMessages = addFormattedValidationMessage(
              validationMessages,
              VALIDATION_MESSAGE_TYPES.ERROR,
              errorValidationMessage,
            );
          });

          describe('When the radio group renders', function () {
            // Test Setup
            beforeEach(function () {
              propsData = { ...basePropsData, validationMessages };
              _setWrappers();
            });

            itBehavesLikeHasValidationMessages(1, errorValidationMessage);
          });
        });
      });
    });

    describe('When there are malformed validation messages', function () {
      // Test Environment
      const emptyValidationMessage = '';

      // Test Setup
      beforeEach(function () {
        validationMessages = setFormattedValidationMessages(VALIDATION_MESSAGE_TYPES.WARNING, emptyValidationMessage);
      });

      describe('When there is a warning validation message with an empty message', function () {
        // Test Setup
        beforeEach(function () {
          propsData = { ...basePropsData, validationMessages };
          _setWrappers();
        });

        itBehavesLikeHasNoVisibleValidationMessages();
      });

      describe('When there is also a correct success validation message', function () {
        // Test Environment
        const successValidationMessage = 'Success';

        // Test Setup
        beforeEach(function () {
          validationMessages = addFormattedValidationMessage(
            validationMessages,
            VALIDATION_MESSAGE_TYPES.SUCCESS,
            successValidationMessage,
          );
        });

        describe('When the validation message renders', function () {
          // Test Setup
          beforeEach(function () {
            propsData = { ...basePropsData, validationMessages };
            _setWrappers();
          });

          itBehavesLikeHasNoVisibleValidationMessages();
        });
      });

      describe('When there is also a correct warning validation message', function () {
        // Test Environment
        const warningValidationMessage = 'Warning';

        // Test Setup
        beforeEach(function () {
          validationMessages = addFormattedValidationMessage(
            validationMessages,
            VALIDATION_MESSAGE_TYPES.WARNING,
            warningValidationMessage,
          );
        });

        describe('When the validation message renders', function () {
          // Test Setup
          beforeEach(function () {
            propsData = { ...basePropsData, validationMessages };
            _setWrappers();
          });

          itBehavesLikeHasValidationMessages(1, warningValidationMessage);
        });
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('When there is a validation message', function () {
      // Test Setup
      beforeEach(function () {
        propsData = { ...basePropsData, validationMessages: baseValidationMessages };
      });

      describe('When validation messages are shown', function () {
        // Test Setup
        beforeEach(function () { _setWrappers(); });

        it('has a status role', function () { assert.strictEqual(messages.at(0).attributes('role'), 'status'); });
        it('has aria-live set to polite', function () {
          assert.strictEqual(messages.at(0).attributes('aria-live'), 'polite');
        });
      });
    });
  });

  describe('Validation Tests', function () {
    describe('When there are validation messages', function () {
      // Test Environment
      const prop = DtValidationMessages.props.validationMessages;

      itBehavesLikePassesCustomPropValidation(prop, ['Error']);

      describe('When the provided messages are numeric', function () {
        itBehavesLikeFailsCustomPropValidation(prop, [123]);
      });
    });
  });
});
