// Assumes that only a single event has been emitted
export function itBehavesLikeEmitsExpectedEvent (wrapper, event, value) {
  const lastEmittedEvent = wrapper.emitted(event).length - 1;
  if (typeof value === 'object') {
    expect(wrapper.emitted(event)[lastEmittedEvent][0]).toEqual(value);
  } else {
    expect(wrapper.emitted(event)[lastEmittedEvent][0]).toBe(value);
  }
}

export function itBehavesLikeDoesNotEmitEvents (wrapper) {
  expect(wrapper.emitted()).toEqual({});
}

export default {
  itBehavesLikeDoesNotEmitEvents,
  itBehavesLikeEmitsExpectedEvent,
};
