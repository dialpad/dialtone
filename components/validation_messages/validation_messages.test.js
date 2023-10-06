import { mount } from '@vue/test-utils';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import DtValidationMessages from './validation_messages.vue';
import {
  setFormattedValidationMessages,
  addFormattedValidationMessage,
} from '../../tests/helpers/validation_messages';

const MOCK_BASE_VALIDATION_MESSAGES = [{
  message: 'Error',
  type: VALIDATION_MESSAGE_TYPES.ERROR,
}];

let MOCK_VALIDATION_MESSAGES;

const baseProps = {};

let mockProps = {};

describe('Validation Messages Tests', () => {
  let wrapper;
  let messages;

  const updateWrapper = () => {
    wrapper = mount(DtValidationMessages, {
      props: { ...baseProps, ...mockProps },
    });

    messages = wrapper.findAll('[data-qa="validation-message"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    describe('When there is a success validation message', () => {
      const MOCK_SUCCESS_VALIDATION_MESSAGE = 'Success';

      beforeEach(() => {
        MOCK_VALIDATION_MESSAGES = setFormattedValidationMessages(
          VALIDATION_MESSAGE_TYPES.SUCCESS,
          MOCK_SUCCESS_VALIDATION_MESSAGE);
      });

      describe('When the radio group renders', () => {
        beforeEach(() => {
          mockProps = { validationMessages: MOCK_VALIDATION_MESSAGES };

          updateWrapper();
        });

        it('should have expected number of visible validation messages', () => {
          expect(messages.length).toBe(1);
        });

        it('should have matching first validation message', () => {
          expect(messages.at(0).text()).toBe(MOCK_SUCCESS_VALIDATION_MESSAGE);
        });
      });

      describe('When validation messages are hidden', () => {
        describe('When the radio group renders', () => {
          it('should not have any visible validation messages', () => {
            mockProps = { validationMessages: MOCK_VALIDATION_MESSAGES, showMessages: false };

            updateWrapper();

            expect(messages.length).toBe(0);
          });
        });
      });

      describe('When there is also a warning validation message', () => {
        const MOCK_WARNING_VALIDATION_MESSAGE = 'Warning';

        beforeEach(() => {
          MOCK_VALIDATION_MESSAGES = addFormattedValidationMessage(
            MOCK_VALIDATION_MESSAGES,
            VALIDATION_MESSAGE_TYPES.WARNING,
            MOCK_WARNING_VALIDATION_MESSAGE,
          );
        });

        describe('When the radio group renders', () => {
          beforeEach(() => {
            mockProps = { validationMessages: MOCK_VALIDATION_MESSAGES };

            updateWrapper();
          });

          it('should have expected number of visible validation messages', () => {
            expect(messages.length).toBe(1);
          });

          it('should have matching first validation message', () => {
            expect(messages.at(0).text()).toBe(MOCK_WARNING_VALIDATION_MESSAGE);
          });
        });

        describe('When there is also an error validation message', () => {
          const MOCK_ERROR_VALIDATION_MESSAGE = 'Error';

          beforeEach(() => {
            MOCK_VALIDATION_MESSAGES = addFormattedValidationMessage(
              MOCK_VALIDATION_MESSAGES,
              VALIDATION_MESSAGE_TYPES.ERROR,
              MOCK_ERROR_VALIDATION_MESSAGE,
            );
          });

          describe('When the radio group renders', () => {
            beforeEach(() => {
              mockProps = { validationMessages: MOCK_VALIDATION_MESSAGES };

              updateWrapper();
            });

            it('should have expected number of visible validation messages', () => {
              expect(messages.length).toBe(1);
            });

            it('should have matching first validation message', () => {
              expect(messages.at(0).text()).toBe(MOCK_ERROR_VALIDATION_MESSAGE);
            });
          });
        });
      });
    });

    describe('When there are malformed validation messages', () => {
      const MOCK_EMPTY_VALIDATION_MESSAGE = '';

      beforeEach(() => {
        MOCK_VALIDATION_MESSAGES = setFormattedValidationMessages(
          VALIDATION_MESSAGE_TYPES.WARNING,
          MOCK_EMPTY_VALIDATION_MESSAGE);
      });

      describe('When there is a warning validation message with an empty message', () => {
        it('should not have any visible validation messages', () => {
          mockProps = { validationMessages: MOCK_VALIDATION_MESSAGES };

          updateWrapper();

          expect(messages.length).toBe(0);
        });
      });

      describe('When there is also a correct success validation message', () => {
        describe('When the validation message renders', () => {
          it('should not have any visible validation messages', () => {
            const MOCK_SUCCESS_VALIDATION_MESSAGE = 'Success';

            MOCK_VALIDATION_MESSAGES = addFormattedValidationMessage(
              MOCK_VALIDATION_MESSAGES,
              VALIDATION_MESSAGE_TYPES.SUCCESS,
              MOCK_SUCCESS_VALIDATION_MESSAGE,
            );

            mockProps = { validationMessages: MOCK_VALIDATION_MESSAGES };

            updateWrapper();

            expect(messages.length).toBe(0);
          });
        });
      });

      describe('When there is also a correct warning validation message', () => {
        describe('When the validation message renders', () => {
          const MOCK_WARNING_VALIDATION_MESSAGE = 'Warning';

          beforeEach(() => {
            MOCK_VALIDATION_MESSAGES = addFormattedValidationMessage(
              MOCK_VALIDATION_MESSAGES,
              VALIDATION_MESSAGE_TYPES.WARNING,
              MOCK_WARNING_VALIDATION_MESSAGE,
            );

            mockProps = { validationMessages: MOCK_VALIDATION_MESSAGES };

            updateWrapper();
          });

          it('should have expected number of visible validation messages', () => {
            expect(messages.length).toBe(1);
          });

          it('should have matching first validation message', () => {
            expect(messages.at(0).text()).toBe(MOCK_WARNING_VALIDATION_MESSAGE);
          });
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When there is a validation message', () => {
      beforeEach(() => {
        mockProps = { validationMessages: MOCK_BASE_VALIDATION_MESSAGES };

        updateWrapper();
      });

      describe('When validation messages are shown', () => {
        it('has a status role', () => {
          expect(messages.at(0).attributes('role')).toBe('status');
        });

        it('has aria-live set to polite', () => {
          expect(messages.at(0).attributes('aria-live')).toBe('polite');
        });
      });
    });
  });

  describe('Validation Tests', () => {
    describe('When there are validation messages', () => {
      const MOCK_PROP = DtValidationMessages.props.validationMessages;

      it('passes custom prop validation', () => {
        expect(MOCK_PROP.validator(['Error'])).toBe(true);
      });

      describe('When the provided messages are numeric', () => {
        it('fails custom prop validation', () => {
          expect(MOCK_PROP.validator([123])).toBe(false);
        });
      });
    });
  });
});
