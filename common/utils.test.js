import {
  DEFAULT_VALIDATION_MESSAGE_TYPE,
  VALIDATION_MESSAGE_TYPES,
  DEFAULT_PREFIX,
} from './constants';

import {
  getUniqueString,
  formatMessages,
  filterFormattedMessages,
  hasFormattedMessageOfType,
  getValidationState,
} from './utils';

describe('Util Tests', () => {
  // Test Environment
  let formattedMessages;

  // Helpers
  const _setFormattedMessages = (messageType) => {
    formattedMessages = [{
      message: 'message',
      type: messageType,
    }];
  };

  const _addFormattedMessage = (messageType) => {
    formattedMessages = [...formattedMessages, {
      message: 'message',
      type: messageType,
    }];
  };

  // Shared Examples
  const itBehavesLikeReturnsEmptyMessageList = (messageList) => {
    it(
      'should return an empty message list',
      () => { expect(messageList).toEqual([]); },
    );
  };

  describe('getUniqueString', () => {
    // Test Environment
    const prefix = 'provided_prefix';

    it(
      'should return a string',
      () => { expect(getUniqueString()).toBeTruthy(); },
    );
    it(
      'should return a unique string',
      () => { expect(getUniqueString()).not.toBe(getUniqueString()); },
    );
    it('should have default prefix', () => {
      expect(getUniqueString().includes(DEFAULT_PREFIX)).toBe(true);
    });
    it('should use provided prefix', () => {
      expect(getUniqueString(prefix).includes(prefix)).toBe(true);
    });
  });

  describe('formatMessages', () => {
    // Test Environment
    let messageList;
    let expectedFormattedMessages;

    // Shared Examples
    const itBehavesLikeReturnsFormattedMessageList = () => {
      it('should return formatted message list', () => {
        expect(formatMessages(messageList)).toEqual(expectedFormattedMessages);
      });
    };

    describe('when no message list is provided', () => {
      itBehavesLikeReturnsEmptyMessageList(formatMessages());
    });

    describe('when an undefined message list is provided', () => {
      itBehavesLikeReturnsEmptyMessageList(formatMessages(undefined));
    });

    describe('when a null message list is provided', () => {
      itBehavesLikeReturnsEmptyMessageList(formatMessages(null));
    });

    describe('when an empty message list is provided', () => {
      itBehavesLikeReturnsEmptyMessageList(formatMessages([]));
    });

    describe('when a message list containing strings is provided', () => {
      beforeEach(() => {
        messageList = ['message 1', 'message 2'];
        expectedFormattedMessages = [
          {
            message: 'message 1',
            type: DEFAULT_VALIDATION_MESSAGE_TYPE,
          },
          {
            message: 'message 2',
            type: DEFAULT_VALIDATION_MESSAGE_TYPE,
          },
        ];
      });

      itBehavesLikeReturnsFormattedMessageList();
    });

    describe('when a message list containing objects is provided', () => {
      // Test Setup
      beforeEach(() => {
        messageList = [
          {
            message: 'message 1',
            type: VALIDATION_MESSAGE_TYPES.WARN,
          },
          {
            message: 'message 2',
            type: VALIDATION_MESSAGE_TYPES.SUCCESS,
          },
        ];
        expectedFormattedMessages = messageList;
      });

      itBehavesLikeReturnsFormattedMessageList();
    });

    describe('when a message list containing strings and objects is provided', () => {
      // Test Setup
      beforeEach(() => {
        messageList = [
          'message 1',
          {
            message: 'message 2',
            type: VALIDATION_MESSAGE_TYPES.SUCCESS,
          },
        ];
        expectedFormattedMessages = [
          {
            message: 'message 1',
            type: DEFAULT_VALIDATION_MESSAGE_TYPE,
          },
          {
            message: 'message 2',
            type: VALIDATION_MESSAGE_TYPES.SUCCESS,
          },
        ];
      });

      itBehavesLikeReturnsFormattedMessageList();
    });
  });

  describe('filterFormattedMessages', () => {
    // Test Environment
    let expectedFilteredFormattedMessages;

    // Shared Examples
    const itBehavesLikeReturnsFilteredFormattedMessageList = () => {
      it('should return filtered formatted message list', () => {
        expect(filterFormattedMessages(formattedMessages)).toEqual(expectedFilteredFormattedMessages);
      });
    };

    describe('when no formatted message list is provided', () => {
      itBehavesLikeReturnsEmptyMessageList(filterFormattedMessages());
    });

    describe('when an undefined formatted message list is provided', () => {
      itBehavesLikeReturnsEmptyMessageList(filterFormattedMessages(undefined));
    });

    describe('when a null formatted message list is provided', () => {
      itBehavesLikeReturnsEmptyMessageList(filterFormattedMessages(null));
    });

    describe('when an empty formatted message list is provided', () => {
      itBehavesLikeReturnsEmptyMessageList(filterFormattedMessages([]));
    });

    describe('when there is only SUCCESS messages', () => {
      // Test Setup
      beforeEach(() => {
        _setFormattedMessages(VALIDATION_MESSAGE_TYPES.SUCCESS);
        expectedFilteredFormattedMessages = formattedMessages;
      });

      itBehavesLikeReturnsFilteredFormattedMessageList();
    });

    describe('when there is a WARNING message', () => {
      // Test Setup
      beforeEach(() => {
        _setFormattedMessages(VALIDATION_MESSAGE_TYPES.WARNING);
        expectedFilteredFormattedMessages = formattedMessages;
      });

      itBehavesLikeReturnsFilteredFormattedMessageList();

      describe('when there is also a SUCCESS message', () => {
        // Test Setup
        beforeEach(() => {
          _addFormattedMessage(VALIDATION_MESSAGE_TYPES.SUCCESS);
        });

        itBehavesLikeReturnsFilteredFormattedMessageList();
      });
    });

    describe('when there is an ERROR message', () => {
      // Test Setup
      beforeEach(() => {
        _setFormattedMessages(VALIDATION_MESSAGE_TYPES.ERROR);
        expectedFilteredFormattedMessages = formattedMessages;
      });

      itBehavesLikeReturnsFilteredFormattedMessageList();

      describe('when there is also a SUCCESS message', () => {
        // Test Setup
        beforeEach(() => {
          _addFormattedMessage(VALIDATION_MESSAGE_TYPES.SUCCESS);
        });

        itBehavesLikeReturnsFilteredFormattedMessageList();
      });

      describe('when there is also a WARNING message', () => {
        // Test Setup
        beforeEach(() => {
          _addFormattedMessage(VALIDATION_MESSAGE_TYPES.WARNING);
        });

        itBehavesLikeReturnsFilteredFormattedMessageList();
      });
    });
  });

  describe('hasFormattedMessageOfType', () => {
    describe('when no formatted message list is provided', () => {
      it(
        'should return false',
        () => { expect(hasFormattedMessageOfType()).toBe(false); },
      );
    });

    describe('when formatted message list is undefined', () => {
      it('should return false', () => {
        expect(hasFormattedMessageOfType(undefined, VALIDATION_MESSAGE_TYPES.ERROR)).toBe(false);
      });
    });

    describe('when formatted message list is null', () => {
      it('should return false', () => {
        expect(hasFormattedMessageOfType(null, VALIDATION_MESSAGE_TYPES.ERROR)).toBe(false);
      });
    });

    describe('when the formatted message list is empty', () => {
      it('should return false', () => {
        expect(hasFormattedMessageOfType([], VALIDATION_MESSAGE_TYPES.ERROR)).toBe(false);
      });
    });

    describe('when there is a formatted message list', () => {
      // Test Setup
      beforeEach(() => {
        _setFormattedMessages(VALIDATION_MESSAGE_TYPES.SUCCESS);
      });

      describe('when there is no given type', () => {
        it('should return false', () => {
          expect(hasFormattedMessageOfType(formattedMessages)).toBe(false);
        });
      });

      describe('when there is an undefined given type', () => {
        it('should return false', () => {
          expect(hasFormattedMessageOfType(formattedMessages, undefined)).toBe(false);
        });
      });

      describe('when there is a null given type', () => {
        it('should return false', () => {
          expect(hasFormattedMessageOfType(formattedMessages, null)).toBe(false);
        });
      });

      describe('when there is an empty given type', () => {
        it('should return false', () => {
          expect(hasFormattedMessageOfType(formattedMessages, '')).toBe(false);
        });
      });

      describe('when there is no formatted message of the given type', () => {
        it('should return false', () => {
          expect(
            hasFormattedMessageOfType(formattedMessages, VALIDATION_MESSAGE_TYPES.ERROR),
          ).toBe(false);
        });
      });

      describe('when there is a formatted message of the given type', () => {
        it('should return true', () => {
          expect(
            hasFormattedMessageOfType(formattedMessages, VALIDATION_MESSAGE_TYPES.SUCCESS),
          ).toBe(true);
        });
      });
    });
  });

  describe('getValidationState', () => {
    // Test Setup
    beforeEach(() => {
      _setFormattedMessages(VALIDATION_MESSAGE_TYPES.SUCCESS);
    });

    describe('when all message types are SUCCESS', () => {
      it('should return SUCCESS', () => {
        expect(getValidationState(formattedMessages)).toBe(VALIDATION_MESSAGE_TYPES.SUCCESS);
      });
    });

    describe('when there is a WARNING message type', () => {
      // Test Setup
      beforeEach(() => {
        _addFormattedMessage(VALIDATION_MESSAGE_TYPES.WARNING);
      });

      it('should return WARNING', () => {
        expect(getValidationState(formattedMessages)).toBe(VALIDATION_MESSAGE_TYPES.WARNING);
      });
    });

    describe('when there is an ERROR message type', () => {
      // Test Setup
      beforeEach(() => {
        _addFormattedMessage(VALIDATION_MESSAGE_TYPES.WARNING);
        _addFormattedMessage(VALIDATION_MESSAGE_TYPES.ERROR);
      });

      it('should return ERROR', () => {
        expect(getValidationState(formattedMessages)).toBe(VALIDATION_MESSAGE_TYPES.ERROR);
      });
    });
  });
});
