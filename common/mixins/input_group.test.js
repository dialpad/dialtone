import { InputGroupMixin } from '@/common/mixins/input_group';
import {
  itBehavesLikePassesCustomPropValidation,
  itBehavesLikeFailsCustomPropValidation,
} from '../../tests/shared_examples/validation';

describe('Input Group Mixin Tests', function () {
  describe('Validation Tests', function () {
    describe('messages', function () {
      // Test Environment
      const prop = InputGroupMixin.props.messages;

      itBehavesLikePassesCustomPropValidation(prop, ['Error']);

      describe('When the provided messages are numeric', function () {
        itBehavesLikeFailsCustomPropValidation(prop, [123]);
      });
    });
  });
});
