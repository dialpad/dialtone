import { assert } from 'chai';
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

describe('Util Tests', function () {
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
    it('should return an empty message list', function () { assert.deepEqual(messageList, []); });
  };

  describe('getUniqueString', function () {
    // Test Environment
    const prefix = 'provided_prefix';

    it('should return a string', function () { assert.exists(getUniqueString()); });
    it('should return a unique string', function () { assert.notStrictEqual(getUniqueString(), getUniqueString()); });
    it('should have default prefix', function () {
      assert.strictEqual(getUniqueString().includes(DEFAULT_PREFIX), true);
    });
    it('should use provided prefix', function () {
      assert.strictEqual(getUniqueString(prefix).includes(prefix), true);
    });
  });

  describe('formatMessages', function () {
    // Test Environment
    let messageList;
    let expectedFormattedMessages;

    // Shared Examples
    const itBehavesLikeReturnsFormattedMessageList = () => {
      it('should return formatted message list', function () {
        assert.deepEqual(formatMessages(messageList), expectedFormattedMessages);
      });
    };

    describe('when no message list is provided', function () {
      itBehavesLikeReturnsEmptyMessageList(formatMessages());
    });

    describe('when an undefined message list is provided', function () {
      itBehavesLikeReturnsEmptyMessageList(formatMessages(undefined));
    });

    describe('when a null message list is provided', function () {
      itBehavesLikeReturnsEmptyMessageList(formatMessages(null));
    });

    describe('when an empty message list is provided', function () {
      itBehavesLikeReturnsEmptyMessageList(formatMessages([]));
    });

    describe('when a message list containing strings is provided', function () {
      beforeEach(function () {
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

    describe('when a message list containing objects is provided', function () {
      // Test Setup
      beforeEach(function () {
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

    describe('when a message list containing strings and objects is provided', function () {
      // Test Setup
      beforeEach(function () {
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

  describe('filterFormattedMessages', function () {
    // Test Environment
    let expectedFilteredFormattedMessages;

    // Shared Examples
    const itBehavesLikeReturnsFilteredFormattedMessageList = () => {
      it('should return filtered formatted message list', function () {
        assert.deepEqual(filterFormattedMessages(formattedMessages), expectedFilteredFormattedMessages);
      });
    };

    describe('when no formatted message list is provided', function () {
      itBehavesLikeReturnsEmptyMessageList(filterFormattedMessages());
    });

    describe('when an undefined formatted message list is provided', function () {
      itBehavesLikeReturnsEmptyMessageList(filterFormattedMessages(undefined));
    });

    describe('when a null formatted message list is provided', function () {
      itBehavesLikeReturnsEmptyMessageList(filterFormattedMessages(null));
    });

    describe('when an empty formatted message list is provided', function () {
      itBehavesLikeReturnsEmptyMessageList(filterFormattedMessages([]));
    });

    describe('when there is only SUCCESS messages', function () {
      // Test Setup
      beforeEach(function () {
        _setFormattedMessages(VALIDATION_MESSAGE_TYPES.SUCCESS);
        expectedFilteredFormattedMessages = formattedMessages;
      });

      itBehavesLikeReturnsFilteredFormattedMessageList();
    });

    describe('when there is a WARNING message', function () {
      // Test Setup
      beforeEach(function () {
        _setFormattedMessages(VALIDATION_MESSAGE_TYPES.WARNING);
        expectedFilteredFormattedMessages = formattedMessages;
      });

      itBehavesLikeReturnsFilteredFormattedMessageList();

      describe('when there is also a SUCCESS message', function () {
        // Test Setup
        beforeEach(function () {
          _addFormattedMessage(VALIDATION_MESSAGE_TYPES.SUCCESS);
        });

        itBehavesLikeReturnsFilteredFormattedMessageList();
      });
    });

    describe('when there is an ERROR message', function () {
      // Test Setup
      beforeEach(function () {
        _setFormattedMessages(VALIDATION_MESSAGE_TYPES.ERROR);
        expectedFilteredFormattedMessages = formattedMessages;
      });

      itBehavesLikeReturnsFilteredFormattedMessageList();

      describe('when there is also a SUCCESS message', function () {
        // Test Setup
        beforeEach(function () {
          _addFormattedMessage(VALIDATION_MESSAGE_TYPES.SUCCESS);
        });

        itBehavesLikeReturnsFilteredFormattedMessageList();
      });

      describe('when there is also a WARNING message', function () {
        // Test Setup
        beforeEach(function () {
          _addFormattedMessage(VALIDATION_MESSAGE_TYPES.WARNING);
        });

        itBehavesLikeReturnsFilteredFormattedMessageList();
      });
    });
  });

  describe('hasFormattedMessageOfType', function () {
    describe('when no formatted message list is provided', function () {
      it('should return false', function () { assert.strictEqual(hasFormattedMessageOfType(), false); });
    });

    describe('when formatted message list is undefined', function () {
      it('should return false', function () {
        assert.strictEqual(hasFormattedMessageOfType(undefined, VALIDATION_MESSAGE_TYPES.ERROR), false);
      });
    });

    describe('when formatted message list is null', function () {
      it('should return false', function () {
        assert.strictEqual(hasFormattedMessageOfType(null, VALIDATION_MESSAGE_TYPES.ERROR), false);
      });
    });

    describe('when the formatted message list is empty', function () {
      it('should return false', function () {
        assert.strictEqual(hasFormattedMessageOfType([], VALIDATION_MESSAGE_TYPES.ERROR), false);
      });
    });

    describe('when there is a formatted message list', function () {
      // Test Setup
      beforeEach(function () {
        _setFormattedMessages(VALIDATION_MESSAGE_TYPES.SUCCESS);
      });

      describe('when there is no given type', function () {
        it('should return false', function () {
          assert.strictEqual(hasFormattedMessageOfType(formattedMessages), false);
        });
      });

      describe('when there is an undefined given type', function () {
        it('should return false', function () {
          assert.strictEqual(hasFormattedMessageOfType(formattedMessages, undefined), false);
        });
      });

      describe('when there is a null given type', function () {
        it('should return false', function () {
          assert.strictEqual(hasFormattedMessageOfType(formattedMessages, null), false);
        });
      });

      describe('when there is an empty given type', function () {
        it('should return false', function () {
          assert.strictEqual(hasFormattedMessageOfType(formattedMessages, ''), false);
        });
      });

      describe('when there is no formatted message of the given type', function () {
        it('should return false', function () {
          assert.strictEqual(hasFormattedMessageOfType(formattedMessages, VALIDATION_MESSAGE_TYPES.ERROR), false);
        });
      });

      describe('when there is a formatted message of the given type', function () {
        it('should return true', function () {
          assert.strictEqual(hasFormattedMessageOfType(formattedMessages, VALIDATION_MESSAGE_TYPES.SUCCESS), true);
        });
      });
    });
  });

  describe('getValidationState', function () {
    // Test Setup
    beforeEach(function () {
      _setFormattedMessages(VALIDATION_MESSAGE_TYPES.SUCCESS);
    });

    describe('when all message types are SUCCESS', function () {
      it('should return SUCCESS', function () {
        assert.strictEqual(getValidationState(formattedMessages), VALIDATION_MESSAGE_TYPES.SUCCESS);
      });
    });

    describe('when there is a WARNING message type', function () {
      // Test Setup
      beforeEach(function () {
        _addFormattedMessage(VALIDATION_MESSAGE_TYPES.WARNING);
      });

      it('should return WARNING', function () {
        assert.strictEqual(getValidationState(formattedMessages), VALIDATION_MESSAGE_TYPES.WARNING);
      });
    });

    describe('when there is an ERROR message type', function () {
      // Test Setup
      beforeEach(function () {
        _addFormattedMessage(VALIDATION_MESSAGE_TYPES.WARNING);
        _addFormattedMessage(VALIDATION_MESSAGE_TYPES.ERROR);
      });

      it('should return ERROR', function () {
        assert.strictEqual(getValidationState(formattedMessages), VALIDATION_MESSAGE_TYPES.ERROR);
      });
    });
  });
});
