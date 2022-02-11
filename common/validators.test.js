import { assert } from 'chai';
import { VALIDATION_MESSAGE_TYPES } from './constants';
import { validationMessageValidator } from './validators';

describe('Validator Tests', function () {
  describe('validationMessageValidator', function () {
    // Test Environment
    let rawMessages;

    describe('when no message list is provided', function () {
      it('should return true', function () { assert.strictEqual(validationMessageValidator(), true); });
    });

    describe('when message list is undefined', function () {
      it('should return true', function () { assert.strictEqual(validationMessageValidator(undefined), true); });
    });

    describe('when message list is null', function () {
      it('should return true', function () { assert.strictEqual(validationMessageValidator(null), true); });
    });

    describe('when message list is empty', function () {
      it('should return true', function () { assert.strictEqual(validationMessageValidator([]), true); });
    });

    describe('when message list contains strings', function () {
      // Test Setup
      beforeEach(function () {
        rawMessages = ['message 1', 'message 2'];
      });

      it('should return true', function () { assert.strictEqual(validationMessageValidator(rawMessages), true); });
    });

    describe('when message list contains valid objects', function () {
      // Test Setup
      beforeEach(function () {
        rawMessages = [{
          message: 'message',
          type: VALIDATION_MESSAGE_TYPES.SUCCESS,
        }];
      });

      it('should return true', function () { assert.strictEqual(validationMessageValidator(rawMessages), true); });
    });

    describe('when message list contains strings and valid objects', function () {
      // Test Setup
      beforeEach(function () {
        rawMessages = [
          'message 1',
          {
            message: 'message 2',
            type: VALIDATION_MESSAGE_TYPES.SUCCESS,
          },
        ];
      });

      it('should return true', function () { assert.strictEqual(validationMessageValidator(rawMessages), true); });
    });

    describe('when message list contains an invalid object', function () {
      // Test Setup
      beforeEach(function () {
        rawMessages = [{ message: 'message' }];
      });

      it('should return false', function () { assert.strictEqual(validationMessageValidator(rawMessages), false); });
    });

    describe('when message list contains an invalid type', function () {
      // Test Setup
      beforeEach(function () {
        rawMessages = [123];
      });

      it('should return false', function () { assert.strictEqual(validationMessageValidator(rawMessages), false); });
    });
  });
});
