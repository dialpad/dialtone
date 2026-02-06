export function itBehavesLikeHasValidationClasses (
  wrapper,
  inputValidationClasses,
  validationState,
) {
  expect(wrapper.find(`.${inputValidationClasses[validationState]}`).exists()).toBe(true);
}

export function itBehavesLikeChecked (input) {
  expect(input.element.checked).toBe(true);
}

export function itBehavesLikeNotChecked (input) {
  expect(input.element.checked).toBe(false);
}

export function itBehavesLikeIndeterminate (input) {
  expect(input.element.indeterminate).toBe(true);
}

export default {
  itBehavesLikeHasValidationClasses,
  itBehavesLikeChecked,
  itBehavesLikeNotChecked,
  itBehavesLikeIndeterminate,
};
