import { VALIDATION_MESSAGE_TYPES } from './constants';
import { validationMessageValidator, ordinalSizeValidator } from './validators';

describe('Validator Tests', () => {
  describe('validationMessageValidator', () => {
    // Test Environment
    let rawMessages;

    describe('when no message list is provided', () => {
      it(
        'should return true',
        () => { expect(validationMessageValidator()).toBe(true); },
      );
    });

    describe('when message list is undefined', () => {
      it(
        'should return true',
        () => { expect(validationMessageValidator(undefined)).toBe(true); },
      );
    });

    describe('when message list is null', () => {
      it(
        'should return true',
        () => { expect(validationMessageValidator(null)).toBe(true); },
      );
    });

    describe('when message list is empty', () => {
      it(
        'should return true',
        () => { expect(validationMessageValidator([])).toBe(true); },
      );
    });

    describe('when message list contains strings', () => {
      // Test Setup
      beforeEach(() => {
        rawMessages = ['message 1', 'message 2'];
      });

      it(
        'should return true',
        () => { expect(validationMessageValidator(rawMessages)).toBe(true); },
      );
    });

    describe('when message list contains valid objects', () => {
      // Test Setup
      beforeEach(() => {
        rawMessages = [{
          message: 'message',
          type: VALIDATION_MESSAGE_TYPES.POSITIVE,
        }];
      });

      it(
        'should return true',
        () => { expect(validationMessageValidator(rawMessages)).toBe(true); },
      );
    });

    describe('when message list contains strings and valid objects', () => {
      // Test Setup
      beforeEach(() => {
        rawMessages = [
          'message 1',
          {
            message: 'message 2',
            type: VALIDATION_MESSAGE_TYPES.POSITIVE,
          },
        ];
      });

      it(
        'should return true',
        () => { expect(validationMessageValidator(rawMessages)).toBe(true); },
      );
    });

    describe('when message list contains an invalid object', () => {
      // Test Setup
      beforeEach(() => {
        rawMessages = [{ message: 'message' }];
      });

      it(
        'should return false',
        () => { expect(validationMessageValidator(rawMessages)).toBe(false); },
      );
    });

    describe('when message list contains an invalid type', () => {
      // Test Setup
      beforeEach(() => {
        rawMessages = [123];
      });

      it(
        'should return false',
        () => { expect(validationMessageValidator(rawMessages)).toBe(false); },
      );
    });
  });

  describe('ordinalSizeValidator', () => {
    // Test Environment
    let validate;

    beforeEach(() => {
      validate = ordinalSizeValidator({ 100: 'a', 200: 'b', xs: 'a', sm: 'b' });
    });

    describe('when given a string that matches a key', () => {
      it(
        'should return true',
        () => { expect(validate('100')).toBe(true); },
      );
    });

    describe('when given a number that matches a key', () => {
      it(
        'should return true',
        () => { expect(validate(100)).toBe(true); },
      );
    });

    describe('when given a deprecated t-shirt alias', () => {
      it(
        'should return true',
        () => { expect(validate('xs')).toBe(true); },
      );
    });

    describe('when given a value with no matching key', () => {
      it(
        'should return false',
        () => { expect(validate(999)).toBe(false); },
      );
    });

    describe('when given an array of valid sizes', () => {
      beforeEach(() => {
        validate = ordinalSizeValidator(['100', '200', 'xs']);
      });

      it(
        'should return true for a matching number',
        () => { expect(validate(100)).toBe(true); },
      );

      it(
        'should return false for a non-matching value',
        () => { expect(validate(300)).toBe(false); },
      );
    });
  });
});
