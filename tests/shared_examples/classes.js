export function itBehavesLikeHasCorrectClass (element, className) {
  expect(element.classes(className)).toBe(true);
}

export function itBehavesLikeDoesNotHaveClass (element, className) {
  expect(element.classes(className)).toBe(false);
}

export default {
  itBehavesLikeHasCorrectClass,
  itBehavesLikeDoesNotHaveClass,
};
