import { optionsValidator } from './select_menu_validators';

describe('DtSelectMenuValidator Tests', () => {
  describe('optionsValidator', () => {
    // Test Environment
    let options;

    describe('when no option list is provided', () => {
      it(
        'should return true',
        () => { expect(optionsValidator()).toBe(true); }
      );
    });

    describe('when option list is undefined', () => {
      it(
        'should return true',
        () => { expect(optionsValidator(undefined)).toBe(true); }
      );
    });

    describe('when option list is null', () => {
      it(
        'should return true',
        () => { expect(optionsValidator(null)).toBe(true); }
      );
    });

    describe('when option list is empty', () => {
      it(
        'should return true',
        () => { expect(optionsValidator([])).toBe(true); }
      );
    });

    describe('when option list contains valid objects', () => {
      describe('when option value is a number', () => {
        // Test Setup
        beforeEach(() => {
          options = [{ value: 1, label: 'Option 1' }];
        });

        it(
          'should return true',
          () => { expect(optionsValidator(options)).toBe(true); }
        );
      });

      describe('when option value is a string', () => {
        // Test Setup
        beforeEach(() => {
          options = [{ value: '1', label: 'Option 1' }];
        });

        it(
          'should return true',
          () => { expect(optionsValidator(options)).toBe(true); }
        );
      });

      describe('when option has an index', () => {
        // Test Setup
        beforeEach(() => {
          options = [{ index: 1, value: 1, label: 'Option 1' }];
        });

        it(
          'should return true',
          () => { expect(optionsValidator(options)).toBe(true); }
        );
      });
    });

    describe('when option list contains an invalid object', () => {
      describe('when option is missing a value', () => {
        // Test Setup
        beforeEach(() => {
          options = [{ label: 'Option 1' }];
        });

        it(
          'should return false',
          () => { expect(optionsValidator(options)).toBe(false); }
        );
      });

      describe('when option is missing a label', () => {
        // Test Setup
        beforeEach(() => {
          options = [{ value: 1 }];
        });

        it(
          'should return false',
          () => { expect(optionsValidator(options)).toBe(false); }
        );
      });

      describe('when option value is an invalid type', () => {
        // Test Setup
        beforeEach(() => {
          options = [{ value: [], label: 'Option 1' }];
        });

        it(
          'should return false',
          () => { expect(optionsValidator(options)).toBe(false); }
        );
      });

      describe('when option label is an invalid type', () => {
        // Test Setup
        beforeEach(() => {
          options = [{ value: 1, label: 1 }];
        });

        it(
          'should return false',
          () => { expect(optionsValidator(options)).toBe(false); }
        );
      });
    });
  });
});
