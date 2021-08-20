import { assert } from 'chai';

export function itBehavesLikeHasValidationClasses (
  wrapper,
  inputValidationClasses,
  validationState,
) {
  assert.strictEqual(
    wrapper.find(`.${inputValidationClasses[validationState]}`).exists(),
    true,
    'has input validation class',
  );
}

export function itBehavesLikeChecked (input) {
  assert.strictEqual(input.element.checked, true, 'should be checked');
}

export function itBehavesLikeNotChecked (input) {
  assert.strictEqual(input.element.checked, false, 'should not be checked');
}

export default {
  itBehavesLikeHasValidationClasses,
  itBehavesLikeChecked,
  itBehavesLikeNotChecked,
};
