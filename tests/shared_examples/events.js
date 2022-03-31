import { assert } from 'chai';

// Assumes that only a single event has been emitted
export function itBehavesLikeEmitsExpectedEvent (wrapper, event, value) {
  const lastEmittedEvent = wrapper.emitted(event).length - 1;
  if (typeof value === 'object') {
    assert.deepEqual(wrapper.emitted(event)[lastEmittedEvent][0], value, 'emits expected event');
  } else {
    assert.strictEqual(wrapper.emitted(event)[lastEmittedEvent][0], value, 'emits expected event');
  }
}

export function itBehavesLikeDoesNotEmitEvents (wrapper) {
  assert.deepEqual(wrapper.emitted(), {}, 'no events are emitted');
}

export default {
  itBehavesLikeDoesNotEmitEvents,
  itBehavesLikeEmitsExpectedEvent,
};
