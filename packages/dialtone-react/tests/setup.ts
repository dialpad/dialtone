// Mirrors dialtone-vue's tests/setupTests.js, so both sides of a parity run see the same environment.
import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/react';

// Components tag their parts with data-qa, as in dialtone-vue, so getByTestId finds those.
configure({ testIdAttribute: 'data-qa' });

// Testing Library only recognizes Jest's fake timers. Without this, user-event deadlocks under vi.useFakeTimers().
(globalThis as { jest?: unknown }).jest = { advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms) };

class MockObserver {
  observe () {}
  disconnect () {}
  unobserve () {}
}

// jsdom has neither; simulatePaste (tests/helpers/clipboard.ts) dispatches a paste carrying one.
class MockClipboardEvent extends Event {
  clipboardData: DataTransfer | null;

  constructor (type: string, options: ClipboardEventInit = {}) {
    super(type, options);
    this.clipboardData = options.clipboardData ?? null;
  }
}

class MockDataTransfer {
  types: string[] = [];
  data = new Map<string, string>();

  getData (format: string) {
    return this.data.get(format) || '';
  }

  setData (format: string, data: string) {
    this.data.set(format, data);
    if (!this.types.includes(format)) this.types.push(format);
  }
}

beforeAll(() => {
  globalThis.IntersectionObserver = MockObserver as unknown as typeof IntersectionObserver;
  globalThis.ResizeObserver = MockObserver as unknown as typeof ResizeObserver;
  globalThis.ClipboardEvent = MockClipboardEvent as unknown as typeof ClipboardEvent;
  globalThis.DataTransfer = MockDataTransfer as unknown as typeof DataTransfer;

  // :focus-visible isn't supported by jsdom (https://github.com/jsdom/jsdom/issues/3426).
  const matchesOriginal = HTMLElement.prototype.matches;
  HTMLElement.prototype.matches = function (query: string) {
    if (query === ':focus-visible') return false;
    return matchesOriginal.call(this, query);
  };
});

// Every test must assert something (parity.md › Anti-gaming).
beforeEach(() => {
  expect.hasAssertions();
});
