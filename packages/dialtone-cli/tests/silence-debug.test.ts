import { describe, test, expect, beforeEach, afterEach, afterAll } from 'vitest';

const realError = console.error;
const seen: unknown[][] = [];

// silenceDebug wraps console.error as it is when its module loads, so install
// the recorder first and import the module after it.
console.error = (...args: unknown[]) => { seen.push(args); };
const { silenceDebug, restoreDebug } = await import('../src/silence-debug.js');

beforeEach(() => {
  seen.length = 0;
  delete process.env.DIALTONE_DEBUG;
});
afterEach(() => restoreDebug());
afterAll(() => { console.error = realError; });

describe('silenceDebug', () => {
  // Query-core's debug calls often pass more arguments, e.g. the parsed words.
  test.each([
    '[CLASS SEARCH DEBUG] x', '[TOKEN SEARCH DEBUG] x', '[COMPONENT SEARCH DEBUG] x',
    '[ICON SEARCH DEBUG] x', '[FILTER] x', '\n[COMPONENT SEARCH DEBUG] x',
  ])('hides %j', (line) => {
    silenceDebug();
    console.error(line, 'extra arg');
    expect(seen).toEqual([]);
  });

  // A lookalike tag, e.g. a real error, and a plain CLI message.
  test.each(['[COMPONENT SEARCH ERROR] boom', 'No component found matching "x".'])('keeps %j, with all its arguments', (line) => {
    silenceDebug();
    console.error(line, 'extra arg');
    expect(seen).toEqual([[line, 'extra arg']]);
  });

  test('DIALTONE_DEBUG=1 keeps debug output', () => {
    process.env.DIALTONE_DEBUG = '1';
    silenceDebug();
    console.error('[COMPONENT SEARCH DEBUG] x');
    expect(seen).toEqual([['[COMPONENT SEARCH DEBUG] x']]);
  });

  test('DIALTONE_DEBUG=0 stays silent', () => {
    process.env.DIALTONE_DEBUG = '0';
    silenceDebug();
    console.error('[COMPONENT SEARCH DEBUG] x');
    expect(seen).toEqual([]);
  });
});
