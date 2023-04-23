import { VALIDATION_MESSAGE_TYPES } from './constants';
import { validationMessageValidator } from './validators';

describe('Validator Tests', () => {
  describe('validationMessageValidator', () => {
    // Test Environment
    let rawMessages;

    describe('when no message list is provided', () => {
      it(
        'should return true',
        () => { expect(validationMessageValidator()).toBe(true); }
      );
    });

    describe('when message list is undefined', () => {
      it(
        'should return true',
        () => { expect(validationMessageValidator(undefined)).toBe(true); }
      );
    });

    describe('when message list is null', () => {
      it(
        'should return true',
        () => { expect(validationMessageValidator(null)).toBe(true); }
      );
    });

    describe('when message list is empty', () => {
      it(
        'should return true',
        () => { expect(validationMessageValidator([])).toBe(true); }
      );
    });

    describe('when message list contains strings', () => {
      // Test Setup
      beforeEach(() => {
        rawMessages = ['message 1', 'message 2'];
      });

      it(
        'should return true',
        () => { expect(validationMessageValidator(rawMessages)).toBe(true); }
      );
    });

    describe('when message list contains valid objects', () => {
      // Test Setup
      beforeEach(() => {
        rawMessages = [{
          message: 'message',
          type: VALIDATION_MESSAGE_TYPES.SUCCESS,
        }];
      });

      it(
        'should return true',
        () => { expect(validationMessageValidator(rawMessages)).toBe(true); }
      );
    });

    describe('when message list contains strings and valid objects', () => {
      // Test Setup
      beforeEach(() => {
        rawMessages = [
          'message 1',
          {
            message: 'message 2',
            type: VALIDATION_MESSAGE_TYPES.SUCCESS,
          },
        ];
      });

      it(
        'should return true',
        () => { expect(validationMessageValidator(rawMessages)).toBe(true); }
      );
    });

    describe('when message list contains an invalid object', () => {
      // Test Setup
      beforeEach(() => {
        rawMessages = [{ message: 'message' }];
      });

      it(
        'should return false',
        () => { expect(validationMessageValidator(rawMessages)).toBe(false); }
      );
    });

    describe('when message list contains an invalid type', () => {
      // Test Setup
      beforeEach(() => {
        rawMessages = [123];
      });

      it(
        'should return false',
        () => { expect(validationMessageValidator(rawMessages)).toBe(false); }
      );
    });
  });
});
