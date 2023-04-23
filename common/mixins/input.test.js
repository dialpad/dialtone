import { InputMixin } from '@/common/mixins/input';
import {
  itBehavesLikePassesCustomPropValidation,
  itBehavesLikeFailsCustomPropValidation,
} from '../../tests/shared_examples/validation';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';

describe('Input Mixin Tests', () => {
  describe('Validation Tests', () => {
    describe('validationState', () => {
      // Test Environment
      const prop = InputMixin.props.validationState;

      describe('When a validation state is not provided', () => {
        itBehavesLikePassesCustomPropValidation(prop);
      });

      describe('When a validation state is provided', () => {
        describe('When validation state is empty', () => {
          itBehavesLikePassesCustomPropValidation(prop, '');
        });

        describe('When validation state is in VALIDATION_MESSAGE_TYPES', () => {
          itBehavesLikePassesCustomPropValidation(prop, VALIDATION_MESSAGE_TYPES.SUCCESS);
        });

        describe('When validation state is not in VALIDATION_MESSAGE_TYPES', () => {
          itBehavesLikeFailsCustomPropValidation(prop, 'not a valid state');
        });
      });
    });
  });
});
