import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createFrameCoalescer } from './frameCoalescer.js';

// Hand-driven frame queue, so the tests assert on how many times the callback ran rather
// than on timing.
const createFrameQueue = () => {
  const pending = new Map();
  let nextHandle = 0;

  return {
    request (callback) {
      const handle = nextHandle;
      nextHandle += 1;
      pending.set(handle, callback);

      return handle;
    },
    cancel (handle) {
      pending.delete(handle);
    },
    flush () {
      const callbacks = [...pending.values()];
      pending.clear();
      callbacks.forEach(callback => callback());
    },
    get size () {
      return pending.size;
    },
  };
};

describe('createFrameCoalescer', () => {
  it('runs once for many schedule calls in the same frame', () => {
    const queue = createFrameQueue();
    let runs = 0;
    const coalescer = createFrameCoalescer(() => { runs += 1; }, queue);

    coalescer.schedule();
    coalescer.schedule();
    coalescer.schedule();

    assert.equal(runs, 0, 'nothing runs before the frame');
    queue.flush();
    assert.equal(runs, 1);
  });

  it('can be scheduled again after it has run', () => {
    const queue = createFrameQueue();
    let runs = 0;
    const coalescer = createFrameCoalescer(() => { runs += 1; }, queue);

    coalescer.schedule();
    queue.flush();
    coalescer.schedule();
    queue.flush();

    assert.equal(runs, 2);
  });

  it('does not run after cancel, and drops the queued frame', () => {
    const queue = createFrameQueue();
    let runs = 0;
    const coalescer = createFrameCoalescer(() => { runs += 1; }, queue);

    coalescer.schedule();
    coalescer.cancel();

    assert.equal(queue.size, 0, 'the frame is released, not left pending');
    queue.flush();
    assert.equal(runs, 0);
  });

  it('reports whether a frame is pending', () => {
    const queue = createFrameQueue();
    const coalescer = createFrameCoalescer(() => {}, queue);

    assert.equal(coalescer.isScheduled(), false);
    coalescer.schedule();
    assert.equal(coalescer.isScheduled(), true);
    queue.flush();
    assert.equal(coalescer.isScheduled(), false);
  });

  it('cancel is a no-op when nothing is scheduled', () => {
    const queue = createFrameQueue();
    const coalescer = createFrameCoalescer(() => {}, queue);

    assert.doesNotThrow(() => coalescer.cancel());
    assert.equal(coalescer.isScheduled(), false);
  });

  it('treats handle 0 as a real handle', () => {
    const queue = createFrameQueue(); // first handle it hands out is 0
    let runs = 0;
    const coalescer = createFrameCoalescer(() => { runs += 1; }, queue);

    coalescer.schedule();
    assert.equal(coalescer.isScheduled(), true, 'handle 0 must not read as "not scheduled"');
    coalescer.cancel();
    queue.flush();

    assert.equal(runs, 0);
  });

  it('runs synchronously when there is no frame scheduler', () => {
    let runs = 0;
    const coalescer = createFrameCoalescer(() => { runs += 1; }, { request: null, cancel: null });

    coalescer.schedule();

    assert.equal(runs, 1, 'work is done rather than dropped');
    assert.equal(coalescer.isScheduled(), false);
  });
});
