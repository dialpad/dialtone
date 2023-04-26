export function itBehavesLikeAppliesClassToChild (wrapper, className, element) {
  expect(wrapper.find(className).html()).toBe(element.html());
}

export function itBehavesLikeAppliesChildProp (element, propName, propValue) {
  expect(element.attributes(propName)).toBe(propValue);
}

export function itBehavesLikePassesChildProp (element, propName, propValue) {
  expect(element.props(propName)).toBe(propValue);
}

export default {
  itBehavesLikeAppliesClassToChild,
  itBehavesLikeAppliesChildProp,
  itBehavesLikePassesChildProp,
};
