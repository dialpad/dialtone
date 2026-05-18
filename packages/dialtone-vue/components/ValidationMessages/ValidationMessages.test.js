import { mount } from '@vue/test-utils';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import DtValidationMessages from './ValidationMessages.vue';
import {
  setFormattedValidationMessages,
  addFormattedValidationMessage,
} from '../../tests/helpers/validation_messages';

const MOCK_BASE_VALIDATION_MESSAGES = [{
  message: 'Critical',
  type: VALIDATION_MESSAGE_TYPES.CRITICAL,
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
    wrapper?.unmount();
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    describe('When there is a positive validation message', () => {
      const MOCK_POSITIVE_VALIDATION_MESSAGE = 'Positive';

      beforeEach(() => {
        MOCK_VALIDATION_MESSAGES = setFormattedValidationMessages(
          VALIDATION_MESSAGE_TYPES.POSITIVE,
          MOCK_POSITIVE_VALIDATION_MESSAGE);
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
          expect(messages.at(0).text()).toBe(MOCK_POSITIVE_VALIDATION_MESSAGE);
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

        describe('When there is also a critical validation message', () => {
          const MOCK_CRITICAL_VALIDATION_MESSAGE = 'Critical';

          beforeEach(() => {
            MOCK_VALIDATION_MESSAGES = addFormattedValidationMessage(
              MOCK_VALIDATION_MESSAGES,
              VALIDATION_MESSAGE_TYPES.CRITICAL,
              MOCK_CRITICAL_VALIDATION_MESSAGE,
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
              expect(messages.at(0).text()).toBe(MOCK_CRITICAL_VALIDATION_MESSAGE);
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

      describe('When there is also a correct positive validation message', () => {
        describe('When the validation message renders', () => {
          it('should not have any visible validation messages', () => {
            const MOCK_POSITIVE_VALIDATION_MESSAGE = 'Positive';

            MOCK_VALIDATION_MESSAGES = addFormattedValidationMessage(
              MOCK_VALIDATION_MESSAGES,
              VALIDATION_MESSAGE_TYPES.POSITIVE,
              MOCK_POSITIVE_VALIDATION_MESSAGE,
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

  describe('Icon Tests', () => {
    beforeEach(() => {
      mockProps = { validationMessages: MOCK_BASE_VALIDATION_MESSAGES };

      updateWrapper();
    });

    it('renders the icon wrapper', () => {
      expect(wrapper.find('[data-qa="validation-message-icon"]').exists()).toBe(true);
    });

    describe('When type is warning', () => {
      beforeEach(() => {
        mockProps = {
          validationMessages: setFormattedValidationMessages(
            VALIDATION_MESSAGE_TYPES.WARNING,
            'Warning message',
          ),
        };

        updateWrapper();
      });

      it('renders the warning icon', () => {
        expect(wrapper.find('[data-qa="validation-message-icon"]').classes()).toContain('d-icon--alert-triangle');
      });
    });

    describe('When type is critical', () => {
      beforeEach(() => {
        mockProps = {
          validationMessages: setFormattedValidationMessages(
            VALIDATION_MESSAGE_TYPES.CRITICAL,
            'Critical message',
          ),
        };

        updateWrapper();
      });

      it('renders the critical icon', () => {
        expect(wrapper.find('[data-qa="validation-message-icon"]').classes()).toContain('d-icon--alert-circle');
      });
    });

    describe('When type is positive', () => {
      beforeEach(() => {
        mockProps = {
          validationMessages: setFormattedValidationMessages(
            VALIDATION_MESSAGE_TYPES.POSITIVE,
            'Positive message',
          ),
        };

        updateWrapper();
      });

      it('renders the positive icon', () => {
        expect(wrapper.find('[data-qa="validation-message-icon"]').classes()).toContain('d-icon--check-circle');
      });
    });

    describe('When type is info', () => {
      beforeEach(() => {
        mockProps = {
          validationMessages: setFormattedValidationMessages(
            VALIDATION_MESSAGE_TYPES.INFO,
            'Info message',
          ),
        };

        updateWrapper();
      });

      it('renders the info icon', () => {
        expect(wrapper.find('[data-qa="validation-message-icon"]').classes()).toContain('d-icon--info');
      });
    });

    describe('When the icon slot is overridden', () => {
      beforeEach(() => {
        mockProps = {
          validationMessages: setFormattedValidationMessages(
            VALIDATION_MESSAGE_TYPES.CRITICAL,
            'Critical message',
          ),
        };

        wrapper = mount(DtValidationMessages, {
          props: { ...baseProps, ...mockProps },
          slots: { icon: '<svg class="d-icon d-icon--custom-test" data-qa="dt-icon" />' },
        });

        messages = wrapper.findAll('[data-qa="validation-message"]');
      });

      it('renders the custom icon', () => {
        expect(wrapper.find('[data-qa="dt-icon"]').classes()).toContain('d-icon--custom-test');
      });

      it('does not render the default icon', () => {
        expect(wrapper.find('[data-qa="validation-message-icon"]').exists()).toBe(false);
      });
    });

    describe('When iconClass prop is provided', () => {
      beforeEach(() => {
        mockProps = {
          validationMessages: setFormattedValidationMessages(
            VALIDATION_MESSAGE_TYPES.CRITICAL,
            'Critical message',
          ),
          iconClass: 'custom-class',
        };

        updateWrapper();
      });

      it('applies iconClass to the icon wrapper', () => {
        expect(wrapper.find('[data-qa="validation-message-icon"]').classes()).toContain('custom-class');
      });
    });
  });

  describe('Validation Tests', () => {
    describe('When there are validation messages', () => {
      const MOCK_PROP = DtValidationMessages.props.validationMessages;

      it('passes custom prop validation', () => {
        expect(MOCK_PROP.validator(['Critical'])).toBe(true);
      });

      describe('When the provided messages are numeric', () => {
        it('fails custom prop validation', () => {
          expect(MOCK_PROP.validator([123])).toBe(false);
        });
      });

      describe('When the type is info', () => {
        it('passes custom prop validation', () => {
          expect(MOCK_PROP.validator([{ message: 'Info message', type: VALIDATION_MESSAGE_TYPES.INFO }])).toBe(true);
        });
      });

      describe('When the type is unknown', () => {
        it('fails custom prop validation', () => {
          expect(MOCK_PROP.validator([{ message: 'Unknown', type: 'unknown' }])).toBe(false);
        });
      });
    });
  });
});
