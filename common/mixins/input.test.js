import { InputMixin } from '@/common/mixins/input';
import {
  itBehavesLikePassesCustomPropValidation,
  itBehavesLikeFailsCustomPropValidation,
} from '../../tests/shared_examples/validation';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';

describe('Input Mixin Tests', function () {
  describe('Validation Tests', function () {
    describe('validationState', function () {
      // Test Environment
      const prop = InputMixin.props.validationState;

      describe('When a validation state is not provided', function () {
        itBehavesLikePassesCustomPropValidation(prop);
      });

      describe('When a validation state is provided', function () {
        describe('When validation state is empty', function () {
          itBehavesLikePassesCustomPropValidation(prop, '');
        });

        describe('When validation state is in VALIDATION_MESSAGE_TYPES', function () {
          itBehavesLikePassesCustomPropValidation(prop, VALIDATION_MESSAGE_TYPES.SUCCESS);
        });

        describe('When validation state is not in VALIDATION_MESSAGE_TYPES', function () {
          itBehavesLikeFailsCustomPropValidation(prop, 'not a valid state');
        });
      });
    });
  });
});
