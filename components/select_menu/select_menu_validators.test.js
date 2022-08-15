import { assert } from 'chai';
import { optionsValidator } from './select_menu_validators';

describe('DtSelectMenuValidator Tests', function () {
  describe('optionsValidator', function () {
    // Test Environment
    let options;

    describe('when no option list is provided', function () {
      it('should return true', function () { assert.strictEqual(optionsValidator(), true); });
    });

    describe('when option list is undefined', function () {
      it('should return true', function () { assert.strictEqual(optionsValidator(undefined), true); });
    });

    describe('when option list is null', function () {
      it('should return true', function () { assert.strictEqual(optionsValidator(null), true); });
    });

    describe('when option list is empty', function () {
      it('should return true', function () { assert.strictEqual(optionsValidator([]), true); });
    });

    describe('when option list contains valid objects', function () {
      describe('when option value is a number', function () {
        // Test Setup
        beforeEach(function () {
          options = [{ value: 1, label: 'Option 1' }];
        });

        it('should return true', function () { assert.strictEqual(optionsValidator(options), true); });
      });

      describe('when option value is a string', function () {
        // Test Setup
        beforeEach(function () {
          options = [{ value: '1', label: 'Option 1' }];
        });

        it('should return true', function () { assert.strictEqual(optionsValidator(options), true); });
      });

      describe('when option has an index', function () {
        // Test Setup
        beforeEach(function () {
          options = [{ index: 1, value: 1, label: 'Option 1' }];
        });

        it('should return true', function () { assert.strictEqual(optionsValidator(options), true); });
      });
    });

    describe('when option list contains an invalid object', function () {
      describe('when option is missing a value', function () {
        // Test Setup
        beforeEach(function () {
          options = [{ label: 'Option 1' }];
        });

        it('should return false', function () { assert.strictEqual(optionsValidator(options), false); });
      });

      describe('when option is missing a label', function () {
        // Test Setup
        beforeEach(function () {
          options = [{ value: 1 }];
        });

        it('should return false', function () { assert.strictEqual(optionsValidator(options), false); });
      });

      describe('when option value is an invalid type', function () {
        // Test Setup
        beforeEach(function () {
          options = [{ value: [], label: 'Option 1' }];
        });

        it('should return false', function () { assert.strictEqual(optionsValidator(options), false); });
      });

      describe('when option label is an invalid type', function () {
        // Test Setup
        beforeEach(function () {
          options = [{ value: 1, label: 1 }];
        });

        it('should return false', function () { assert.strictEqual(optionsValidator(options), false); });
      });
    });
  });
});
