import { render, cleanup, type RenderResult } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { formatMessages, type ValidationMessage } from '../../common/utils';
import { DtValidationMessages, type DtValidationMessagesProps } from './ValidationMessages';
import {
  setFormattedValidationMessages,
  addFormattedValidationMessage,
} from '../../tests/helpers/validation_messages';

const MOCK_BASE_VALIDATION_MESSAGES: ValidationMessage[] = [{
  message: 'Critical',
  type: VALIDATION_MESSAGE_TYPES.CRITICAL,
}];

let MOCK_VALIDATION_MESSAGES: ValidationMessage[];
let mockProps: DtValidationMessagesProps = {};
let result: RenderResult;

// The library uses data-qa hooks, not data-testid.
const qa = (name: string) => {
  const element = document.querySelector(`[data-qa="${name}"]`);
  if (!element) throw new Error(`No element with data-qa="${name}"`);
  return element;
};
const container = () => qa('validation-messages-container');
const getMessages = () => document.querySelectorAll('[data-qa="validation-message"]');
const mountComponent = () => {
  result = render(<DtValidationMessages {...mockProps} />);
};

describe('Validation Messages Tests', () => {
  beforeEach(() => {
    mockProps = {};
  });

  afterEach(() => {
    cleanup();
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
          mountComponent();
        });

        it('should have expected number of visible validation messages', () => {
          expect(getMessages()).toHaveLength(1);
        });

        it('should have matching first validation message', () => {
          expect(getMessages()[0]).toHaveTextContent(new RegExp(`^${MOCK_POSITIVE_VALIDATION_MESSAGE}$`));
        });
      });

      describe('When validation messages are hidden', () => {
        describe('When the radio group renders', () => {
          it('should not have any visible validation messages', () => {
            mockProps = { validationMessages: MOCK_VALIDATION_MESSAGES, showMessages: false };
            mountComponent();

            expect(getMessages()).toHaveLength(0);
          });

          it('should keep the live-region container mounted', () => {
            mockProps = { validationMessages: MOCK_VALIDATION_MESSAGES, showMessages: false };
            mountComponent();

            expect(container()).toBeInTheDocument();
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
            mountComponent();
          });

          it('should have expected number of visible validation messages', () => {
            expect(getMessages()).toHaveLength(1);
          });

          it('should have matching first validation message', () => {
            expect(getMessages()[0]).toHaveTextContent(new RegExp(`^${MOCK_WARNING_VALIDATION_MESSAGE}$`));
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
              mountComponent();
            });

            it('should have expected number of visible validation messages', () => {
              expect(getMessages()).toHaveLength(1);
            });

            it('should have matching first validation message', () => {
              expect(getMessages()[0]).toHaveTextContent(new RegExp(`^${MOCK_CRITICAL_VALIDATION_MESSAGE}$`));
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
          mountComponent();

          expect(getMessages()).toHaveLength(0);
        });
      });

      describe('When there is also a correct positive validation message', () => {
        describe('When the validation message renders', () => {
          it('should not have any visible validation messages', () => {
            MOCK_VALIDATION_MESSAGES = addFormattedValidationMessage(
              MOCK_VALIDATION_MESSAGES,
              VALIDATION_MESSAGE_TYPES.POSITIVE,
              'Positive',
            );
            mockProps = { validationMessages: MOCK_VALIDATION_MESSAGES };
            mountComponent();

            expect(getMessages()).toHaveLength(0);
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
            mountComponent();
          });

          it('should have expected number of visible validation messages', () => {
            expect(getMessages()).toHaveLength(1);
          });

          it('should have matching first validation message', () => {
            expect(getMessages()[0]).toHaveTextContent(new RegExp(`^${MOCK_WARNING_VALIDATION_MESSAGE}$`));
          });
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When there are no messages', () => {
      it('renders the live-region container', () => {
        mountComponent();

        expect(container()).toBeInTheDocument();
      });
    });

    describe('When there is a validation message', () => {
      beforeEach(() => {
        mockProps = { validationMessages: MOCK_BASE_VALIDATION_MESSAGES };
        mountComponent();
      });

      it('has aria-live set to assertive on the container', () => {
        expect(container()).toHaveAttribute('aria-live', 'assertive');
      });

      it('does not re-mount the live-region container when messages change', () => {
        const containerBefore = container();

        result.rerender(<DtValidationMessages validationMessages={[]} />);
        result.rerender(<DtValidationMessages validationMessages={MOCK_BASE_VALIDATION_MESSAGES} />);

        expect(container()).toBe(containerBefore);
      });
    });

    describe('When id prop is provided', () => {
      it('binds the id to the container', () => {
        mockProps = { id: 'test-messages-id', validationMessages: MOCK_BASE_VALIDATION_MESSAGES };
        mountComponent();

        expect(container()).toHaveAttribute('id', 'test-messages-id');
      });
    });
  });

  describe('Icon Tests', () => {
    const icon = () => qa('validation-message-icon');

    beforeEach(() => {
      mockProps = { validationMessages: MOCK_BASE_VALIDATION_MESSAGES };
      mountComponent();
    });

    it('renders the icon wrapper', () => {
      expect(icon()).toBeInTheDocument();
    });

    describe('When type is warning', () => {
      beforeEach(() => {
        cleanup();
        mockProps = { validationMessages: setFormattedValidationMessages(VALIDATION_MESSAGE_TYPES.WARNING, 'Warning message') };
        mountComponent();
      });

      it('renders the warning icon', () => {
        expect(icon()).toHaveClass('d-icon--alert-triangle');
      });
    });

    describe('When type is critical', () => {
      beforeEach(() => {
        cleanup();
        mockProps = { validationMessages: setFormattedValidationMessages(VALIDATION_MESSAGE_TYPES.CRITICAL, 'Critical message') };
        mountComponent();
      });

      it('renders the critical icon', () => {
        expect(icon()).toHaveClass('d-icon--alert-circle');
      });
    });

    describe('When type is positive', () => {
      beforeEach(() => {
        cleanup();
        mockProps = { validationMessages: setFormattedValidationMessages(VALIDATION_MESSAGE_TYPES.POSITIVE, 'Positive message') };
        mountComponent();
      });

      it('renders the positive icon', () => {
        expect(icon()).toHaveClass('d-icon--check-circle');
      });
    });

    describe('When type is info', () => {
      beforeEach(() => {
        cleanup();
        mockProps = { validationMessages: setFormattedValidationMessages(VALIDATION_MESSAGE_TYPES.INFO, 'Info message') };
        mountComponent();
      });

      it('renders the info icon', () => {
        expect(icon()).toHaveClass('d-icon--info');
      });
    });

    describe('When the icon slot is overridden', () => {
      beforeEach(() => {
        cleanup();
        mockProps = {
          validationMessages: setFormattedValidationMessages(VALIDATION_MESSAGE_TYPES.CRITICAL, 'Critical message'),
          icon: <svg className="d-icon d-icon--custom-test" data-qa="dt-icon" />,
        };
        mountComponent();
      });

      it('renders the custom icon', () => {
        expect(qa('dt-icon')).toHaveClass('d-icon--custom-test');
      });

      it('does not render the default icon', () => {
        expect(document.querySelector('[data-qa="validation-message-icon"]')).not.toBeInTheDocument();
      });
    });

    describe('When iconClass prop is provided', () => {
      beforeEach(() => {
        cleanup();
        mockProps = {
          validationMessages: setFormattedValidationMessages(VALIDATION_MESSAGE_TYPES.CRITICAL, 'Critical message'),
          iconClass: 'custom-class',
        };
        mountComponent();
      });

      it('applies iconClass to the icon wrapper', () => {
        expect(icon()).toHaveClass('custom-class');
      });
    });
  });

  // Vue validates the prop at runtime; React types it, so these check that the component accepts valid
  // input and renders nothing for input the Vue validator would reject.
  describe('Validation Tests', () => {
    describe('When there are validation messages', () => {
      it('passes custom prop validation', () => {
        mockProps = { validationMessages: formatMessages(['Critical']) };
        mountComponent();

        expect(getMessages()).toHaveLength(1);
        expect(getMessages()[0]).toHaveTextContent(/^Critical$/);
      });

      describe('When the provided messages are numeric', () => {
        it('fails custom prop validation', () => {
          mockProps = { validationMessages: [123] as unknown as ValidationMessage[] };
          mountComponent();

          expect(getMessages()).toHaveLength(0);
        });
      });

      describe('When the type is info', () => {
        it('passes custom prop validation', () => {
          mockProps = { validationMessages: [{ message: 'Info message', type: VALIDATION_MESSAGE_TYPES.INFO }] };
          mountComponent();

          expect(getMessages()).toHaveLength(1);
          expect(getMessages()[0]).toHaveTextContent(/^Info message$/);
        });
      });

      describe('When the type is unknown', () => {
        it('fails custom prop validation', () => {
          mockProps = { validationMessages: [{ message: 'Unknown', type: 'unknown' }] as unknown as ValidationMessage[] };
          mountComponent();

          expect(getMessages()).toHaveLength(0);
        });
      });
    });
  });
});
