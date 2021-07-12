import { assert } from 'chai';

// Assumes that the element is unique
export function itBehavesLikeAppliesClassToChild (wrapper, className, element) {
  assert.strictEqual(wrapper.find(className).html(), element.html(), 'applies custom class to child');
}

export function itBehavesLikeAppliesChildProp (element, propName, propValue) {
  assert.strictEqual(element.attributes(propName), propValue, 'has provided child prop');
}

export function itBehavesLikePassesChildProp (element, propName, propValue) {
  assert.strictEqual(element.props(propName), propValue, 'has passed down child prop');
}

export default {
  itBehavesLikeAppliesClassToChild,
  itBehavesLikeAppliesChildProp,
  itBehavesLikePassesChildProp,
};
