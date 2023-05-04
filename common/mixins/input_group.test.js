import { InputGroupMixin } from './input_group';
import {
  itBehavesLikePassesCustomPropValidation,
  itBehavesLikeFailsCustomPropValidation,
} from '../../tests/shared_examples/validation';

describe('Input Group Mixin Tests', () => {
  describe('Validation Tests', () => {
    describe('messages', () => {
      // Test Environment
      const prop = InputGroupMixin.props.messages;

      itBehavesLikePassesCustomPropValidation(prop, ['Error']);

      describe('When the provided messages are numeric', () => {
        itBehavesLikeFailsCustomPropValidation(prop, [123]);
      });
    });
  });
});
