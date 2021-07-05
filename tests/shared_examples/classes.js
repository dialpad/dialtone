import { assert } from 'chai';

export function itBehavesLikeHasCorrectClass (element, className) {
  assert.isTrue(element.classes(className));
}

export default {
  itBehavesLikeHasCorrectClass,
};
