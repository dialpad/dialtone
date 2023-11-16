export function itBehavesLikeEmitsExpectedEvent (wrapper, event, value) {
  if (typeof value === 'object') {
    expect(wrapper.emitted(event)[0][0]).toEqual(value);
  } else {
    expect(wrapper.emitted(event)[0][0]).toBe(value);
  }
}

export function itBehavesLikeDoesNotEmitEvents (wrapper) {
  expect(wrapper.emitted()).toEqual({});
}

export default {
  itBehavesLikeDoesNotEmitEvents,
  itBehavesLikeEmitsExpectedEvent,
};
